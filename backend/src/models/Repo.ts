import mongoose, { Schema, Document } from 'mongoose';

export interface IRepo extends Document {
  repoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  owner: string;
  ownerWallet: string;
  priceWei: string;
  licenseType: string;
  licenseTemplateId: string;
  licenseTemplates: Array<{ name: string; priceEth: string; description: string }>;
  tags: string[];
  languages: string[];
  ipfsCid: string;
  ipfsUrl: string;
  fileName: string;
  fileSize: number;
  cidEncrypted: string;
  wrappedKey: string;
  encryptedKey: string;
  wrapMethod: string;
  keyMeta: {
    iv: string;
    tag: string;
  };
  ipAssetRegistered: boolean;
  ipAssetId?: string;
  ipAssetTxHash?: string;
  repoTokenId?: string;
  whitelist: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RepoSchema = new Schema<IRepo>({
  repoId: { type: String, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailUrl: String,
  owner: { type: String, required: true, index: true },
  ownerWallet: { type: String, required: true, index: true },
  priceWei: { type: String, default: '0' },
  licenseType: { type: String, default: 'open' },
  licenseTemplateId: String,
  licenseTemplates: [{ 
    name: String, 
    priceEth: String, 
    description: String 
  }],
  tags: [String],
  languages: [String],
  ipfsCid: String,
  ipfsUrl: String,
  fileName: String,
  fileSize: Number,
  cidEncrypted: { type: String, required: true },
  wrappedKey: { type: String, required: true },
  encryptedKey: String,
  wrapMethod: { type: String, default: 'SERVER_KEK' },
  keyMeta: {
    iv: String,
    tag: String
  },
  ipAssetRegistered: { type: Boolean, default: false },
  ipAssetId: String,
  ipAssetTxHash: String,
  repoTokenId: String,
  whitelist: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRepo>('Repo', RepoSchema);
