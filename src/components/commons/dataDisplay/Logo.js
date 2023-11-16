import React from "react";

const style = {
  width: "auto",
  height: "50px",
};

const Logo = () => {
  return (
    <>
      <img
        src={
          require(`../../../assets/Images/${process.env.REACT_APP_LOGO}`)
            .default
        }
        style={style}
      />
    </>
  );
};

export default Logo;
