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
    images: [{ type: String }],
    description: { type: String },
    shortDescription: { type: String },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [{
        user: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now }
    }],
    isOrganic: { type: Boolean, default: false },
    badge: { type: String },
    unit: { type: String },
    productCode: { type: String, unique: true },
    variants: [{
        unit: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number }
    }]
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
