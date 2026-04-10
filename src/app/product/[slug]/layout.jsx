import connectMongo from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function generateMetadata({ params }) {
    try {
        await connectMongo();
        // Await the params before using them as per Next.js 15+ best practices
        const { slug } = await params;

        const product = await Product.findOne({ slug: slug }).lean();

        if (!product) {
            return {
                title: 'Product Not Found | Amar Organic Shop',
            };
        }

        const title = `${product.name} | Amar Organic Shop`;
        const description = product.description 
                            ? product.description.substring(0, 150) + '...' 
                            : `Buy 100% pure and organic ${product.name} from Amar Organic Shop.`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: product.image ? [{ url: product.image }] : [],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: product.image ? [product.image] : [],
            }
        };
    } catch (error) {
        return {
            title: 'Amar Organic Shop',
        };
    }
}

export default function ProductLayout({ children }) {
    return <>{children}</>;
}
