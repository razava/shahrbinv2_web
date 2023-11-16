import React from "react";
import shahrbin from "../../../assets/Images/shahrbin_integrated.png";
import fava from "../../../assets/Images/fava.png";
import province from "../../../assets/Images/province-logo.png";
import styles from "../../../stylesheets/login.module.css";

const Brands = () => {
  return (
    <>
      <section className={styles.loginBrands}>
        {/* <img
          src={
            require(`../../../assets/Images/${process.env.REACT_APP_LOGO}`)
              .default
          }
          className="mr1 sq75 objfit-contain"
        /> */}
        {/* <img src={fava} className="mr1 sq75 objfit-contain" /> */}
        <img src={province} className="mr1 sq75 objfit-contain" />
        {process.env.REACT_APP_MUNICIPALITY_LOGO && (
          <img
            src={
              require(`../../../assets/Images/${process.env.REACT_APP_MUNICIPALITY_LOGO}`)
                .default
            }
            className="mr1 sq75 objfit-contain"
          />
        )}
      </section>
    </>
  );
};

export default Brands;
