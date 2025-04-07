import mongoose from 'mongoose';

export interface IComponent {
  name: string;
  description: string;
  version: string;
  downloadUrl: string;
  documentation: string;
  createdAt: Date;
  updatedAt: Date;
}

const componentSchema = new mongoose.Schema<IComponent>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  version: { type: String, required: true },
  downloadUrl: { type: String, required: true },
  documentation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

componentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Component = mongoose.model<IComponent>('Component', componentSchema); 