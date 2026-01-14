import { useEffect, useRef } from "react";

export const BuyMeACoffeeButton = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // 중복 삽입 방지
    if (ref.current.childNodes.length > 0) return;

    const script = document.createElement("script");
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js";
    script.async = true;

    script.setAttribute("data-name", "bmc-button");
    script.setAttribute("data-slug", "wejustcount.com"); // ✅ 정확함
    script.setAttribute("data-color", "#101828");
    script.setAttribute("data-emoji", "☕");
    script.setAttribute("data-font", "Poppins");
    script.setAttribute("data-text", "Buy me a coffee");
    script.setAttribute("data-outline-color", "#ffffff");
    script.setAttribute("data-font-color", "#ffffff");
    script.setAttribute("data-coffee-color", "#FFDD00");

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} className="mt-4" />;
};
