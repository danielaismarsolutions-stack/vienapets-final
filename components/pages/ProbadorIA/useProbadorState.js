"use client";

import { useReducer } from "react";

// Fases del flujo del probador IA
// idle → model_selected → gate_pending → gate_passed → generating → result
//                                      ↘ quota_exhausted
//                                      ↘ error

const initialState = {
  phase: "idle",         // ver fases arriba
  selectedModel: null,
  email: null,
  remainingUses: null,
  imageBase64: null,     // imagen generada por Gemini
  previewObjectUrl: null,// URL.createObjectURL de la foto del cliente
  errorMessage: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_MODEL":
      return {
        ...state,
        selectedModel: action.model,
        phase: state.phase === "idle" ? "model_selected" : state.phase,
        // Si ya estaba en gate_passed o más allá, mantiene esa fase
        imageBase64: null,
        errorMessage: null,
      };

    case "START_GATE":
      return { ...state, phase: "gate_pending", errorMessage: null };

    case "GATE_OK":
      return {
        ...state,
        phase: action.remainingUses > 0 ? "gate_passed" : "quota_exhausted",
        email: action.email,
        remainingUses: action.remainingUses,
        errorMessage: action.remainingUses === 0
          ? "Has agotado tus 3 visualizaciones disponibles para este email"
          : null,
      };

    case "GATE_ERROR":
      return {
        ...state,
        phase: "model_selected",
        errorMessage: action.message,
      };

    case "START_GENERATE":
      return { ...state, phase: "generating", errorMessage: null, previewObjectUrl: action.previewObjectUrl ?? state.previewObjectUrl };

    case "GENERATE_OK":
      return {
        ...state,
        phase: action.remainingUses >= 0 ? (action.remainingUses === 0 && state.remainingUses > 0 ? "result" : "result") : "result",
        imageBase64: action.imageBase64,
        remainingUses: action.remainingUses,
        errorMessage: null,
      };

    case "GENERATE_ERROR":
      return {
        ...state,
        phase: "gate_passed",
        errorMessage: action.message,
      };

    // Vuelve al uploader sin volver a pedir gate (email ya validado)
    case "RESET_TO_GATE":
      return {
        ...state,
        phase: state.remainingUses > 0 ? "gate_passed" : "quota_exhausted",
        imageBase64: null,
        previewObjectUrl: null,
        errorMessage: null,
      };

    case "RESET_ALL":
      return { ...initialState };

    case "SET_PREVIEW_URL":
      return { ...state, previewObjectUrl: action.url };

    case "SET_QUOTA_EXHAUSTED":
      return {
        ...state,
        phase: "quota_exhausted",
        errorMessage: action.message ?? "Has agotado tus 3 visualizaciones disponibles para este email",
      };

    default:
      return state;
  }
}

export function useProbadorState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
