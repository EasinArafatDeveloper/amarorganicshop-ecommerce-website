export const products = [
    // Honey Products
    {
        id: 1,
        name: "Sundarban Honey",
        nameBn: "সুন্দরবনের মধু",
        category: "honey",
        subCategory: "Sundarban Honey (সুন্দরবনের মধু)",
        price: 450,
        originalPrice: 550,
        slug: "sundarban-honey",
        image: "/images/honey/sundarban.jpg",
        description: "Pure honey collected from the pristine Sundarban mangrove forest",
        inStock: true,
        rating: 4.8,
        reviewCount: 124,
        isOrganic: true,
        badge: "Best Seller",  // ✓ Best Seller #1
        unit: "500g"
    },
    {
        id: 2,
        name: "Litchi Flower Honey",
        nameBn: "লিচু ফুলের মধু",
        category: "honey",
        subCategory: "Litchi Flower Honey (লিচু ফুলের মধু)",
        price: 480,
        originalPrice: 580,
        slug: "litchi-flower-honey",
        image: "/images/honey/litchi.jpg",
        description: "Premium honey from litchi flowers, sweet and aromatic",
        inStock: true,
        rating: 4.9,
        reviewCount: 89,
        isOrganic: true,
        badge: "Best Seller",  // ✓ Best Seller #2
        unit: "500g"
    },
    {
        id: 3,
        name: "Black Seed Honey",
        nameBn: "কালোজিরা মধু",
        category: "honey",
        subCategory: "Black Seed Honey (কালোজিরা মধু)",
        price: 520,
        originalPrice: 620,
        slug: "black-seed-honey",
        image: "/images/honey/black-seed.jpg",
        description: "Honey infused with black seed benefits",
        inStock: true,
        rating: 4.7,
        reviewCount: 56,
        isOrganic: true,
        // badge: "Best Seller",  // Optional
        unit: "500g"
    },
    {
        id: 4,
        name: "Mixed Flower Honey",
        nameBn: "মিশ্র ফুলের মধু",
        category: "honey",
        subCategory: "Mixed Flower Honey (মিশ্র ফুলের মধু)",
        price: 400,
        originalPrice: 480,
        slug: "mixed-flower-honey",
        image: "/images/honey/mixed.jpg",
        description: "Blend of various flower honeys",
        inStock: true,
        rating: 4.6,
        reviewCount: 234,
        isOrganic: true,
        unit: "500g"
    },
    {
        id: 5,
        name: "Hill Flower Honey",
        nameBn: "পাহাড়ি মধু",
        category: "honey",
        subCategory: "Hill Flower Honey (পাহাড়ি মধু)",
        price: 490,
        originalPrice: 590,
        slug: "hill-flower-honey",
        image: "/images/honey/hill.jpg",
        description: "Raw honey from hill flowers",
        inStock: true,
        rating: 4.8,
        reviewCount: 67,
        isOrganic: true,
        unit: "500g"
    },
    {
        id: 6,
        name: "Cream Honey",
        nameBn: "ক্রিমহানি",
        category: "honey",
        subCategory: "Cream Honey (ক্রিমহানি)",
        price: 550,
        originalPrice: 650,
        slug: "cream-honey",
        image: "/images/honey/cream.jpg",
        description: "Creamy textured honey",
        inStock: false,
        rating: 4.9,
        reviewCount: 45,
        isOrganic: true,
        unit: "500g"
    },

    // Honey Nut
    {
        id: 7,
        name: "Honey Nut Mix",
        nameBn: "হানিনাট মিক্স",
        category: "honey-nut",
        price: 350,
        originalPrice: 420,
        slug: "honey-nut-mix",
        image: "/images/honey-nut/mix.jpg",
        description: "Crunchy nuts coated with pure honey",
        inStock: true,
        rating: 4.6,
        reviewCount: 78,
        isOrganic: false,
        badge: "Best Seller",  // ✓ Best Seller #3
        unit: "250g"
    },

    // Dates Products
    {
        id: 8,
        name: "Ajwa Dates",
        nameBn: "আজওয়া খেজুর",
        category: "dates",
        subCategory: "Ajwa Dates (আজওয়া খেজুর)",
        price: 1200,
        originalPrice: 1500,
        slug: "ajwa-dates",
        image: "/images/dates/ajwa.jpg",
        description: "Premium quality Ajwa dates from Madinah",
        inStock: true,
        rating: 5.0,
        reviewCount: 234,
        isOrganic: true,
        badge: "Best Seller",  // ✓ Best Seller #4
        unit: "1kg"
    },
    {
        id: 9,
        name: "Medjool Dates",
        nameBn: "মেডজুল খেজুর",
        category: "dates",
        subCategory: "Medjool Dates (মেডজুল খেজুর)",
        price: 1800,
        originalPrice: 2200,
        slug: "medjool-dates",
        image: "/images/dates/medjool.jpg",
        description: "Large, sweet, and luxurious Medjool dates",
        inStock: true,
        rating: 4.9,
        reviewCount: 167,
        isOrganic: true,
        unit: "1kg"
    },
    {
        id: 10,
        name: "Mariyam Dates",
        nameBn: "মরিয়ম খেজুর",
        category: "dates",
        subCategory: "Mariyam Dates (মরিয়ম খেজুর)",
        price: 1400,
        originalPrice: 1700,
        slug: "mariyam-dates",
        image: "/images/dates/mariyam.jpg",
        description: "Soft and delicious Mariyam dates",
        inStock: true,
        rating: 4.7,
        reviewCount: 89,
        isOrganic: true,
        unit: "1kg"
    },
    {
        id: 11,
        name: "Sukkari Dates",
        nameBn: "সুক্কারি খেজুর",
        category: "dates",
        subCategory: "Sukkari Dates (সুক্কারি খেজুর)",
        price: 1100,
        originalPrice: 1300,
        slug: "sukkari-dates",
        image: "/images/dates/sukkari.jpg",
        description: "Sweet and crispy Sukkari dates",
        inStock: true,
        rating: 4.8,
        reviewCount: 112,
        isOrganic: true,
        unit: "1kg"
    }
];

// Helper function to get products by category
export const getProductsByCategory = (categorySlug) => {
    return products.filter(product => product.category === categorySlug);
};

// Helper function to get product by slug
export const getProductBySlug = (slug) => {
    return products.find(product => product.slug === slug);
};

// Helper function to get product by ID
export const getProductById = (id) => {
    return products.find(product => product.id === id);
};

// Get all products (for homepage etc.)
export const getAllProducts = () => {
    return products;
};

// Get featured products (Best Sellers)
export const getFeaturedProducts = () => {
    return products.filter(product => product.badge === "Best Seller").slice(0, 8);
};

// Get top selling products (products with "Best Seller" badge) - Returns 4 products
export const getTopSellingProducts = () => {
    // Filter products that have "Best Seller" badge
    const topSelling = products.filter(product => product.badge === "Best Seller");

    // Return first 4 best selling products
    // Now we have 4 products with Best Seller badge (IDs: 1, 2, 7, 8)
    return topSelling.slice(0, 4);
};

// Alternative: If you want specific products by ID
export const getTopSellingProductsByIds = () => {
    const topSellingIds = [1, 2, 7, 8]; // Sundarban, Litchi, Honey Nut Mix, Ajwa
    return products.filter(product => topSellingIds.includes(product.id));
};


// Get new arrivals (products with "New" badge)
export const getNewArrivals = () => {
    return products.filter(product => product.badge === "New").slice(0, 8);
};

// Get products by subcategory
export const getProductsBySubCategory = (subCategoryName) => {
    return products.filter(product => product.subCategory === subCategoryName);
};

// Get products on sale (products with originalPrice greater than price)
export const getProductsOnSale = () => {
    return products.filter(product => product.originalPrice && product.originalPrice > product.price);
};