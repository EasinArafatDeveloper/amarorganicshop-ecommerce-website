import connectMongo from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';

export default async function sitemap() {
    const baseUrl = 'https://amarorganicshop.com';

    // Core static routes
    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        }
    ];

    try {
        await connectMongo();

        // 1. Fetch dynamic products
        const products = await Product.find({}, { slug: 1, updatedAt: 1 }).lean();
        const productRoutes = products.map((product) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: product.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        // 2. Fetch dynamic categories
        const categories = await Category.find({}, { slug: 1, updatedAt: 1 }).lean();
        const categoryRoutes = categories.map((cat) => ({
            url: `${baseUrl}/${cat.slug}`,
            lastModified: cat.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        return [...routes, ...categoryRoutes, ...productRoutes];

    } catch (error) {
        console.error("Error generating sitemap", error);
        return routes;
    }
}
