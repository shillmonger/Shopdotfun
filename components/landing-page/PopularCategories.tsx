import Image from "next/image";

export function PopularCategories() {
  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-4">
              Popular Categories
            </h2>
          </div>
        </div>

        {/* Horizontal Scroll on Mobile / 6 Columns on Desktop */}
        <div className="flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible md:pb-0 scrollbar-hide">
          {[
            { name: "Smart Phones", count: 21, color: "bg-rose-900/80", img: "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=300&auto=format&fit=crop" },
            { name: "Laptops & PCs", count: 14, color: "bg-blue-900/80", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300&auto=format&fit=crop" },
            { name: "Smart Watches", count: 12, color: "bg-emerald-900/80", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=300&auto=format&fit=crop" },
            { name: "Tablets/iPads", count: 9, color: "bg-amber-900/80", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300&auto=format&fit=crop" },
            { name: "Headphones", count: 18, color: "bg-indigo-900/80", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop" },
            { name: "Accessories", count: 45, color: "bg-purple-900/80", img: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=300&auto=format&fit=crop" },
          ].map((cat, index) => (
            <div
              key={index}
              className="min-w-[200px] md:min-w-0 aspect-[4/3] md:aspect-auto md:h-32 snap-start group relative rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Background Image */}
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Color Overlay */}
              <div className={`absolute inset-0 ${cat.color} mix-blend-multiply opacity-80 group-hover:opacity-70 transition-opacity`} />
              
              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-center">
                <h3 className="text-white font-black text-lg leading-tight uppercase tracking-tighter italic">
                  {cat.name}
                </h3>
                <p className="text-white/80 text-[10px] font-bold mt-1">
                  ({cat.count} Products)
                </p>
              </div>

              {/* Border Effect on Hover */}
              <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-colors pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
