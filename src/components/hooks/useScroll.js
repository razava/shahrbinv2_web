import React, { useEffect, useState } from "react";

const layout = document.getElementById("layout");

const useScroll = () => {
  //   const [lastScrollTop, setLastScrollTop] = useState(0);
  //   const [bodyOffset, setBodyOffset] = useState(
  //     document.body.getBoundingClientRect()
  //   );
  const [scrollY, setScrollY] = useState(layout.scrollTop);
  //   const [scrollX, setScrollX] = useState(bodyOffset.left);
  //   const [scrollDirection, setScrollDirection] = useState();

  const listener = (e) => {
    setScrollY(e.target.scrollTop);
  };

  useEffect(() => {
    layout.addEventListener("scroll", listener);
    return () => {
      layout.removeEventListener("scroll", listener);
    };
  }, []);

  return {
    scrollY,
  };
};

export default useScroll;
