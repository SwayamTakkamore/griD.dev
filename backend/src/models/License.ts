import mongoose, { Schema, Document } from 'mongoose';

export interface ILicense extends Document {
  repoId: mongoose.Types.ObjectId;
  licenseTokenId: string;
  buyerWallet: string;
  templateId: string;
  purchaseTxHash: string;
  issuedAt: Date;
  expiresAt?: Date;
  revoked: boolean;
  wrappedKey: string;
}

const LicenseSchema = new Schema<ILicense>({
  repoId: { type: Schema.Types.ObjectId, ref: 'Repo', required: true, index: true },
  licenseTokenId: { type: String, required: true, unique: true },
  buyerWallet: { type: String, required: true, index: true },
  templateId: String,
  purchaseTxHash: String,
  issuedAt: { type: Date, default: Date.now },
  expiresAt: Date,
  revoked: { type: Boolean, default: false },
  wrappedKey: String // Optional: store a copy of the CEK per license
});

export default mongoose.model<ILicense>('License', LicenseSchema);
