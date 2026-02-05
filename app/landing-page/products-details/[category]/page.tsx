import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import CategoryDeals from "@/components/landing-page/CategoryDeals";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
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

  // Replace hyphens with spaces and decode URL-encoded characters
  const categoryName = decodeURIComponent(category).replace(/-/g, " ");

  return (
    <>
      <Header />
      <ThemeAndScroll />
      <main className="container max-w-[1400px] mx-auto py-5 min-h-screen mt-20 mb-20">
        <h1 className="text-3xl font-bolder mb-8 capitalize font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent text-center">
          {categoryName}
        </h1>

        <CategoryDeals categoryFilter={categoryName} />
      </main>

      <PopularCategories />

      <Footer />
    </>
  );
}