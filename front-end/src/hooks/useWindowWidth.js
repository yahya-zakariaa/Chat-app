const { useState, useEffect } = require("react");

export default function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window?.innerWidth);
    
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window?.innerWidth);
    };
    window?.addEventListener("resize", handleResize);
    return () => {
      window?.removeEventListener("resize", handleResize);
    };
  }, [window?.innerWidth]);

  return windowWidth;
}
