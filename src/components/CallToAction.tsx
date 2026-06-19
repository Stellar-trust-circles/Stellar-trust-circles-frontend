import React from 'react';

interface CallToActionProps {
  onCreateCircle?: () => void;
  onBrowseCircles?: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onCreateCircle, onBrowseCircles }) => {
  return (
    <section className="mt-xl py-xl px-lg text-center rounded-3xl bg-surface-container-low border border-outline-variant/30">
      <h2 className="font-display-sm text-display-sm mb-sm text-on-surface">Start your first circle today</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-2xl mx-auto">
        Join over 2,000 global savers using Trust Circles to build generational wealth and communal security through the power of blockchain.
      </p>
      <div className="flex flex-wrap justify-center gap-sm">
        <button
          type="button"
          onClick={onCreateCircle}
          className="rounded-full bg-primary px-lg py-md font-label-caps text-label-caps text-on-primary shadow-md transition-all hover:shadow-lg"
        >
          Create New Circle
        </button>
        <button
          type="button"
          onClick={onBrowseCircles}
          className="rounded-full border border-primary px-lg py-md font-label-caps text-label-caps text-primary transition-all hover:bg-primary/5"
        >
          Browse Circles
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
