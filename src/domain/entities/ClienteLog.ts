import { BaseEntity } from './BaseEntity';

export class ClienteLog extends BaseEntity {
  public event: string;
  public email: string;

  constructor(event: string, email: string, createdAt?: Date, id?: string) {
    super(id, createdAt);
    this.event = event;
    this.email = email;
  }
}
