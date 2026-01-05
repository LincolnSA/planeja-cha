"use server";

import { validateTeaInput } from "./validate-tea-input";
import { normalizeDateTime } from "./normalize-datetime";
import { getCurrentUserId } from "./get-current-user-id";
import { createTeaInDb } from "./create-tea-in-db";
import { updateTeaInviteLink } from "./update-tea-invite-link";
import { generateInviteLink } from "./generate-invite-link";
import type { CreateTeaResult } from "./types";

export async function createTea(
  input: unknown
): Promise<CreateTeaResult> {
  try {
    // Validação
    let validatedInput;
    try {
      validatedInput = validateTeaInput(input);
    } catch (error) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error instanceof Error ? error.message : "Erro de validação",
          details: error,
        },
      };
    }

    // Autenticação
    const userId = await getCurrentUserId();
    if (!userId) {
      console.error("createTea: Usuário não autenticado");
      return {
        success: false,
        error: {
          code: "AUTHENTICATION_ERROR",
          message: "Usuário não autenticado. Por favor, faça login novamente.",
        },
      };
    }

    console.log("createTea: Usuário autenticado, ID:", userId);

    // Normalização de data/hora
    let normalizedTime: Date;
    try {
      normalizedTime = normalizeDateTime(validatedInput.date, validatedInput.time);
    } catch (error) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error instanceof Error ? error.message : "Erro ao processar data/hora",
          details: error,
        },
      };
    }

    // Criação no banco (com link temporário)
    let tea;
    try {
      const tempInviteLink = "pending";

      console.log("createTea: Criando tea no banco com dados:", {
        name: validatedInput.name,
        date: validatedInput.date,
        time: normalizedTime,
        userId,
      });

      tea = await createTeaInDb({
        name: validatedInput.name,
        parentsName: validatedInput.parentsName,
        date: validatedInput.date,
        time: normalizedTime,
        location: validatedInput.location,
        customMessage: validatedInput.customMessage || "",
        maxCompanionsPerGuest: validatedInput.maxCompanionsPerGuest,
        inviteLink: tempInviteLink,
        userId: userId,
      });

      console.log("createTea: Tea criado com sucesso, ID:", tea.id);

      // Gera e atualiza o link de convite
      const finalInviteLink = generateInviteLink(tea.id);
      await updateTeaInviteLink(tea.id, finalInviteLink);

      tea = { ...tea, inviteLink: finalInviteLink };

      console.log("createTea: Link de convite atualizado:", finalInviteLink);
    } catch (error) {
      console.error("createTea: Erro ao criar tea no banco:", error);
      return {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Erro ao salvar Tea no banco de dados",
          details: error,
        },
      };
    }

    // Sucesso
    return {
      success: true,
      data: {
        id: tea.id,
        name: tea.name,
        parentsName: tea.parentsName,
        date: tea.date,
        time: tea.time,
        location: tea.location,
        customMessage: tea.customMessage,
        maxCompanionsPerGuest: tea.maxCompanionsPerGuest,
        inviteLink: tea.inviteLink,
        userId: tea.userId,
        createdAt: tea.createdAt,
        updatedAt: tea.updatedAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Erro desconhecido",
        details: error,
      },
    };
  }
}

