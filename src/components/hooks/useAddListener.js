import React from "react";

const useAddListener = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const onClick = (event) => {
      event.stopPropagation();
      if (element.current !== null && !element.current.contains(event.target)) {
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener("click", onClick);
    }

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [isActive, element]);

  return [isActive, setIsActive];
};

export default useAddListener;
