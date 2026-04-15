import mongoose from 'mongoose';

const BlockedIPSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true },
    reason: { type: String, default: 'Suspicious order activity' },
    blockedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.BlockedIP || mongoose.model('BlockedIP', BlockedIPSchema);
