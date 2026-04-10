import connectMongo from '@/lib/mongodb';
import Category from '@/lib/models/Category';

function capitalizeWords(str) {
    if (!str) return '';
    return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export async function generateMetadata({ params }) {
    try {
        await connectMongo();
        // Await the params
        const { slug } = await params;
        
        const categoryName = capitalizeWords(slug);

        const title = `Buy Best ${categoryName} Online | Amar Organic Shop`;
        const description = `Shop 100% authentic and pure ${categoryName} products from Amar Organic Shop. Fast delivery across Bangladesh.`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: 'website',
            }
        };
    } catch (error) {
        return {
            title: 'Category | Amar Organic Shop',
        };
    }
}

export default function CategoryLayout({ children }) {
    return <>{children}</>;
}
