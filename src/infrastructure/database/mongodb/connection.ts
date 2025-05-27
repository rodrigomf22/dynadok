import mongoose from 'mongoose';
import { environment } from '../../config/environment';

export const dbConnection = () => mongoose.connect(environment.mongoUri);
