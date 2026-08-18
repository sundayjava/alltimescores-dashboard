export type BroadcastLevel = "INFO" | "WARNING" | "CRITICAL";

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  link: string | null;
  linkLabel: string | null;
  level: BroadcastLevel;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface BroadcastsResponse {
  success: boolean;
  data: {
    broadcasts: Broadcast[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface BroadcastResponse {
  success: boolean;
  message?: string;
  data: Broadcast;
}

export interface CreateBroadcastRequest {
  title: string;
  message: string;
  link?: string;
  linkLabel?: string;
  level: BroadcastLevel;
}

export interface BroadcastQueryParams {
  page?: number;
  limit?: number;
}
