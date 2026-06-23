import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const GEMINI_MODEL = 'gemini-2.5-flash-image'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email, modelo, image_base64 } = await req.json()

    if (!email || !modelo || !image_base64) {
      return new Response(JSON.stringify({ error: 'parametros_faltan' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (!['capri','peachy','daisy'].includes(modelo)) {
      return new Response(JSON.stringify({ error: 'modelo_invalido' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. Validar lead y cuota
    const { data: lead } = await supabase.from('probador_leads').select('*').eq('email', email).maybeSingle()
    if (!lead) {
      return new Response(JSON.stringify({ error: 'lead_no_existe' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (lead.uses_count >= lead.max_uses) {
      return new Response(JSON.stringify({ error: 'cuota_agotada', remaining_uses: 0 }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 2. Obtener URL de imagen de referencia del modelo desde tabla products
    const { data: producto } = await supabase
      .from('products')
      .select('images')
      .ilike('slug', `arnes-${modelo}%`)
      .limit(1)
      .maybeSingle()

    const referenceUrl = producto?.images?.[0]
    if (!referenceUrl) {
      return new Response(JSON.stringify({ error: 'referencia_no_encontrada' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Descargar imagen de referencia y convertir a base64
    const refResp = await fetch(referenceUrl)
    if (!refResp.ok) throw new Error('No se pudo descargar la referencia')
    const refBuf = await refResp.arrayBuffer()
    const refBase64 = btoa(String.fromCharCode(...new Uint8Array(refBuf)))
    const refMime = refResp.headers.get('content-type') || 'image/webp'

    // Limpiar prefijo data: si viene
    const cleanImage = image_base64.replace(/^data:image\/\w+;base64,/, '')

    // 3. Llamar a Gemini 2.5 Flash Image
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: 'gemini_no_configurado' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const prompt = `Genera una fotografía fotorrealista del perro de la imagen 1 llevando puesto el arnés de la imagen 2. Conserva exactamente la pose, la raza, el pelaje, la expresión, la iluminación y el entorno de la imagen 1. Solo añade el arnés ajustado al cuerpo del perro de forma natural y proporcionada. La textura, los colores y el estampado del arnés deben coincidir fielmente con la imagen 2. Resultado: una sola imagen fotorrealista, sin texto, sin marcos, sin elementos adicionales.`

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/jpeg', data: cleanImage } },
              { inline_data: { mime_type: refMime, data: refBase64 } },
            ],
          }],
        }),
      }
    )

    if (!geminiResp.ok) {
      const errText = await geminiResp.text()
      console.error('Gemini error:', errText)
      return new Response(JSON.stringify({ error: 'generacion_fallida' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const geminiData = await geminiResp.json()
    const generatedPart = geminiData.candidates?.[0]?.content?.parts?.find((p: any) => p.inline_data || p.inlineData)
    const generatedBase64 = generatedPart?.inline_data?.data || generatedPart?.inlineData?.data

    if (!generatedBase64) {
      console.error('Gemini sin imagen:', JSON.stringify(geminiData).slice(0, 500))
      return new Response(JSON.stringify({ error: 'sin_imagen_generada' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 4. Incrementar contador de usos
    const { error: updErr } = await supabase
      .from('probador_leads')
      .update({ uses_count: lead.uses_count + 1, last_used_at: new Date().toISOString() })
      .eq('email', email)
    if (updErr) console.error('Update count error:', updErr)

    // 5. Devolver imagen generada (watermark se aplica en frontend con canvas, no aquí)
    return new Response(JSON.stringify({
      ok: true,
      image_base64: generatedBase64,
      mime_type: 'image/png',
      remaining_uses: lead.max_uses - (lead.uses_count + 1),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (e) {
    console.error('Generate error:', e)
    return new Response(JSON.stringify({ error: 'server_error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
