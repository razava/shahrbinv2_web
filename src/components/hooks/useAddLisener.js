import React, { useEffect } from "react";

function useAddLisener({
  ref = "window",
  listenTo,
  condition = true,
  callback,
  once = false,
}) {
  useEffect(() => {
    function handler(event) {
      if (ref === "window") {
        callback(ref, event);
        return;
      }
      if (ref.current && !ref.current.contains(event.target) && condition) {
        callback(ref, event);
      }
    }

    if (ref === "window") {
      window.addEventListener(listenTo, handler, { once });
    } else {
      document.addEventListener(listenTo, handler, { once });
    }
    return () => {
      document.removeEventListener(listenTo, handler, { once });
      window.removeEventListener(listenTo, handler, { once });
    };
  }, [ref, condition]);
}

export default useAddLisener;
