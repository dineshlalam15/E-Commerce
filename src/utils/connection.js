import dotenv from 'dotenv'
dotenv.config()
import app from './app.js';
import { connect } from 'mongoose';

const port = process.env.PORT || 8080
const uri = process.env.MONGODB_URI
const serverConnection = () => {
  try {
    app.listen(port, () => {
      console.log(`Server Connected on PORT ${port}`)
    });
  } catch (error) {
    console.error(`Server Connection Failed`)
    process.exit(1)
  }
};

const databaseConnection =  async () => {
  try{
    const dbConnect = await connect(uri)
    console.log(`Database Connected: ${dbConnect.connection.host}`)
  } catch(error){
    console.error(`MongoDB Connection Failed: ${error}`);
    process.exit(1)
  }
}

export { serverConnection, databaseConnection };
