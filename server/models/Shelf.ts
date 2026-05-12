import { Document, Schema, Types, model } from 'mongoose';

export interface IShelf extends Document {
  name: string;
  description?: string;
  books: Types.ObjectId[];
  createdAt: Date;
}

const shelfSchema = new Schema<IShelf>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  },
  { timestamps: true },
);

export const Shelf = model<IShelf>('Shelf', shelfSchema);
