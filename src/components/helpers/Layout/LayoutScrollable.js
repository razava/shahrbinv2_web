import React from "react";
import styles from "./style.module.css";

const LayoutScrollable = ({ children, clipped = 0 }) => {
  return (
    <>
      <section
        className={[styles.layoutScrollable, "scrollbar"].join(" ")}
        style={{
          height: (window.innerHeight * 20) / 24 - clipped,
        }}
      >
        {children}
      </section>
    </>
  );
};

export default LayoutScrollable;
