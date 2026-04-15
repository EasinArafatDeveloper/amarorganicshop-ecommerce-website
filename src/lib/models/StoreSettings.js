import mongoose from 'mongoose';

const StoreSettingsSchema = new mongoose.Schema({
    // Using a constant identifier ensures we only ever have 1 settings document
    singletonId: { type: String, default: 'global', unique: true },
    
    logoUrl: { type: String, default: '' },
    heroBannerUrl: { 
        type: String, 
        default: 'https://i.postimg.cc/mDhYGZ1r/amar-organic-shop-cover-image.png' 
    },
    heroBanners: {
        type: [{
            url: { type: String, required: true },
            link: { type: String, default: '/shop' }
        }],
        default: []
    },
    heroSliderAutoplay: { type: Number, default: 5000 },
    contactPhone: { type: String, default: '+8801331005210' },
    contactEmail: { type: String, default: 'amarorganicshop@gmail.com' },
    contactAddress: { type: String, default: 'Dhaka, Bangladesh. Delivery available nationwide.' },
    contactPhoneHours: { type: String, default: 'Saturday to Thursday, 9AM - 8PM' },
    facebookUrl: { type: String, default: 'https://facebook.com' },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    linkedinUrl: { type: String, default: 'https://linkedin.com' },

    topAnnouncementText: { type: String, default: 'আমাদের যেকোনো পণ্য অর্ডার করতে WhatsApp করুন: +8801331005210 | বা কল করুন: +8801331005210' },
    topAnnouncementIsActive: { type: Boolean, default: true },
    
    promoPopupImage: { type: String, default: '' },
    promoPopupLink: { type: String, default: '' },
    promoPopupIsActive: { type: Boolean, default: false },

    primaryColor: { type: String, default: '#16a34a' },
    secondaryColor: { type: String, default: '#f39200' },

    dualPosterOneImage: { type: String, default: 'https://backoffice.ghorerbazar.com/banner/Tyz131763632384.png' },
    dualPosterOneLink: { type: String, default: '/' },
    dualPosterTwoImage: { type: String, default: 'https://admin.ghorerbazarbd.com/storage/banners/1709121683.jpg' },
    dualPosterTwoLink: { type: String, default: '/' },

    sectionToggles: {
        showHero: { type: Boolean, default: true },
        showCategories: { type: Boolean, default: true },
        showTopSelling: { type: Boolean, default: true },
        showHoney: { type: Boolean, default: true },
        showPromo: { type: Boolean, default: true },
        showAllProducts: { type: Boolean, default: true },
        showTestimonials: { type: Boolean, default: true }
    },

    sectionOrder: {
        type: [String],
        default: [
            'showHero', 
            'showCategories', 
            'showTopSelling', 
            'showHoney', 
            'showPromo', 
            'showAllProducts', 
            'showTestimonials'
        ]
    },

    sectionTitles: {
        topSelling: { type: String, default: 'Top Selling Products' },
        honey: { type: String, default: 'All Natural Honey' },
        allProducts: { type: String, default: 'All Products' }
    },

    deliveryZones: {
        type: [{
            id: { type: String, required: true },
            label: { type: String, required: true },
            cost: { type: Number, required: true }
        }],
        default: [
            { id: 'dhaka', label: 'Inside Dhaka', cost: 60 },
            { id: 'sub_dhaka', label: 'Sub-side Dhaka', cost: 70 },
            { id: 'outside', label: 'Outside Dhaka', cost: 100 }
        ]
    },

    isFreeDeliveryActive: { type: Boolean, default: true },
    freeDeliveryAbove: { type: Number, default: 3000 },

    trustBadges: {
        returnsText: { type: String, default: '7 Days return policy' },
        paymentText: { type: String, default: '100% Secure checkout' },
        qualityText: { type: String, default: '100% Authentic products' }
    },

    aboutStoryText: { type: String, default: "Amar Organic Shop was born from a simple but profound frustration: finding pure, unadulterated food in today's market has become a luxury. We realized that our families were consuming processed items stripped of their actual nutritional value." },
    aboutMissionText: { type: String, default: "Our mission is straightforward: We source directly from the most authentic remote farmers and renowned organic estates to eliminate the middlemen. Whether it's Sundarbans' raw honey, premium Arabian dates, or traditional village ghee, we guarantee quality so you don't have to second-guess." },

    footerDescription: { type: String, default: "Amar Organic Shop is your trusted source for 100% pure, natural, and authentic organic foods directly from farmers." },
    footerAddress: { type: String, default: "123 Organic City, Dhaka, Bangladesh" },
    footerPhone: { type: String, default: "+880 1234-567890" },
    footerEmail: { type: String, default: "support@amarorganic.shop" },
    footerCopyright: { type: String, default: "© {year} Amar Organic Shop. All rights reserved." },
    
    // Invoice Settings
    invoiceCompanyName: { type: String, default: 'AMAR ORGANIC' },
    invoiceSubtitle: { type: String, default: 'Pure Nature & Quality' },
    invoiceFooterText: { type: String, default: 'Thank you for shopping with Amar Organic!' }
}, { timestamps: true });

export default mongoose.models.StoreSettings || mongoose.model('StoreSettings', StoreSettingsSchema);
