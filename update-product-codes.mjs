import mongoose from 'mongoose';

// Simple product schema for the migration
const ProductSchema = new mongoose.Schema({
    productCode: { type: String },
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const generateProductCode = () => {
    return 'AOS-' + Math.floor(100000 + Math.random() * 900000).toString();
};

async function migrate() {
    try {
        const URI = "mongodb+srv://amar-organic-shop:voNpm%25O8(A%7Df3)9N%268so%7D.@cluster0.4vlyczy.mongodb.net/amr-organic-shop?retryWrites=true&w=majority&appName=Cluster0";
        console.log('Connecting to DB...');
        await mongoose.connect(URI);
        console.log('Connected!');

        const products = await Product.find({});
        let updatedCount = 0;

        for (const product of products) {
            if (!product.productCode) {
                product.productCode = generateProductCode();
                await product.save();
                updatedCount++;
                console.log(`Updated product: ${product._id} with code ${product.productCode}`);
            }
        }

        console.log(`Migration complete! Successfully assigned codes to ${updatedCount} existing products.`);
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
