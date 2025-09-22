const SkipLinks: React.FC = () => (
  <div className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50">
    <a
      href="#main-content"
      className="bg-primary text-text p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
    >
      Aller au contenu principal
    </a>
    <a
      href="#navigation"
      className="bg-primary text-text p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent ml-2"
    >
      Aller à la navigation
    </a>
  </div>
);

export default SkipLinks;