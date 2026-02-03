'use client'
import { Star } from 'lucide-react';
import { TestimonialCard } from './TestimonialCard';


const Testimonial = () =>{
    // Testimonials data
    const testimonials = [
    {
        name: 'Jean-Pierre Nguema',
        photo: '/client/images/users/user-1.jpg',
        rating: 5,
        comment: 'Service impeccable! La voiture était en parfait état et le personnel très professionnel. Je recommande vivement EasyRent pour tous vos besoins de location.',
        date: '2024-01-15',
    },
    {
        name: 'Marie Atangana',
        rating: 4.5,
        comment: 'Très satisfaite de mon expérience. Le processus de réservation était simple et le véhicule correspondait parfaitement à mes attentes.',
        date: '2024-01-10',
    },
    {
        name: 'Paul Kamga',
        photo: '/client/images/users/user-3.jpg',
        rating: 5,
        comment: 'Excellente agence! Prix compétitifs et service client au top. Je suis client régulier maintenant.',
        date: '2024-01-08',
    },
    ];
    return(
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <div className="flex items-center justify-center gap-2">
              <Star size={24} className="text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold">4.8</span>
              <span className="text-gray-500">basé sur 2,500+ avis</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    )
}

export default Testimonial;