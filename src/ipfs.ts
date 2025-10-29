import { create } from 'ipfs-http-client';

const projectId = import.meta.env.VITE_INFURA_IPFS_PROJECT_ID;
const projectSecret = import.meta.env.VITE_INFURA_IPFS_PROJECT_SECRET;
const auth = `Basic ${btoa(`${projectId}:${projectSecret}`)}`;

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export default client; 