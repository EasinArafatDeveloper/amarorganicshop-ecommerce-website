import React from 'react';
import Link from 'next/link';
import { Leaf, ShieldCheck, HeartPulse, Recycle, Star, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'About Us | Amar Organic Shop',
    description: 'Learn about Amar Organic Shop\'s mission to provide 100% authentic, pure, and natural organic food, honey, dates, and health products across Bangladesh.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col pt-10 pb-20 overflow-hidden font-sans">
            {/* Hero Section with Glassmorphism */}
            <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-16 md:py-24 z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/50 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200/50 rounded-full blur-[100px] -z-10 animate-pulse delay-1000"></div>
                
                <div className="flex flex-col items-center text-center animate-in slide-in-from-bottom-8 duration-700 fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider">
                        <Leaf className="w-4 h-4 text-secondary" />
                        Welcome to Amar Organic
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#1a2b3c] tracking-tight leading-[1.1] mb-6">
                        Purity You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400">Trust.</span><br/>
                        Nature You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400">Feel.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed mb-10 font-medium">
                        We are on a strict mission to bring you the finest, unadulterated, 100% natural organic foods right to your doorstep. Because your health deserves nothing less than authentic nature.
                    </p>
                </div>
            </section>

            {/* Our Story & Mission Layout */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full animate-in fade-in duration-1000 delay-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Visual Graphic */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-green-400/20 rounded-[3rem] transform rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-6"></div>
                        <div className="relative bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100 h-full">
                            <div className="grid grid-cols-2 gap-4 h-full">
                                <div className="space-y-4">
                                    <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
                                        <img src="https://images.unsplash.com/photo-1587049352847-4d4b1a137e96?q=80&w=600&auto=format&fit=crop" alt="Pure Honey" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="aspect-square bg-[#04211c] rounded-2xl flex flex-col items-center justify-center text-white p-4 shadow-lg">
                                        <span className="text-4xl font-black text-secondary mb-1">100%</span>
                                        <span className="text-sm font-bold uppercase tracking-wider text-center">Pure & Organic</span>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-12">
                                    <div className="aspect-square bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl flex flex-col items-center justify-center p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                                        <Leaf className="w-16 h-16 text-green-500/20 absolute -bottom-4 -right-4" />
                                        <ShieldCheck className="w-10 h-10 text-green-500 mb-2" />
                                        <span className="font-black text-gray-800 text-center">BSTI Approved</span>
                                    </div>
                                    <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
                                        <img src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=600&auto=format&fit=crop" alt="Premium Dates" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-[#1a2b3c] mb-4">Our Story</h2>
                            <div className="w-20 h-1.5 bg-secondary rounded-full mb-6"></div>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                Amar Organic Shop was born from a simple but profound frustration: finding pure, unadulterated food in today's market has become a luxury. 
                                We realized that our families were consuming processed items stripped of their actual nutritional value.
                            </p>
                        </div>
                        
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-[#1a2b3c] mb-4">The Mission</h2>
                            <div className="w-20 h-1.5 bg-green-500 rounded-full mb-6"></div>
                            <p className="text-gray-600 leading-relaxed font-medium mb-6">
                                Our mission is straightforward: We source directly from the most authentic remote farmers and renowned organic estates to eliminate the middlemen.
                                Whether it's Sundarbans' raw honey, premium Arabian dates, or traditional village ghee, we guarantee quality so you don't have to second-guess.
                            </p>
                            
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-secondary shrink-0" />
                                    <span className="font-bold text-gray-700">Zero Preservatives, Zero Compromises.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-secondary shrink-0" />
                                    <span className="font-bold text-gray-700">Directly supporting local and ethical farmers.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-secondary shrink-0" />
                                    <span className="font-bold text-gray-700">Rigorous quality testing before packaging.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values / Features */}
            <section className="bg-[#04211c] text-white py-20 mt-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Why Choose Amar Organic?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-medium">We don't just sell products; we deliver promises. Here is what makes us different from the rest.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Leaf, title: "100% Authentic", desc: "No artificial flavoring or harmful chemicals. We keep our products exactly how nature crafted them." },
                            { icon: HeartPulse, title: "Health Focused", desc: "Every product is curated with your immunity and overall physical well-being in mind." },
                            { icon: Star, title: "Premium Quality", desc: "We handpick only the highest grade of seeds, dates, and honey batches for our customers." },
                            { icon: Recycle, title: "Eco-Friendly", desc: "We utilize sustainable packaging and ethical sourcing models to protect our environment." }
                        ].map((val, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                                    <val.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action CTA */}
            <section className="max-w-5xl mx-auto px-4 py-24 text-center">
                <div className="bg-gradient-to-br from-green-50 to-orange-50 border border-gray-200 p-10 md:p-16 rounded-[3rem] shadow-xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200/40 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-200/40 rounded-full blur-3xl"></div>
                    
                    <h2 className="text-3xl md:text-5xl font-black text-[#1a2b3c] mb-6 relative z-10">Start Your Healthy Journey Today.</h2>
                    <p className="text-gray-600 font-medium max-w-xl mx-auto mb-10 relative z-10">
                        Join thousands of health-conscious families who have made Amar Organic their trusted daily partner in achieving a better lifestyle.
                    </p>
                    
                    <Link href="/shop" className="inline-flex items-center justify-center gap-3 bg-secondary hover:bg-[#1a2b3c] text-white px-8 py-4 rounded-xl font-black text-lg transition-all shadow-lg hover:shadow-xl active:scale-95 group relative z-10">
                        View All Products
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
