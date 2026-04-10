import mongoose from 'mongoose';

const StoreSettingsSchema = new mongoose.Schema({
    // Using a constant identifier ensures we only ever have 1 settings document
    singletonId: { type: String, default: 'global', unique: true },
    
    logoUrl: { type: String, default: '' },
    heroBannerUrl: { 
        type: String, 
        default: 'https://i.postimg.cc/mDhYGZ1r/amar-organic-shop-cover-image.png' 
    },
    contactPhone: { type: String, default: '+880 1234-567890' },
    contactEmail: { type: String, default: 'support@amarorganic.shop' },
    facebookUrl: { type: String, default: 'https://facebook.com' },

    topAnnouncementText: { type: String, default: 'আমাদের যেকোনো পণ্য অর্ডার করতে WhatsApp করুন: +8801765890646 | বা কল করুন: 09613-821489' },
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

    sectionTitles: {
        topSelling: { type: String, default: 'Top Selling Products' },
        honey: { type: String, default: 'All Natural Honey' },
        allProducts: { type: String, default: 'All Products' }
    }
    
}, { timestamps: true });

export default mongoose.models.StoreSettings || mongoose.model('StoreSettings', StoreSettingsSchema);
