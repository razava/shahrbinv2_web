import React, { useEffect, useState } from "react";
import styles from "./style.module.css";

const Progress = ({ value = 50, animated = true }) => {
  //   states
  const [width, setWidth] = useState(0);

  //   classNames
  const wrapperClassName = [styles.bar].join(" ");
  const progressClassName = [styles.progress].join(" ");

  //   styles
  const progressStyle = {
    width: width + "%",
  };

  //   effects
  useEffect(() => {
    setTimeout(() => {
      setWidth(value);
    }, 100);
  }, []);
  return (
    <>
      <div className={wrapperClassName}>
        <div className={progressClassName} style={progressStyle}></div>
      </div>
    </>
  );
};

export default Progress;
