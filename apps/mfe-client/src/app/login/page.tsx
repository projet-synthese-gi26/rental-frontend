'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    type FormData = {
        name: string,
        email: string,
        phone: string,
        password: string
    }
    const [, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: "",
        password: ""
    });
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = {
            name: "",
            email: "",
            phone: "",
            password: ""
        };

        setFormData(data); // <-- Save the object in state
        console.log('Form data:', data);

        try{
            // await reportService.createReport(reportData);
            console.log("Compte créé avec succes!")
            router.push('/vehicles')
        }catch(error){
            console.error("Un problème est survenu lors de la création de compte.")
            console.log(error)
        }

        setIsSubmitting(false);
    };
    return (
        <div className=" flex items-center justify-center ">
            {/* Main Card */}
            <div className="relative w-full max-w-2xl h-[420px] bg-white rounded-xl shadow-xl overflow-hidden grid grid-cols-2">
                {/* Left side – Form */}
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

                {/* Right side – Branding */}
                <div className="z-10 flex flex-col justify-center px-10">
                    <h2 className="text-2xl font-bold mb-2">Login to your account</h2>

                    <form className="space-y-4 mb-8 text-sm" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full rounded-xl border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full rounded-xl border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
                                    Connecting...
                                </>
                            ) : 'Login'}
                        </button>
                    </form>
                    <p className="text-sm ">{"You don't have an account?"} <a href="/client/register" className="text-primary"> {" Create an account"} </a> </p>
                </div>


            </div>
        </div>
    );
}