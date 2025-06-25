export interface Todo {
  id?: number;
  title: string;
  isDone: boolean;
  time: string; // ISO string format
  userId: number;
}

export interface Note {
  id?: number;
  title: string;
  description: string;
  date: string; // ISO string format
  userId: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}