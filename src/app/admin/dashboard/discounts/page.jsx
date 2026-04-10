import connectMongo from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import DiscountClient from './DiscountClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DiscountsPage() {
    await connectMongo();

    // Fetch all products cleanly from the server
    const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();

    // Serialize objectIds to strings to avoid Next.js hydration issues
    const products = rawProducts.map(p => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt ? p.createdAt.toISOString() : null,
        updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
    }));

    return <DiscountClient initialProducts={products} />;
}
