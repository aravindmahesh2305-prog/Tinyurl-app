export interface Link {
  id: number;
  code: string;
  url: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export interface CreateLinkRequest {
  url: string;
  code?: string;
}

export interface CreateLinkResponse {
  success: boolean;
  link?: Link;
  error?: string;
}

