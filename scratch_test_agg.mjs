import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true, required: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    deliveryZone: { type: String, required: true },
    note: { type: String },
    items: [new mongoose.Schema({}, { strict: false })],
    subTotal: { type: Number, required: true },
    deliveryCost: { type: Number, required: true },
    finalTotal: { type: Number, required: true },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

async function test() {
    await mongoose.connect('mongodb+srv://amar-organic-shop:voNpm%25O8(A%7Df3)9N%268so%7D.@cluster0.4vlyczy.mongodb.net/amr-organic-shop?retryWrites=true&w=majority&appName=Cluster0');
    console.log("Connected.");
    
    const count = await Order.countDocuments();
    console.log("Total Orders:", count);
    
    const customers = await Order.aggregate([
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: "$mobile",
                customerName: { $first: "$customerName" },
                address: { $first: "$address" },
                latestOrder: { $first: "$createdAt" },
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: "$finalTotal" },
                allOrders: { $push: "$orderId" }
            }
        },
        {
            $project: {
                mobile: "$_id",
                customerName: 1,
                address: 1,
                latestOrder: 1,
                totalOrders: 1,
                totalSpent: 1,
                allOrders: 1,
                _id: 0
            }
        },
        { $sort: { totalSpent: -1 } }
    ]);
    
    console.log("Customers Aggregation Result:", customers.length);
    if(customers.length > 0) {
        console.dir(customers[0]);
    } else {
        const raw = await Order.findOne();
        console.log("Raw order:");
        console.dir(raw);
    }
    
    process.exit(0);
}

test();
