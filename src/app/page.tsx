import { Hero } from "@/components/hero";
import { Servicos } from "@/components/servicos";
import { Portfolio } from "@/components/portfolio";
import { Sobre } from "@/components/sobre";
import { Time } from "@/components/time";
import { Blog } from "@/components/blog";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

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
