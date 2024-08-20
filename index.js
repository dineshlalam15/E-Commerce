import { serverConnection } from './src/utils/connection.js';

try {
  serverConnection();
} catch (error) {
  console.error(error);
}
