import connectMongo from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function generateMetadata({ params }) {
    try {
        await connectMongo();
        
        // Await the dynamics params in Next 14+
        const { slug } = await params;
        
        // Use lean() for performance
        const product = await Product.findOne({ slug }).lean();

        if (!product) {
            return {
                title: 'Product Not Found | Amar Organic Shop',
            };
        }

        const title = `${product.name} | Amar Organic Shop`;
        
        // Fallback description utilizing unit & category logic
        const descBase = product.description 
                         ? product.description.substring(0, 150) + "..." 
                         : `Buy authentic ${product.name} at Amar Organic Shop. 100% natural, premium quality category: ${product.category}. Fast delivery in Bangladesh.`;

        const finalDesc = descBase.replace(/<[^>]*>?/gm, ''); // strip HTML if existing

        return {
            title,
            description: finalDesc,
            openGraph: {
                title,
                description: finalDesc,
                url: `https://amarorganicshop.com/product/${slug}`,
                siteName: 'Amar Organic Shop',
                images: [
                    {
                        url: product.image, // Product thumbnail
                        width: 800,
                        height: 800,
                        alt: product.name,
                    },
                ],
                locale: 'en_US',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description: finalDesc,
                images: [product.image],
            },
        };
    } catch (error) {
        console.error("Error generating metadata for product", error);
        return {
            title: 'Product | Amar Organic Shop',
        };
    }
}

export default function ProductDetailLayout({ children }) {
    // Simply pass the children components through (the 'use client' page executes below this Server wrapper)
    return <>{children}</>;
}
