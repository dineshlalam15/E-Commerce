import { BlobServiceClient } from '@azure/storage-blob';
import { unlinkSync } from 'fs';
import { extname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const sasToken = process.env.SAS_TOKEN

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
  const containerClient = blobServiceClient.getContainerClient(containerName);
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

export { uploadToAzure };