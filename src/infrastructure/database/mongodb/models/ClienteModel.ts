import { Schema, model, Document, Types } from 'mongoose';

export interface IClienteDocument extends Document {
  _id: Types.ObjectId;
  nome: string;
  email: string;
  telefone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ClienteSchema = new Schema<IClienteDocument>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefone: { type: String, required: true }
}, {
  timestamps: true
});

export const ClienteModel = model<IClienteDocument>('Cliente', ClienteSchema);
