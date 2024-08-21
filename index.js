import { serverConnection, databaseConnection } from './src/utils/connection.js';

databaseConnection().then(() => {
  serverConnection()
}).catch((error) => {
  console.error(error);
  process.exit(1)
});