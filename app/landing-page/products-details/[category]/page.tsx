import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import { CategoryDeals } from "@/components/landing-page/CategoryDeals";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductDetailsPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  // ✅ Await params (Next.js 15 requirement)
  const { category } = await params;

  // Replace hyphens with spaces
  const categoryName = category.replace(/-/g, " ");

  return (
    <>
      <Header />
      <ThemeAndScroll />
      <main className="container max-w-[1400px] mx-auto py-5 min-h-screen mt-20 mb-20">
        <h1 className="text-3xl font-bolder mb-8 capitalize font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent text-center">
          {categoryName}
        </h1>

        <CategoryDeals categoryFilter={categoryName} />
        
        {/* You May Also Like Section */}
        <div className="mt-12">
          <div className="flex justify-center items-center mb-2">
            <h2 className="text-2xl font-bolder capitalize font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent text-center">
            You May Also Like
            </h2>
          </div>
          
          <div>
            {categoryName.toLowerCase() === 'phones deals' ? (
              <CategoryDeals categoryFilter="Tech Essentials" />
            ) : categoryName.toLowerCase() === 'tech essentials' ? (
              <CategoryDeals categoryFilter="Phones Deals" />
            ) : categoryName.toLowerCase() === 'beauty deals' ? (
              <CategoryDeals categoryFilter="Fashion Deals" />
            ) : categoryName.toLowerCase() === 'fashion deals' ? (
              <CategoryDeals categoryFilter="Men's Fashion" />
            ) : categoryName.toLowerCase() === "men's fashion" ? (
              <CategoryDeals categoryFilter="Classic Style" />
            ) : categoryName.toLowerCase() === 'classic style' ? (
              <CategoryDeals categoryFilter="Accessories" />
            ) : categoryName.toLowerCase() === 'accessories' ? (
              <CategoryDeals categoryFilter="Appliances Deals" />
            ) : categoryName.toLowerCase() === 'appliances deals' ? (
              <CategoryDeals categoryFilter="Kids and Baby" />
            ) : categoryName.toLowerCase() === 'kids and baby' ? (
              <CategoryDeals categoryFilter="Cool Wines" />
            ) : categoryName.toLowerCase() === 'cool wines' ? (
              <CategoryDeals categoryFilter="Beauty Deals" />
            ) : (
              <CategoryDeals categoryFilter="Phones Deals" />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}