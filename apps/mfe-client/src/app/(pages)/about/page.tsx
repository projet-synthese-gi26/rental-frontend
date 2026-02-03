'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Car, Calendar, CreditCard, Headphones } from 'lucide-react';
import { TeamMemberCard } from '@/components/TeamMemberCard';

// Team members data
const teamMembers = [
  { name: 'Nguepssi Brayanne', role: 'Project Manager', photo: '/client/images/team/member-1.jpg' },
  { name: 'Hassana Zouheiriyya', role: 'Membre', photo: '/client/images/team/member-2.jpg' },
  { name: 'Ntye Nina', role: 'Membre', photo: '/client/images/team/member-3.jpg' },
  { name: 'Vuide Jordan', role: 'Membre', photo: '/client/images/team/member-4.jpg' },
  { name: 'Ngom Christine', role: 'Membre', photo: '/client/images/team/member-5.jpg' },
  { name: 'Kamga Davy', role: 'Membre', photo: '/client/images/team/member-6.jpg' },
];

// Features data
const features = [
  {
    icon: Car,
    title: 'Diverse Fleet Options',
    description: 'Choose from cars, trucks, and vans for every need',
  },
  {
    icon: Calendar,
    title: 'Flexible Rentals',
    description: 'Short-term or long-term - EasyRent adapts to your schedule',
  },
  {
    icon: CreditCard,
    title: 'Transparent Payments',
    description: 'No hidden fees, just simple and secure transactions',
  },
  {
    icon: Headphones,
    title: 'Customer Satisfaction',
    description: 'Our clients\' feedback speaks volumes',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                100% Trusted Vehicle Rental Service
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Looking for a reliable way to rent vehicles for your travel or business needs?
                EasyRent is here to provide you with a seamless rental experience. We offer a
                diverse fleet of well-maintained vehicles, transparent pricing, and exceptional
                customer service to make your journey comfortable and hassle-free.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you need a compact car for city driving, an SUV for family trips, or a
                luxury vehicle for special occasions, we have the perfect option for you. Our
                commitment to quality and customer satisfaction has made us the preferred choice
                for thousands of clients across Cameroon.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/client/images/about/fleet.jpg"
                  alt="Our Fleet"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-600 rounded-2xl hidden lg:block" />
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-500 rounded-xl hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              100% Trusted Vehicle Rental Service
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              What makes EasyRent the preferred choice for vehicle rentals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon size={28} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Notre Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Chez EasyRent, notre mission est de rendre la location de véhicules simple,
              accessible et agréable pour tous. Nous croyons que chaque trajet devrait être
              une expérience positive, et nous nous engageons à fournir des véhicules de
              qualité, un service client exceptionnel et des prix transparents.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nous sommes fiers d&apos;avoir servi des milliers de clients satisfaits et
              nous continuons à innover pour améliorer notre service. Que vous soyez un
              voyageur occasionnel ou un professionnel ayant besoin d&apos;une flotte de
              véhicules, nous sommes là pour vous accompagner.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind EasyRent who work tirelessly to ensure your
              satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
              Nos Valeurs
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Intégrité</h3>
                <p className="text-gray-600">
                  Nous agissons avec honnêteté et transparence dans toutes nos interactions
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">
                  Nous visons toujours la meilleure qualité dans nos services et nos véhicules
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  Nous adoptons les nouvelles technologies pour améliorer votre expérience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Rejoignez notre équipe
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Nous sommes toujours à la recherche de talents passionnés pour rejoindre notre
            équipe dynamique. Si vous partagez nos valeurs et souhaitez contribuer à notre
            mission, n&apos;hésitez pas à nous contacter.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}
