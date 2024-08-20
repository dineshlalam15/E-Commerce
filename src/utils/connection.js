import dotenv from 'dotenv'
dotenv.config()
import app from './app.js';

const port = process.env.PORT || 8080;
const serverConnection = () => {
  try {
    app.listen(port, () => {
      console.log(`Server Connected on PORT ${port}`);
    });
  } catch (error) {
    console.error(`Server Connection Failed`);
    process.exit(1);
  }
};

export { serverConnection };
