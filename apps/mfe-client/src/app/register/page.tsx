// import { useState } from "react"
// type User = {
//     name: string,
//     email: string,
//     phone: string,
//     password: string
// }
// export default function Register() {
// //    const [user, setUser] = useState<User>();

//     return(
//         <div>
//             <div className="bg-white flex flex-row items-center justify-center rounded-md">
//                 <div className="w-1/2 bg-primary rounded-md px-8 py-32">
//                     logo
//                     <h2>Easy-rental</h2>
//                     <p>Our clients will find their automobile need here, take your time and choose the vehicle that fit you the most. </p>
//                 </div>
//                 <div className="w-1/2 px-8">
//                     <h2>Register form</h2>
//                     <form action="" >
//                         <label htmlFor=""> Full name</label>
//                         <input type="text" id="name"/>
//                         <label htmlFor="">Email address</label>
//                         <input type="text" id="email"/>
//                         <label htmlFor="">Phone number</label>
//                         <input type="text" id="phone"/>
//                         <label htmlFor="">Password</label>
//                         <input type="password" id="password1"/>
//                         <label htmlFor="">Confirm password</label>
//                         <input type="password" id="password2"/>
//                         <input type="button" value=""/>
//                     </form>
//                 </div>

//             </div>
//         </div>
//     )
// };
'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  type FormData = {
    email: string,
    password: string
  }
  const [, setFormData] = useState<FormData>({
    email: '',
    password: ""
  });
   const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      email: "",
      password: ""
    };

    setFormData(data); // <-- Save the object in state
    console.log('Form data:', data);
    
    try{
      // await reportService.createReport(reportData);
      console.log("Compte créé avec succes!")
      router.push('/')
    }catch(error){
      console.error("Un problème est survenu lors de la création de compte.")
      console.log(error)
    }
   
    setIsSubmitting(false);
  };
  return (
    <div className=" flex items-center justify-center ">
      {/* Main Card */}
      <div className="relative w-full max-w-2xl h-[420px] bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-2">
        {/* Left side – Form */}
        <div className="z-10 flex flex-col justify-center px-10">
          <h2 className="text-2xl font-bold mb-2">Create account</h2>
          {/* <p className="text-sm text-gray-500 mb-6">Join us and get started</p> */}

          <form className="space-y-4 mb-8 text-sm" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full name"
              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-secondary py-3 text-white font-semibold hover:opacity-90 transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Doing register...
                </>
              ) : 'Register'}
            </button>
          </form>
          <p className="text-sm ">You already have an account? <a href="/client" className="text-primary"> {" Let's login"} </a> </p> 
        </div>

        {/* Right side – Branding */}
        <div className="relative flex flex-col items-center justify-center bg-primary text-white px-10">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              LOGO
            </div>
            <h1 className="text-3xl font-extrabold">MyApp</h1>
            <p className="text-sm opacity-90">
              A simple and modern platform to manage your ideas and projects
              efficiently.
            </p>
          </div>
        </div>

        {/* Sinusoidal separator */}
        <svg
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 h-full"
          width="120"
          viewBox="0 0 120 520"
          preserveAspectRatio="none"
        >
          <path
            d="M60 0 C20 80 100 140 60 220 C20 300 100 360 60 440 C40 480 40 520 40 520 L0 520 L0 0 Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
