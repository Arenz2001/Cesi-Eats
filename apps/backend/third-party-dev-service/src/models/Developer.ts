import mongoose from 'mongoose';

export interface IDeveloper {
  userId: string;  // ID from auth service
  company: string;
  position: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const developerSchema = new mongoose.Schema<IDeveloper>({
  userId: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  apiKey: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

developerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Developer = mongoose.model<IDeveloper>('Developer', developerSchema); 