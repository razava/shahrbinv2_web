import React from "react";
import Button from "../../helpers/Button";

const DialogButtons = ({
  onPrimaryClick = (f) => f,
  onSecondaryClick = (f) => f,
  primaryTitle = "",
  secondaryTitle = "",
  primaryLoading = false,
  secondaryLoading = false,
  primaryClassName = {},
  secondaryClassName = {},
  primaryStyle = {},
  secondaryStyle = {},
  wrapperClassName = "",
  otherButtons = [],
}) => {
  return (
    <>
      <div
        className={[
          "w100 fre mt3 mh50 border-t-light bg-white",
          wrapperClassName,
        ].join(" ")}
      >
        {otherButtons.map((b) => (
          <Button
            key={b.id}
            title={b.title}
            className={b.className}
            onClick={b.onClick}
            loading={b.loading}
            style={b.style}
          />
        ))}
        {secondaryTitle && (
          <Button
            title={secondaryTitle}
            className="rw1 w100 text-primary"
            onClick={onSecondaryClick}
            style={{
              backgroundColor: "var(--glassPrimary)",
              ...secondaryStyle,
            }}
            loading={secondaryLoading}
          />
        )}
        <Button
          title={primaryTitle}
          className="rw1 w100 mx1"
          onClick={onPrimaryClick}
          loading={primaryLoading}
          style={primaryStyle}
        />
      </div>
    </>
  );
};

export default DialogButtons;
