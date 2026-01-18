export default function FeaturesSection() {
  const features = [
    { 
      label: "Free Shipping", 
      img: "https://i.postimg.cc/RFsf3zQF/f1.png", 
      color: "bg-[#fddde4] text-[#088178] border-[#fddde4]" 
    },
    { 
      label: "Online Orders", 
      img: "https://i.postimg.cc/G3fGddpd/f2.png", 
      color: "bg-[#d1e8f2] text-[#088178] border-[#cdd4f8]" 
    },
    { 
      label: "Save Money", 
      img: "https://i.postimg.cc/6QBGYQMn/f3.png", 
      color: "bg-[#cce7d0] text-[#088178] border-[#cce7d0]" 
    },
    { 
      label: "Promotions", 
      img: "https://i.postimg.cc/CdyRDMZG/f4.png", 
      color: "bg-[#e2e9ff] text-[#088178] border-[#e2e9ff]" 
    },
    { 
      label: "Happy Sell", 
      img: "https://i.postimg.cc/9fXYz1Hj/f5.png", 
      color: "bg-[#f6dbf6] text-[#088178] border-[#f6dbf6]" 
    },
    { 
      label: "F24/7 Support", 
      img: "https://i.postimg.cc/x8mKB4MR/f6.png", 
      color: "bg-[#fff2e5] text-[#088178] border-[#fff2e5]" 
    },
  ];

  return (
    <section className="py-10 bg-background">
      <div className="container max-w-[1400px] mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
            Features
          </h2>
          <p className="text-muted-foreground font-medium tracking-widest uppercase text-sm">
            Summer Collection New Modern Design
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center justify-between cursor-pointer p-4 sm:p-8 bg-white dark:bg-secondary/10 rounded-xl border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="mb-6 flex items-center justify-center h-24 w-full">
                <img 
                  src={feature.img} 
                  alt={feature.label}
                  className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Badge Label - Using exact colors from your screenshot */}
              <div className={`
                w-full py-1.5 px-2 rounded-md text-[11px] font-black uppercase tracking-tight text-center border
                ${feature.color}
              `}>
                {feature.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}