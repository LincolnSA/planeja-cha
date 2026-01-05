"use server";

import { validateGiftInput } from "./validate-gift-input";
import { verifyTeaOwnership } from "./verify-tea-ownership";
import { createGiftInDb } from "./create-gift-in-db";
import type { CreateGiftResult } from "./types";

/**
 * Cria um novo Gift
 * Responsabilidade única: orquestrar a criação de um presente
 */
export async function createGift(
  input: unknown
): Promise<CreateGiftResult> {
  try {
    // Validação
    let validatedInput;
    try {
      validatedInput = validateGiftInput(input);
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

    // Verificar se o tea pertence ao usuário
    const isOwner = await verifyTeaOwnership(validatedInput.teaId);
    if (!isOwner) {
      return {
        success: false,
        error: {
          code: "AUTHORIZATION_ERROR",
          message: "Você não tem permissão para adicionar presentes a este chá",
        },
      };
    }

    // Criação no banco
    let gift;
    try {
      gift = await createGiftInDb({
        title: validatedInput.title,
        description: validatedInput.description,
        quantity: validatedInput.quantity,
        teaId: validatedInput.teaId,
      });
    } catch (error) {
      console.error("createGift: Erro ao criar gift no banco:", error);
      return {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: error instanceof Error ? error.message : "Erro ao salvar presente no banco de dados",
          details: error,
        },
      };
    }

    // Sucesso
    return {
      success: true,
      data: {
        id: gift.id,
        title: gift.title,
        description: gift.description,
        quantity: gift.quantity,
        chosen: gift.chosen,
        teaId: gift.teaId,
        createdAt: gift.createdAt,
        updatedAt: gift.updatedAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Erro desconhecido ao criar presente",
        details: error,
      },
    };
  }
}

