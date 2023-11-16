import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LazyLoadWrapper = ({ image }) => (
  <>
    <LazyLoadImage
      effect="blur"
      alt={image.alt ? image.alt : ""}
      height={image.height && image.height}
      width={image.width && image.width}
      style={image.style}
      className={image.className}      
      src={image.src} // use normal <img> attributes as props
    />
  </>
);

export default LazyLoadWrapper;
