// import { CategoryDeals } from "@/components/landing-page/CategoryDeals";

// interface ProductDetailsPageProps {
//   params: { category: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// }

// export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
//   // Get the category from the URL and replace hyphens with spaces
//   const categoryName = params.category.replace(/-/g, ' ');
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bolder mb-8 capitalize font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
//       {categoryName}
//       </h1>
//       <CategoryDeals categoryFilter={categoryName} />
//     </div>
//   );
// }




import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import { CategoryDeals } from "@/components/landing-page/CategoryDeals";

interface ProductDetailsPageProps {
  params: { category: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  // Get the category from the URL and replace hyphens with spaces
  const categoryName = params.category.replace(/-/g, ' ');
  
  return (
    <>
      <Header />
      <ThemeAndScroll />
      <main className="container max-w-[1400px] mx-auto px-4 py-5 min-h-screen mt-20">
        <h1 className="text-3xl font-bolder mb-8 capitalize font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent text-center">
          {categoryName}
        </h1>
        <CategoryDeals categoryFilter={categoryName} />
      </main>
      <Footer />
    </>
  );
}