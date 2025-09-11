import { useEffect, useState } from "react";

// Hook personnalisé pour surveiller le scroll et détecter si le h1 a disparu
/**
 * Custom hook that updates the page title based on the scroll position.
 *
 * This hook monitors the scroll position of the window and checks the visibility
 * of the first `<h1>` element on the page. If the `<h1>` element is not visible,
 * it sets the page title to the text content of the `<h1>` element.
 *
 * @returns An object containing:
 * - `isTitleVisible`: A boolean indicating whether the `<h1>` element is visible.
 * - `pageTitle`: A string representing the text content of the `<h1>` element when it is not visible.
 */
export const usePageTitleOnScroll = () => {
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const h1Element = document.querySelector("h1");
      if (h1Element) {
        const rect = h1Element.getBoundingClientRect();
        const isVisible = rect.top > 0 && rect.bottom < window.innerHeight;
        setIsTitleVisible(isVisible);
        if (!isVisible) {
          setPageTitle(h1Element.textContent || "");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { isTitleVisible, pageTitle };
};
