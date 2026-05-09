const SkipLinks: React.FC = () => (
  <div>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 z-[200] bg-accent text-primary font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
    >
      Aller au contenu principal
    </a>
    <a
      href="#navigation"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-52 z-[200] bg-accent text-primary font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
    >
      Aller à la navigation
    </a>
  </div>
);

export default SkipLinks;
