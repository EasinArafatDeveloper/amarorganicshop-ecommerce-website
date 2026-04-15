"use client";

import { useState } from 'react';
import { ShieldAlert, ShieldOff, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function IPAction({ ip, isBlocked }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        if (!ip) return;
        setLoading(true);
        const action = isBlocked ? 'unblock' : 'block';
        try {
            const res = await fetch('/api/admin/ip-management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip, action })
            });

            if (res.ok) {
                toast.success(`IP ${action}ed successfully`);
                router.refresh();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!ip) return null;

    return (
        <button 
            onClick={handleToggle}
            disabled={loading}
            className={`w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                isBlocked 
                ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200" 
                : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
            }`}
        >
            {loading ? (
                <RefreshCw size={14} className="animate-spin" />
            ) : isBlocked ? (
                <><ShieldOff size={14} /> Unblock this IP</>
            ) : (
                <><ShieldAlert size={14} /> Block this IP</>
            )}
        </button>
    );
}
