import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface dark:bg-surface-container-lowest py-lg border-t border-outline-variant/30">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="col-span-2">
          <p className="text-headline-md font-display-lg text-primary mb-sm">Trust Circles</p>
          <p className="text-body-sm text-on-surface-variant max-w-xs">Built on the Stellar network for speed, transparency, and global accessibility. Financial empowerment through community code.</p>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-on-surface mb-sm">Community</h5>
          <ul className="space-y-xs text-body-sm text-on-surface-variant">
            <li><a className="hover:text-primary transition-colors" href="#">Documentation</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Discord Server</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Governance</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-on-surface mb-sm">Platform</h5>
          <ul className="space-y-xs text-body-sm text-on-surface-variant">
            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Security Audit</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
