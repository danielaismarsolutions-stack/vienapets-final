import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const { email, modelo, age_confirmed, service_consent, newsletter_consent, marketing_image_consent } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'email_invalido' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (!['capri','peachy','daisy'].includes(modelo)) {
      return new Response(JSON.stringify({ error: 'modelo_invalido' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (age_confirmed !== true || service_consent !== true) {
      return new Response(JSON.stringify({ error: 'consentimientos_obligatorios_faltan' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: existing } = await supabase.from('probador_leads').select('*').eq('email', email).maybeSingle()

    let remaining_uses = 3
    if (existing) {
      remaining_uses = Math.max(0, existing.max_uses - existing.uses_count)

      // Si el usuario sube de nivel de consentimiento (false -> true), registrarlo con timestamp
      const updates: Record<string, unknown> = {}
      if (newsletter_consent === true && !existing.newsletter_consent) {
        updates.newsletter_consent = true
        updates.newsletter_consent_at = new Date().toISOString()
      }
      if (marketing_image_consent === true && !existing.marketing_image_consent) {
        updates.marketing_image_consent = true
        updates.marketing_image_consent_at = new Date().toISOString()
      }
      if (Object.keys(updates).length > 0) {
        const { error: updErr } = await supabase.from('probador_leads').update(updates).eq('email', email)
        if (updErr) console.error('Consent update error:', updErr)
      }
    } else {
      const { error: insertErr } = await supabase.from('probador_leads').insert({
        email,
        modelo_inicial: modelo,
        age_confirmed: true,
        service_consent: true,
        newsletter_consent: !!newsletter_consent,
        newsletter_consent_at: newsletter_consent ? new Date().toISOString() : null,
        marketing_image_consent: !!marketing_image_consent,
        marketing_image_consent_at: marketing_image_consent ? new Date().toISOString() : null,
      })
      if (insertErr) {
        console.error('Insert error:', insertErr)
        return new Response(JSON.stringify({ error: 'db_error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    }

    // Sincronizar a Brevo solo si dio consentimiento a newsletter y no estaba sincronizado
    if (newsletter_consent && (!existing || !existing.brevo_synced)) {
      const brevoKey = Deno.env.get('BREVO_API_KEY')
      const brevoListId = Deno.env.get('BREVO_NEWSLETTER_LIST_ID')
      if (brevoKey && brevoListId) {
        try {
          await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              listIds: [parseInt(brevoListId)],
              attributes: { FUENTE: 'probador_ia', MODELO_INICIAL: modelo },
              updateEnabled: true,
            }),
          })
          await supabase.from('probador_leads').update({ brevo_synced: true }).eq('email', email)
        } catch (e) {
          console.error('Brevo sync failed:', e)
          // No bloqueamos al usuario por fallo en Brevo
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, remaining_uses }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Gate error:', e)
    return new Response(JSON.stringify({ error: 'server_error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
