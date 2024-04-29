/** @format */

export type ErrorResponseParams = {
  status?: number;
  message?: string;
};

export type EmailOptions = {
  from: string;
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, any>;
  attachments?: {
    filename: string;
    path: string;
    cid?: string;
  }[];
};
