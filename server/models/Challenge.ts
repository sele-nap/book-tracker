import { Document, Schema, Types, model } from 'mongoose';

export interface IChallenge extends Document {
  year: number;
  goalBooks: number;
  targetGenres: string[];
  books: Types.ObjectId[];
  expiresAt: Date;
}

const challengeSchema = new Schema<IChallenge>(
  {
    year: { type: Number, required: true },
    goalBooks: { type: Number, required: true, min: 1 },
    targetGenres: [{ type: String, trim: true }],
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// TTL index — supprime automatiquement le challenge après expiresAt
challengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Challenge = model<IChallenge>('Challenge', challengeSchema);
