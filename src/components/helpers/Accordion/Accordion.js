import React, { useState } from "react";
import styles from "./style.module.css";

const Accordion = ({
  wrapperClassName = "",
  itemClassName = "",
  titleWrapperClassName = "",
  titleClassName = "",
  contentClassName = "",
  data = [],
}) => {
  const [isActive, setIsActive] = useState(1);

  const onItemClick = (item, index) => {
    setIsActive(isActive === index ? null : index);
  };
  return (
    <>
      <section
        className={[styles.accordionWrapper, wrapperClassName].join(" ")}
      >
        {data.map((d, i) => (
          <AccordionItem
            item={d}
            itemClassName={itemClassName}
            titleClassName={titleClassName}
            titleWrapperClassName={titleWrapperClassName}
            contentClassName={contentClassName}
            isActive={isActive === i + 1}
            onClick={onItemClick}
            index={i + 1}
          />
        ))}
      </section>
    </>
  );
};

export default Accordion;

const AccordionItem = ({
  item = {},
  itemClassName,
  titleClassName,
  titleWrapperClassName,
  contentClassName,
  isActive,
  onClick = (f) => f,
  index,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick(item, index);
  };
  return (
    <article className={[styles.accordionItem, itemClassName].join(" ")}>
      <h1
        className={[styles.accordionItemTitle, titleWrapperClassName].join(" ")}
        onClick={handleClick}
      >
        <span className={titleClassName}>{item.title}</span>
        {isActive ? (
          <span key={"accordion-minus"}>
            <i className="fas fa-minus"></i>
          </span>
        ) : (
          <span key={"accordion-plus"}>
            <i className="fas fa-plus"></i>
          </span>
        )}
      </h1>
      {
        <div
          className={[
            styles.itemContent,
            isActive ? styles.active : "",
            contentClassName,
          ].join(" ")}
        >
          {item.content}
        </div>
      }
    </article>
  );
};
