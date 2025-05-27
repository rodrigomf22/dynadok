import { BaseEntity } from './BaseEntity';

export class Cliente extends BaseEntity {
  public nome: string;
  public email: string;
  public telefone: string;

  constructor(nome: string, email: string, telefone: string, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
  }
}
