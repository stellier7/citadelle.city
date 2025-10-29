import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer/';

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

// Configure IPFS client
const projectId = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID;
const projectSecret = import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET;

let client: ReturnType<typeof create> | null = null;

// Only create the client if we have the credentials
if (projectId && projectSecret) {
  const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
  client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
}

/**
 * Uploads a file to IPFS using Infura's IPFS service
 * @param file The file to upload
 * @returns The IPFS URL of the uploaded file
 */
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // In development mode without IPFS credentials, return a data URL
    if (!client || import.meta.env.DEV) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    }

    // Add file to IPFS
    const added = await client.add(
      file,
      {
        progress: (prog) => console.log(`Upload progress: ${prog}`),
      }
    );

    // Create IPFS URL
    const url = `https://ipfs.io/ipfs/${added.path}`;
    return url;
  } catch (error: any) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error(error.message || 'Failed to upload file to IPFS');
  }
} 