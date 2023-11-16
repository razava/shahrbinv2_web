import { useState, useEffect } from "react";

const useClick = (element, event = "click", whitelists = []) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const onClick = (event) => {
      event.stopPropagation();
      const isIn =
        whitelists.length > 0
          ? whitelists.some(
              (w) => w.current && !w.current.contains(event.target)
            )
          : true;
      if (
        element.current !== null &&
        !element.current.contains(event.target) &&
        isIn
      ) {
        console.log("useclick: ", !isActive);
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener(event, onClick);
    }

    return () => {
      window.removeEventListener(event, onClick);
    };
  }, [isActive, element]);

  return [isActive, setIsActive];
};

export default useClick;
