
import type { Metadata } from 'next';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

export const metadata: Metadata = {
    title: 'Eleven LineUp',
    description: 'Build your dream Premier League lineup',
};

import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&family=Noto+Sans+Thai:wght@100..900&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased min-h-screen">
                <LanguageProvider>
                    <AppProviders>{children}</AppProviders>
                </LanguageProvider>
            </body>
        </html>
    );
}
