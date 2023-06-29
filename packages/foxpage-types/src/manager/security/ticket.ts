export type TicketChecker = (ticket: string) => Promise<boolean>;

export interface TicketCheckConfig {
  enable?: boolean;
}

export interface TicketCheckData {
  contentId?: string;
  fileId?: string;
}
