import { BlobServiceClient } from '@azure/storage-blob';
import { unlinkSync } from 'fs';
import { extname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;
const sasToken = process.env.SAS_TOKEN;
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

const getContentType = (filePath) => {
  const extension = extname(filePath).toLowerCase();
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
};

const uploadToAzure = async (localPath) => {
  const blobName = localPath.split('/').pop();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const contentType = getContentType(localPath);
  try {
    await blockBlobClient.uploadFile(localPath, {
      blobHTTPHeaders: { blobContentType: contentType },
    });
    const blobUrlWithSAS = `${blockBlobClient.url}?${sasToken}`;
    unlinkSync(localPath);
    return blobUrlWithSAS;
  } catch (error) {
    unlinkSync(localPath);
    console.error(error);
    return null;
  }
};

const deleteFromAzure = async (imageURL) => {
  try {
    const url = new URL(imageURL);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    let blobName = pathSegments.slice(1).join('/');
    blobName = decodeURIComponent(blobName).replace(/\\/g, '/');
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.delete();
  } catch (error) {
    console.error('Error deleting image:', error.message);
    process.exit(1);
  }
};

export { uploadToAzure, deleteFromAzure };
