import { Document, Schema, Types, model } from 'mongoose';

export type ReadStatus = 'reading' | 'finished' | 'dropped' | 'wishlist';

export interface IRead extends Document {
  book: Types.ObjectId;
  status: ReadStatus;
  startedAt?: Date;
  finishedAt?: Date;
  rating?: number;
  review?: string;
  createdAt: Date;
}

const readSchema = new Schema<IRead>(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    status: {
      type: String,
      enum: ['reading', 'finished', 'dropped', 'wishlist'],
      required: true,
    },
    startedAt: { type: Date },
    finishedAt: { type: Date },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Read = model<IRead>('Read', readSchema);
