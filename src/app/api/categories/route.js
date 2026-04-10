import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Category from '@/lib/models/Category';

const initialData = [
    {
        name: "Honey", label: "মধু (Honey)", slug: "honey", hasSub: true,
        subItems: [
            { name: "Sundarban Honey (সুন্দরবনের মধু)", slug: "sundarban-honey" },
            { name: "Litchi Flower Honey (লিচু ফুলের মধু)", slug: "litchi-flower-honey" },
            { name: "Black Seed Honey (কালোজিরা মধু)", slug: "black-seed-honey" },
            { name: "Mixed Flower Honey (মিশ্র ফুলের মধু)", slug: "mixed-flower-honey" },
            { name: "Hill Flower Honey (পাহাড়ি মধু)", slug: "hill-flower-honey" },
            { name: "Cream Honey (ক্রিমহানি)", slug: "cream-honey" }
        ]
    },
    { name: "Honey Nut", label: "হানিনাট (Honey Nut)", slug: "honey-nut", hasSub: false },
    {
        name: "Oil & Ghee", label: "তেল ও ঘি (Oil & Ghee)", slug: "oil-ghee", hasSub: true,
        subItems: [
            { name: "Mustard Oil (সরিষার তেল)", slug: "mustard-oil" },
            { name: "Coconut Oil (নারিকেল তেল)", slug: "coconut-oil" },
            { name: "Gawa Ghee (গাওয়া ঘি)", slug: "gawa-ghee" },
            { name: "Sorer Ghee (সরের ঘি)", slug: "sorer-ghee" },
            { name: "Black Seed Oil (কালোজিরা তেল)", slug: "black-seed-oil" },
            { name: "Olive Oil (অলিভ অয়েল)", slug: "olive-oil" },
            { name: "Sesame Oil (তিলের তেল)", slug: "sesame-oil" }
        ]
    },
    {
        name: "Dates", label: "খেজুর (Dates)", slug: "dates", hasSub: true,
        subItems: [
            { name: "Ajwa Dates (আজওয়া খেজুর)", slug: "ajwa-dates" },
            { name: "Mariyam Dates (মরিয়ম খেজুর)", slug: "mariyam-dates" },
            { name: "Medjool Dates (মেডজুল খেজুর)", slug: "medjool-dates" },
            { name: "Sukkari Dates (সুক্কারি খেজুর)", slug: "sukkari-dates" },
            { name: "Dabbas Dates (দাব্বাস খেজুর)", slug: "dabbas-dates" },
            { name: "Burni Dates (বারনি খেজুর)", slug: "burni-dates" }
        ]
    },
    {
        name: "Spices", label: "মশলা (Spices)", slug: "spices", hasSub: true,
        subItems: [
            { name: "Turmeric Powder (হলুদ গুঁড়া)", slug: "turmeric-powder" },
            { name: "Chili Powder (মরিচ গুঁড়া)", slug: "chili-powder" },
            { name: "Coriander Powder (ধনিয়া গুঁড়া)", slug: "coriander-powder" },
            { name: "Cumin Powder (জিরা গুঁড়া)", slug: "cumin-powder" },
            { name: "Spice Combo (মশলা কম্বো)", slug: "spice-combo" }
        ]
    },
    {
        name: "Nuts & Seeds", label: "বাদাম ও বীজ (Nuts & Seeds)", slug: "nuts-seeds", hasSub: true,
        subItems: [
            { name: "Almonds (কাঠ বাদাম)", slug: "almonds" },
            { name: "Cashews (কাজু বাদাম)", slug: "cashews" },
            { name: "Chia Seeds (চিয়া সিড)", slug: "chia-seeds" },
            { name: "Pumpkin Seeds (কুমড়া বীজ)", slug: "pumpkin-seeds" },
            { name: "Sunflower Seeds (সূর্যমুখী বীজ)", slug: "sunflower-seeds" },
            { name: "Black Garlic (ব্লাক গার্লিক)", slug: "black-garlic" }
        ]
    },
    {
        name: "Sugar & Jaggery", label: "চিনি ও গুড় (Sugar & Jaggery)", slug: "sugar-jaggery", hasSub: true,
        subItems: [
            { name: "Cane Sugar (আখের চিনি)", slug: "cane-sugar" },
            { name: "Cane Jaggery (আখের গুড়)", slug: "cane-jaggery" },
            { name: "Date Jaggery (খেজুরের গুড়)", slug: "date-jaggery" }
        ]
    },
    { name: "Pink Salt", label: "পিংক সল্ট (Pink Salt)", slug: "pink-salt", hasSub: false },
    {
        name: "Beverage & Dairy", label: "পানীয় ও দুগ্ধ (Beverage & Dairy)", slug: "beverage-dairy", hasSub: true,
        subItems: [
            { name: "Tang (ট্যাং)", slug: "tang" },
            { name: "Foster Clarks (ফস্টার ক্লার্কস)", slug: "foster-clarks" },
            { name: "Milk Powder (গুঁড়ো দুধ)", slug: "milk-powder" }
        ]
    },
    {
        name: "Snacks", label: "নাস্তা ও সেমাই (Snacks)", slug: "snacks", hasSub: true,
        subItems: [
            { name: "Lachha Semai (লাচ্ছা সেমাই)", slug: "lachha-semai" }
        ]
    }
];

export async function GET() {
    try {
        await connectMongo();
        
        let categories = await Category.find().sort({ createdAt: 1 });
        
        // Auto-seed if database is empty 
        if (categories.length === 0) {
            await Category.insertMany(initialData);
            categories = await Category.find().sort({ createdAt: 1 });
        }
        
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
    }
}
