import React from 'react';

const StatsBar = () => {
  const stats = [
    { value: '500+', label: 'Events Covered' },
    { value: '50,000+', label: 'Photos Delivered' },
    { value: '8 Years', label: 'Storytelling' },
  ];

  return (
    <div className="bg-dark text-white py-16 px-6 relative z-30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center items-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="relative group px-12">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-cinzel text-gold font-bold mb-3 tracking-tighter">
              {stat.value}
            </h3>
            <p className="text-secondary text-sm uppercase tracking-[0.4em] font-medium transition-colors hover:text-white">
              {stat.label}
            </p>
            {idx < stats.length - 1 && (
               <div className="hidden md:block absolute right-[-10px] top-1/2 -translate-y-1/2 w-[1px] h-16 bg-gold/20" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
