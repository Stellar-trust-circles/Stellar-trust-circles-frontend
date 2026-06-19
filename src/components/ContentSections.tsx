import React from 'react';

const ContentSections: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-md items-stretch">
      <div className="md:col-span-8 bento-card p-lg flex flex-col justify-center">
        <div className="mb-sm">
          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-caps text-label-caps">What is a ROSCA?</span>
        </div>
        <h2 className="font-headline-md text-headline-md mb-md">Traditional savings, <br />upgraded for the modern age.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          <div className="space-y-xs">
            <h4 className="font-bold text-primary italic">Ajo</h4>
            <p className="text-body-sm text-on-surface-variant">Popular in Nigeria, where a group contributes weekly to a lump sum payout.</p>
          </div>
          <div className="space-y-xs">
            <h4 className="font-bold text-primary italic">Tanda</h4>
            <p className="text-body-sm text-on-surface-variant">The Latin American community tradition of interest-free rotating credit.</p>
          </div>
          <div className="space-y-xs">
            <h4 className="font-bold text-primary italic">Chama</h4>
            <p className="text-body-sm text-on-surface-variant">Kenyan investment groups built on mutual support and regular contributions.</p>
          </div>
        </div>
      </div>
      <div className="md:col-span-4 bento-card p-lg bg-primary-container text-on-primary-container flex flex-col justify-between overflow-hidden relative group">
        <div className="relative z-10">
          <h3 className="font-headline-md text-headline-md mb-xs">Secured by Code</h3>
          <p className="text-body-md opacity-80">Our smart contracts ensure that payouts are mathematically guaranteed. No human can touch your funds.</p>
        </div>
        <div className="mt-xl relative z-10">
          <button className="bg-white text-primary px-sm py-xs rounded-full font-label-caps text-label-caps flex items-center gap-2 group-hover:scale-105 transition-transform">
            Verify Ledger
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </button>
        </div>
        {/* Abstract visual behind text */}
        <div className="absolute bottom-[-20%] right-[-10%] opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
          {/* SVG or other visual element can go here */}
        </div>
      </div>

      {/* Features Cards */}
      <div className="md:col-span-4 bento-card p-lg flex flex-col gap-sm">
        <div className="w-12 h-12 bg-surface-variant rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">diversity_3</span>
        </div>
        <h4 className="font-bold text-body-lg">Circle Management</h4>
        <p className="text-body-sm text-on-surface-variant">Create private circles for family or join verified public groups with established reputations.</p>
      </div>
      <div className="md:col-span-4 bento-card p-lg flex flex-col gap-sm">
        <div className="w-12 h-12 bg-surface-variant rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">history_edu</span>
        </div>
        <h4 className="font-bold text-body-lg">Transparent Ledger</h4>
        <p className="text-body-sm text-on-surface-variant">Every contribution and payout is recorded on the Stellar network, visible to all members for perfect auditability.</p>
      </div>
      <div className="md:col-span-4 bento-card p-lg flex flex-col gap-sm">
        <div className="w-12 h-12 bg-surface-variant rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">speed</span>
        </div>
        <h4 className="font-bold text-body-lg">Instant Payouts</h4>
        <p className="text-body-sm text-on-surface-variant">As soon as the cycle ends, your lump sum is automatically transferred to your wallet. No waiting, no checks.</p>
      </div>
    </section>
  );
};

export default ContentSections;
