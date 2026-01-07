import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AgencyZen - Plataforma Multi-Agente de IA",
    description: "Sistema de automação de marketing com IA para agências. Gerencie redes sociais, anúncios e atendimento automaticamente.",
    keywords: ["marketing", "ia", "automação", "agência", "redes sociais", "anúncios"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className="dark">
            <body className={`${inter.className} antialiased`}>
                <div className="min-h-screen animated-gradient">
                    {children}
                </div>
            </body>
        </html>
    );
}
