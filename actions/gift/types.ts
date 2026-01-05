export interface CreateGiftResultSuccess {
  success: true;
  data: {
    id: string;
    title: string;
    description: string;
    quantity: number;
    chosen: number;
    teaId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface CreateGiftResultError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type CreateGiftResult = CreateGiftResultSuccess | CreateGiftResultError;

export interface Gift {
  id: string;
  title: string;
  description: string;
  quantity: number;
  chosen: number;
  teaId: string;
  createdAt: Date;
  updatedAt: Date;
}

