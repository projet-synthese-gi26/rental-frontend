'use client'
import { Star, Quote } from 'lucide-react';
import { TestimonialCard } from './TestimonialCard';

const Testimonial = () => {
    const testimonials = [
        {
            name: 'Jean-Pierre Nguema',
            photo: '/team/worker.jpg', // Adapté à tes fichiers
            rating: 5,
            comment: 'Service impeccable! La voiture était en parfait état et le personnel très professionnel. Je recommande vivement.',
            date: '2024-01-15',
        },
        {
            name: 'Marie Atangana',
            rating: 5,
            comment: 'Très satisfaite de mon expérience. Le processus de réservation était simple et le véhicule correspondait parfaitement.',
            date: '2024-01-10',
        },
        {
            name: 'Paul Kamga',
            rating: 4,
            comment: 'Excellente agence! Prix compétitifs et service client au top. Je suis client régulier maintenant.',
            date: '2024-01-08',
        },
    ];

    return (
        <section className="py-32 bg-slate-50 dark:bg-slate-900/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-[10px] font-black tracking-widest uppercase italic mb-4">
                            <Star size={12} fill="currentColor" /> Avis Clients
                        </div>
                        <h2 className="text-5xl md:text-6xl font-[900] italic leading-none tracking-tighter text-slate-900 dark:text-white uppercase">
                            Ils nous font <br /><span className="text-blue-600">Confiance</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="text-3xl font-black text-blue-600 italic">4.8/5</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                            Basé sur plus de <br /> 2,500 avis certifiés
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="relative group">
                            <div className="absolute -top-4 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote size={60} className="text-blue-600" />
                            </div>
                            <TestimonialCard {...testimonial} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonial;