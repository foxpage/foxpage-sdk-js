import { TicketCheckData } from './ticket';

export * from './ticket';

export interface SecurityManager {
  ticketCheck(ticket: string, data: TicketCheckData): Promise<boolean>;
}
