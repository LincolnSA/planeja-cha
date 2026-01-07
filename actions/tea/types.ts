export interface CreateTeaResultSuccess {
  success: true;
  data: {
    id: string;
    name: string;
    parentsName: string;
    date: string;
    time: Date;
    location: string;
    customMessage: string;
    giftsInfoMessage: string | null;
    maxCompanionsPerGuest: number;
    inviteLink: string;
    isActive: boolean;
    requireGiftSelection: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface CreateTeaResultError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type CreateTeaResult = CreateTeaResultSuccess | CreateTeaResultError;
