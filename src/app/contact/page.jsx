'use client';
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        contactInfo: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings/public');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) {
                console.error("Failed to load contact settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.contactInfo || !formData.subject || !formData.message) {
            toast.error("Please fill out all fields.");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Message sent successfully!");
                setIsSuccess(true);
                setFormData({ name: '', contactInfo: '', subject: '', message: '' });
                // Reset success state after a few seconds
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to send message.");
            }
        } catch (error) {
            toast.error("Network error. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#fdfbf7]/60 py-12 md:py-20 px-4 font-sans relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/30 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-200/30 rounded-full blur-[100px] -z-10"></div>
            
            <div className="max-w-[1200px] mx-auto animate-in slide-in-from-bottom-5 duration-700 fade-in">
                
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-bold text-gray-600 mb-4 uppercase tracking-wider">
                        <MessageSquare className="w-4 h-4 text-secondary" />
                        We're Here to Help
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2b3c] tracking-tight mb-4">
                        Contact <span className="text-secondary">Us</span>
                    </h1>
                    <p className="text-gray-500 max-w-xl mx-auto font-medium">
                        Have a question about our organic products, your recent order, or bulk purchases? Send us a message and our team will get back to you swiftly.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
                    
                    {/* Left Panel: Contact Info */}
                    <div className="w-full lg:w-2/5 p-8 md:p-12 lg:p-16 bg-[#04211c] text-white relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/20 rounded-full blur-[80px]"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-black mb-2">Get in touch</h2>
                            <p className="text-gray-400 text-sm mb-12">We love to hear from our customers. Reach out to us through any of these channels.</p>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                        <MapPin className="text-secondary w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Our Location</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {settings?.contactAddress || "Dhaka, Bangladesh. Delivery available nationwide."}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                        <Phone className="text-secondary w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Phone Number</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {settings?.contactPhone || "+880 1645-368899"}
                                            <br/>
                                            <span className="text-xs opacity-70">
                                                ({settings?.contactPhoneHours || "Saturday to Thursday, 9AM - 8PM"})
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                        <Mail className="text-secondary w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Email Address</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {settings?.contactEmail || "support@amar-organic-shop.com"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-16 space-t-8 relative z-10">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Follow Us</h4>
                            <div className="flex gap-3">
                                {settings?.facebookUrl && (
                                    <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-secondary cursor-pointer transition-colors">
                                        <svg size={18} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.248h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </a>
                                )}
                                {settings?.instagramUrl && (
                                    <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-secondary cursor-pointer transition-colors">
                                        <svg size={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    </a>
                                )}
                                {settings?.linkedinUrl && (
                                    <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-secondary cursor-pointer transition-colors">
                                        <svg size={18} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: The Form */}
                    <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16 relative">
                        {isSuccess ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-800 mb-3">Message Sent!</h2>
                                <p className="text-gray-500 max-w-sm">Thank you for reaching out. Our support team will review your message and reply via your provided contact info.</p>
                                <button onClick={() => setIsSuccess(false)} className="mt-8 px-6 py-2.5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="h-full flex flex-col justify-center space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 mb-2">Send a Message</h3>
                                    <p className="text-gray-500 text-sm mb-8 font-medium">Fill out the form below and we'll be in touch as soon as possible.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Full Name *</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your name" 
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Email / Phone *</label>
                                        <input 
                                            type="text" 
                                            name="contactInfo"
                                            value={formData.contactInfo}
                                            onChange={handleChange}
                                            placeholder="How can we reply back?" 
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Subject *</label>
                                    <input 
                                        type="text" 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="What is this regarding?" 
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all text-sm font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Message *</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="Write your message here..." 
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all resize-none text-sm font-medium"
                                    ></textarea>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className={`w-full md:w-auto px-8 py-4 rounded-xl font-black text-white shadow-lg flex justify-center items-center gap-3 transition-all ${
                                            isSubmitting ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-secondary hover:bg-[#1a2b3c] hover:shadow-gray-300 active:scale-95'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                                        ) : (
                                            <>Send Message <Send className="w-4 h-4 ml-1" /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
