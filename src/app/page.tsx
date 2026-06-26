import { Hero } from "@/components/hero";
import { Servicos } from "@/components/servicos";
import { Portfolio } from "@/components/portfolio";
import { Sobre } from "@/components/sobre";
import { Time } from "@/components/time";
import { Blog } from "@/components/blog";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

// Renderiza sempre com dados atuais do banco — sem isso o Next congela
// a home no build e edições no painel não aparecem no site no ar.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Servicos />
      <Portfolio />
      <Sobre />
      <Time />
      <Blog />
      <FAQ />
      <Footer />
    </main>
  );
}
