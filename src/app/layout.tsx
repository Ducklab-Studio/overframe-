import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import { CircuitBackground } from "@/components/circuit-background";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat'
});

export const metadata: Metadata = {
  title: "OVERFRAMER | Agência de Tecnologia Criativa",
  description: "Desenvolvimento web, identidade visual, copywriting, edição de vídeo e programação sob medida.",
  icons: {
    icon: [{ url: '/favicon/favicon.png', type: 'image/png' }],
    shortcut: '/favicon/favicon.png',
    apple: '/favicon/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${montserrat.variable} font-sans bg-[#080808] text-[#F2F2F2] antialiased`}>
        <CircuitBackground />
        <div className="relative" style={{ zIndex: 1 }}>
          <NavbarWrapper />
          {children}
        </div>
      </body>
    </html>
  );
}
