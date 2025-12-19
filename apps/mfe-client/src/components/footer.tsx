'use client';

import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {

  return (
   <footer className="bg-white pt-16 pb-8 border-t border-gray-200">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
                <div className="text-2xl font-bold text-blue-600 mb-4">Easy-<span className="text-orange-500">Rental</span></div>
                <p className="text-gray-500 mb-6">Rent your Dream Car with a Click.</p>
                <div className="flex space-x-4 text-gray-400">
                    <Facebook className="hover:text-blue-600 cursor-pointer" size={20}/>
                    <Twitter className="hover:text-blue-400 cursor-pointer" size={20}/>
                    <Instagram className="hover:text-pink-600 cursor-pointer" size={20}/>
                    <Linkedin className="hover:text-blue-700 cursor-pointer" size={20}/>
                </div>
            </div>
            
            <div>
                <h4 className="font-bold text-lg mb-6 text-slate-800">Legal</h4>
                <ul className="space-y-3 text-gray-500">
                    <li><a href="#" className="hover:text-orange-500">Mentions légales</a></li>
                    <li><a href="#" className="hover:text-orange-500">CGV</a></li>
                    <li><a href="#" className="hover:text-orange-500">Confidentialité</a></li>
                    <li><a href="#" className="hover:text-orange-500">Cookies</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-lg mb-6 text-slate-800">Services</h4>
                <ul className="space-y-3 text-gray-500">
                    <li><a href="#" className="hover:text-orange-500">Financement</a></li>
                    <li><a href="#" className="hover:text-orange-500">Assurance</a></li>
                    <li><a href="#" className="hover:text-orange-500">Garantie</a></li>
                    <li><a href="#" className="hover:text-orange-500">Livraison</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-lg mb-6 text-slate-800">Contact Us</h4>
                <a href="mailto:easy-rent@mail.com" className="text-blue-600 hover:underline">easy-rent@mail.com</a>
                <div className="mt-4 text-gray-500">
                    +237 000 000 000<br/>
                    Yaoundé, Cameroun
                </div>
            </div>
        </div>
        <div className="text-center text-gray-400 text-sm border-t border-gray-100 pt-8">
            © {new Date().getFullYear()} Easy-rent. Tous droits réservés.
        </div>
      </footer>
  );
}


// 'use client';

// import Link from 'next/link';

// export function Footer() {
//   return (
//     <footer className="bg-gray-900 text-white">
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
//           {/* Logo */}
//           <div>
//             <Link href="/" className="text-xl font-bold">
//               <span className="text-white">EASY</span>
//               <span className="text-orange-500">-RENT</span>
//             </Link>
//             <p className="text-gray-400 text-sm mt-2">
//               Location de véhicules
//             </p>
//           </div>

//           {/* Liens */}
//           <div>
//             <h4 className="font-medium mb-3">Liens rapides</h4>
//             <div className="flex flex-col space-y-2">
//               <Link href="/vehicles" className="text-gray-300 hover:text-orange-400 text-sm">
//                 Véhicules
//               </Link>
//               <Link href="/services" className="text-gray-300 hover:text-orange-400 text-sm">
//                 Services
//               </Link>
//               <Link href="/contact" className="text-gray-300 hover:text-orange-400 text-sm">
//                 Contact
//               </Link>
//             </div>
//           </div>

//           {/* Contact */}
//           <div>
//             <h4 className="font-medium mb-3">Contact</h4>
//             <div className="space-y-2 text-sm">
//               <div className="text-gray-300">contact@easy-rent.cm</div>
//               <div className="text-gray-300">+237 690 000 000</div>
//             </div>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
//           © {new Date().getFullYear()} EASY-RENT. Tous droits réservés.
//         </div>
//       </div>
//     </footer>
//   );
// }