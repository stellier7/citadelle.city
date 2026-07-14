export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Project',
      description: 'Browse developments in emerging markets worldwide. From luxury towers to commercial complexes.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      highlight: 'From $500 investment'
    },
    {
      number: '02',
      title: 'Purchase Tokens',
      description: 'Own your fractional share through secure blockchain tokens. Transparent ownership, instant settlement.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      highlight: 'Trade anytime after 90 days'
    },
    {
      number: '03',
      title: 'Earn Returns',
      description: 'Generate yield during construction. Share in rental income or sale proceeds upon completion.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      highlight: '15%+ target annual returns'
    }
  ];

  return (
    <div className="bg-zinc-900 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-[#d4af37] uppercase tracking-wider">
            How It Works
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-white font-serif">
            Build Together, Earn Together
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Three simple steps to start building generational wealth through real estate
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Connecting line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#d4af37] to-transparent" 
                     style={{ width: 'calc(100% - 4rem)' }} 
                />
              )}

              {/* Card */}
              <div className="relative bg-black border border-zinc-800 rounded-2xl p-8 transition-all duration-300 hover:border-[#d4af37] hover:shadow-xl hover:shadow-[#d4af37]/10">
                {/* Step number */}
                <div className="absolute -top-4 left-8 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold text-sm px-4 py-1 rounded-full">
                  STEP {step.number}
                </div>

                {/* Icon */}
                <div className="mt-4 text-[#d4af37]">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="mt-6 text-2xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Highlight */}
                <div className="mt-6 inline-flex items-center gap-2 text-[#d4af37] text-sm font-semibold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {step.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">
            Ready to start building?
          </p>
          <a 
            href="/developments" 
            className="inline-flex items-center gap-2 text-[#d4af37] font-semibold text-lg hover:gap-4 transition-all duration-300"
          >
            View all active projects
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
