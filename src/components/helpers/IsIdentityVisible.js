import React from "react";
import styles from "../../stylesheets/input.module.css";

const IsIdentityVisible = ({
  onChange = (f) => f,
  value,
  wrapperClassName = "",
  inputClassName = "",
  labelClassName = "",
  defaultStyles = true,
}) => {
  return (
    <>
      <div
        className={[
          defaultStyles ? styles.inputWrapper : "",
          wrapperClassName,
        ].join(" ")}
      >
        <label
          className={[
            defaultStyles ? styles.inputLabel : "",
            labelClassName,
          ].join(" ")}
        >
          نمایش اطلاعات هویتی شهروند
        </label>
        <div
          className={[defaultStyles ? styles.input : "", inputClassName].join(
            " "
          )}
          onClick={() => onChange(!value)}
        >
          <span className="sq25 br50 bw2 border-success frc">
            {value && (
              <span className="f25 text-success">
                <i className="fas fa-check"></i>
              </span>
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default IsIdentityVisible;
