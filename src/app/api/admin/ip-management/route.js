import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import BlockedIP from '@/lib/models/BlockedIP';

export async function GET() {
    try {
        await connectMongo();
        
        // Aggregate IPs from orders and count them
        const ipStats = await Order.aggregate([
            { $match: { customerIP: { $ne: null } } },
            { $group: { _id: "$customerIP", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get list of blocked IPs
        const blockedIPs = await BlockedIP.find({}).lean();
        const blockedList = blockedIPs.map(b => b.ip);

        const result = ipStats.map(stat => ({
            ip: stat._id,
            orderCount: stat.count,
            isBlocked: blockedList.includes(stat._id)
        }));

        // Also add blocked IPs that might not have orders currently in the DB
        blockedIPs.forEach(b => {
            if (!result.find(r => r.ip === b.ip)) {
                result.push({ ip: b.ip, orderCount: 0, isBlocked: true });
            }
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching IP stats:', error);
        return NextResponse.json({ error: 'Failed to fetch IP stats' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectMongo();
        const { ip, action } = await req.json();

        if (action === 'block') {
            await BlockedIP.findOneAndUpdate(
                { ip }, 
                { ip, reason: 'Manually blocked by admin' }, 
                { upsert: true, new: true }
            );
        } else if (action === 'unblock') {
            await BlockedIP.findOneAndDelete({ ip });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating IP block status:', error);
        return NextResponse.json({ error: 'Failed to update block status' }, { status: 500 });
    }
}
