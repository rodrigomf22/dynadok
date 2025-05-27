import mongoose from 'mongoose';

const ClienteLogSchema = new mongoose.Schema({
  event: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ClienteLogModel = mongoose.model('ClienteLog', ClienteLogSchema);
