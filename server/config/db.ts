import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not defined in .env');

  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

export default connectDB;
