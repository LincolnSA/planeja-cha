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
    maxCompanionsPerGuest: number;
    inviteLink: string;
    isActive: boolean;
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
