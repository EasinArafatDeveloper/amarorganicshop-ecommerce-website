import mongoose from 'mongoose';

const StoreSettingsSchema = new mongoose.Schema({
    singletonId: { type: String, default: 'global', unique: true },
    heroBannerUrl: String,
    heroBanners: [{ url: String, link: String }]
}, { strict: false });

const StoreSettings = mongoose.models.StoreSettings || mongoose.model('StoreSettings', StoreSettingsSchema);

async function checkSettings() {
    try {
        await mongoose.connect("mongodb+srv://amar-organic-shop:voNpm%25O8(A%7Df3)9N%268so%7D.@cluster0.4vlyczy.mongodb.net/amr-organic-shop?retryWrites=true&w=majority&appName=Cluster0");
        const settings = await StoreSettings.findOne({ singletonId: 'global' });
        console.log('--- DATABASE DATA ---');
        console.log('heroBanners:', JSON.stringify(settings?.heroBanners, null, 2));
        console.log('--- END ---');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSettings();
