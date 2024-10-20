import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Icon from "../Icon/Icon";

const defaultStars = [
  { id: 1, hover: false, active: false, order: 1 },
  { id: 2, hover: false, active: false, order: 2 },
  { id: 3, hover: false, active: false, order: 3 },
  { id: 4, hover: false, active: false, order: 4 },
  { id: 5, hover: false, active: false, order: 5 },
];

const Rating = ({
  onChange = () => {},
  value = 0,
  defaultValue = 0,
  name = "",
  size = 5,
}) => {
  // Hook ها باید بدون شرط اجرا شوند
  const [stars, setStars] = useState(
    defaultStars.map((s) => ({
      ...s,
      active: value >= s.order,
    }))
  );
  const [rating, setRating] = useState(defaultValue);

  // به‌روزرسانی ستاره‌ها بر اساس مقدار جدید
  useEffect(() => {
    setStars(
      defaultStars.map((s) => ({
        ...s,
        active: value >= s.order,
      }))
    );
  }, [value]);

  // اگر مقدار نال باشد، بجای null، علامت --- نشان دهیم
  if (value === null) {
    return <div className={styles.emptyRating}>---</div>;
  }

  // توابع مربوط به تعامل با ستاره‌ها
  const onMouseEnter = (star) => {
    const index = stars.indexOf(star);
    setStars(
      stars.map((s, i) => ({
        ...s,
        hover: i <= index,
      }))
    );
  };

  const onMouseLeave = () => {
    setStars(
      stars.map((s) => ({
        ...s,
        hover: false,
      }))
    );
  };

  const onClick = (star) => {
    const index = stars.indexOf(star);
    setRating(index + 1);
    onChange(index + 1, name);
    setStars(
      stars.map((s, i) => ({
        ...s,
        active: i <= index,
      }))
    );
  };

  return (
    <div className={styles.stars} onMouseLeave={onMouseLeave}>
      {stars.map((star) => (
        <span
          key={star.id}
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
  );
};

export default Rating;
