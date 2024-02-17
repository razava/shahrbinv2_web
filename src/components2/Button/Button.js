import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import loaderStyles from "./loader.module.css";

const getDisabledStyle = (disabled) => {
  if (disabled) {
    return "disabled";
  } else return "";
};

const getLoadingElement = (loading, loadingShape) => {
  if (loading) {
    switch (loadingShape) {
      case "default":
        return <div className={loaderStyles.default}></div>;
      case "dots":
        return (
          <div className={loaderStyles.dots}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        );
      case "bars":
        return <div className={loaderStyles.bars}></div>;

      case "indetermine":
        return (
          <div className={loaderStyles.progressBar}>
            <div className={loaderStyles.progressBarValue}></div>
          </div>
        );
    }
  } else return null;
};

const getToolTipClassName = (tooltip) => {
  if (tooltip) return [styles.tooltip, styles.tooltip_show].join(" ");
  else return styles.tooltip;
};

const getTooltipPosition = (ref) => {
  const bounding = ref?.current?.getBoundingClientRect();
  return bounding.top - window.scrollY > window.innerHeight / 2
    ? "top"
    : "bottom";
};

const Button = ({
  children,
  type = "button",
  disabled = false,
  onClick = (f) => f,
  startIcon = "",
  endIcon = "",
  loading = false,
  loadingShape = "default",
  className = "",
  tooltip = "",
  wrapperRef,
}) => {
  const btnRef = useRef(null);

  const [toolTipPosition, setToolTipPosition] = useState("top");

  disabled = loading ? true : disabled;

  const disabledStyle = getDisabledStyle(disabled);
  const toolTipStyle =
    toolTipPosition === "top"
      ? {
          bottom: `calc(100% + 10px)`,
        }
      : {
          top: `calc(100% + 10px)`,
        };
  const buttonClassName = [styles.btn, styles[disabledStyle], className].join(
    " "
  );

  const tooltipClassName = getToolTipClassName(tooltip);
  const loadingElement = getLoadingElement(loading, loadingShape);
  const hasChildren = children;
  const startIconClassName = `${hasChildren ? "ml1" : ""}`;
  const endIconClassName = `${hasChildren ? "mr1" : ""}`;

  useEffect(() => {
    if (tooltip && btnRef.current) {
      const toolTipPosition = getTooltipPosition(btnRef);
      setToolTipPosition(toolTipPosition);
    }
    if (wrapperRef && btnRef.current) {
      wrapperRef.current = btnRef.current;
    }
  }, [btnRef.current, tooltip, wrapperRef]);

  return (
    <>
      <button
        className={buttonClassName}
        type={type}
        disabled={disabled}
        onClick={onClick}
        ref={btnRef}
      >
        {loading ? (
          loadingElement
        ) : (
          <>
            {startIcon && (
              <span className={startIconClassName}>
                <i className={startIcon}></i>
              </span>
            )}
            {children}
            {endIcon && (
              <span className={endIconClassName}>
                <i className={endIcon}></i>
              </span>
            )}
          </>
        )}
        <span className={tooltipClassName} style={toolTipStyle}>
          {tooltip}
        </span>
      </button>
    </>
  );
};

export default Button;
