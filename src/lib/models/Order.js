import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
    unit: { type: String }
});

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true, required: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    deliveryZone: { type: String, required: true },
    note: { type: String },
    customerIP: { type: String },
    
    items: [OrderItemSchema], // Array of sub-documents
    
    subTotal: { type: Number, required: true },
    deliveryCost: { type: Number, required: true },
    finalTotal: { type: Number, required: true },
    
    status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
        default: 'Pending' 
    }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
