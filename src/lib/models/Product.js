import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    nameBn: { type: String },
    category: { type: String, required: true },
    subCategory: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isOrganic: { type: Boolean, default: false },
    badge: { type: String },
    unit: { type: String }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
