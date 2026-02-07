
import RegisterForm from '@/features/auth/components/RegisterForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-emerald-900 font-bold transition-all">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Home</span>
                </Link>
            </div>

            <div className="w-full max-w-md mb-8 text-center">
                <h1 className="text-4xl font-black text-emerald-900 tracking-tighter drop-shadow-sm uppercase">
                    Eleven<span className="text-white">LineUp</span>
                </h1>
            </div>

            <RegisterForm />
        </main>
    );
}
