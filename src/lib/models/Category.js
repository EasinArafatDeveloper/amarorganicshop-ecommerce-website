import mongoose from 'mongoose';

const SubCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true }
});

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    label: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    hasSub: { type: Boolean, default: false },
    subItems: [SubCategorySchema]
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
