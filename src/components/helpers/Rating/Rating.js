import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Icon from "../Icon/Icon";

const defaultStars = [
  {
    id: 1,
    hover: false,
    active: false,
    order: 1,
  },
  {
    id: 2,
    hover: false,
    active: false,
    order: 2,
  },
  {
    id: 3,
    hover: false,
    active: false,
    order: 3,
  },
  {
    id: 4,
    hover: false,
    active: false,
    order: 4,
  },
  {
    id: 5,
    hover: false,
    active: false,
    order: 5,
  },
];

const Rating = ({
  onChange = (f) => f,
  value,
  defaultValue,
  name = "",
  size = 5,
}) => {
  console.log(value);
  // states
  const [stars, setStars] = useState(
    defaultStars.map((s, i) =>
      value < s.order ? { ...s, active: false } : { ...s, active: true }
    )
  );
  const [rating, setRating] = useState(0);
  console.log(value);
  useEffect(() => {
    if (defaultValue) {
      setStars(
        defaultStars.map((s, i) =>
          value < s.order ? { ...s, active: false } : { ...s, active: true }
        )
      );
    }
  }, [value]);
  // functions
  const onMouseEnter = (star) => {
    const index = stars.indexOf(star);
    const modifiedStars = stars.map((star, i) => {
      if (i <= index) {
        star.hover = true;
        return star;
      } else {
        star.hover = false;
        return star;
      }
    });
    setStars(modifiedStars);
  };

  const onMouseLeave = () => {
    setStars((prev) =>
      prev.map((star) => {
        star.hover = false;
        return star;
      })
    );
  };

  const onClick = (star) => {
    const index = stars.indexOf(star);
    setRating(index + 1);
    onChange(index + 1, name);
    const modifiedStars = stars.map((star, i) => {
      if (i <= index) {
        star.active = true;
        return star;
      } else {
        star.active = false;
        return star;
      }
    });
    setStars(modifiedStars);
  };
  return (
    <>
      <div className={styles.stars} onMouseLeave={onMouseLeave}>
        {stars.map((star, i) => (
          <span
            key={i}
            className={[
              styles.star,
              star.hover ? styles.hover : "",
              star.active ? styles.active : "",
              "frc",
            ].join(" ")}
            style={{
              width: size * 6,
              height: size * 6,
              margin: `0 ${size}px`,
            }}
            onMouseEnter={() => onMouseEnter(star)}
            onClick={() => onClick(star)}
          >
            <Icon icon="fas fa-star" size={size} />
          </span>
        ))}
      </div>
    </>
  );
};

export default Rating;
