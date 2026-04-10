import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    contactInfo: {
        type: String,
        required: [true, 'Email or Phone is required'],
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
