import React from "react";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
  minCardWidth?: string;
  maxColumns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = "",
  gap = "md",
  minCardWidth = "280px",
  maxColumns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
}) => {
  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  // Map statique pour que Tailwind puisse detecter les classes au build
  const colMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };
  const smMap: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
  };
  const mdMap: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  };
  const lgMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  };

  const columnClasses = [
    colMap[maxColumns.xs || 1],
    maxColumns.sm && smMap[maxColumns.sm],
    maxColumns.md && mdMap[maxColumns.md],
    maxColumns.lg && lgMap[maxColumns.lg],
    maxColumns.xl && lgMap[maxColumns.xl],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`grid ${columnClasses} ${gapClasses[gap]} ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

interface MobileCarouselProps {
  children: React.ReactNode;
  className?: string;
  showScrollbar?: boolean;
  itemWidth?: string;
}

export const MobileCarousel: React.FC<MobileCarouselProps> = ({
  children,
  className = "",
  showScrollbar = false,
  itemWidth = "280px",
}) => {
  return (
    <div
      className={`
        flex overflow-x-auto mobile-scroll-snap pb-4
        ${showScrollbar ? "" : "scrollbar-hide"}
        ${className}
      `}
      style={{ scrollSnapType: "x mandatory" }}
    >
      {React.Children.map(children, (child) => (
        <div
          className="flex-none mr-4 last:mr-0"
          style={{
            width: itemWidth,
            scrollSnapAlign: "start",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Composant pour gérer la transition entre grid et carousel
interface AdaptiveLayoutProps {
  children: React.ReactNode;
  breakpoint?: "sm" | "md" | "lg";
  mobileCarousel?: boolean;
  gridProps?: Partial<ResponsiveGridProps>;
  carouselProps?: Partial<MobileCarouselProps>;
}

export const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  breakpoint = "md",
  mobileCarousel = true,
  gridProps = {},
  carouselProps = {},
}) => {
  const breakpointClass = {
    sm: "sm:hidden",
    md: "md:hidden",
    lg: "lg:hidden",
  };

  const showGridClass = {
    sm: "hidden sm:block",
    md: "hidden md:block",
    lg: "hidden lg:block",
  };

  return (
    <>
      {/* Mobile/Tablet Carousel */}
      {mobileCarousel && (
        <div className={breakpointClass[breakpoint]}>
          <MobileCarousel {...carouselProps}>{children}</MobileCarousel>
        </div>
      )}

      {/* Desktop Grid */}
      <div className={showGridClass[breakpoint]}>
        <ResponsiveGrid {...gridProps}>{children}</ResponsiveGrid>
      </div>

      {/* Fallback pour mobile si pas de carousel */}
      {!mobileCarousel && (
        <div className={breakpointClass[breakpoint]}>
          <ResponsiveGrid maxColumns={{ xs: 1, sm: 2 }} {...gridProps}>
            {children}
          </ResponsiveGrid>
        </div>
      )}
    </>
  );
};
