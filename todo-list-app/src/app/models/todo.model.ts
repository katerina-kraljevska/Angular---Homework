export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN-PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: Status;
}

export interface CreateTodoDto {
  title: string;
  description: string;
  status: Status;
}

export type UpdateTodoDto = Partial<CreateTodoDto>;
