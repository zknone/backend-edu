import mongoose, { Mongoose } from 'mongoose';
const UrlDB = process.env.URL_DB;

if (!UrlDB) {
    throw new Error('URL_DB environment variable is not defined');
  }

mongoose.connect(UrlDB,{
  useNewUrlParser: true,
  useUnifiedTopology: true
} as mongoose.ConnectOptions);

const db = mongoose.connection;

db.on('open', ()=>{
  console.log('connected to mongodb')
});

db.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
});