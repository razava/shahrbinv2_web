import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { AppStore } from "../../formStore/store";
import { cn } from "../../utils/functions";
import { appActions } from "../../utils/constants";
import Button from "../Button/Button";
import styles from "./dialog.module.css";

const toast = document.querySelector(".Toastify");

const whiteList = [toast];

const Dialog = ({
  node = document.getElementById("modal"),
  children,
  title = "",
  visible = false,
  onClose = (f) => f,
  classNames = { container: "", header: "", closeButton: "" },
  id = "",
  buttons = [],
}) => {
  // store
  const [store, dispatch] = useContext(AppStore);

  // refrences
  const modalRef = useRef(null);
  const isOnTopRef = useRef(null);
  const modalLengthRef = useRef(null);

  //   states
  const [visibility, setVisibility] = useState(visible);
  const [isOnTop, setIsInTop] = useState(false);

  // styles
  const containerClassName = [
    styles.container,
    visibility ? styles.visible : styles.notVisible,
    isOnTop ? styles.onTop : "",
    classNames.container,
  ].join(" ");
  const headerClassName = [styles.header, classNames.header].join(" ");
  const closeButtonClassName = [
    styles.closeButton,
    classNames.closeButton,
  ].join(" ");

  // functions
  const addClassNames = () => {
    node.classList.add("active");
    document.body.classList.add("modal");
  };

  const removeClassNames = () => {
    node.classList.remove("active");
    document.body.classList.remove("modal");
  };

  const addModal = () => {
    const exists = store.modals.findIndex((m) => m.id === id) !== -1;
    if (exists) return;
    dispatch({
      type: appActions.SET_MODALS,
      payload: [...store.modals, { id, index: store.modals.length + 1 }],
    });
  };

  const removeModal = () => {
    const newModals = store.modals.filter((m) => m.id !== id);
    dispatch({
      type: appActions.SET_MODALS,
      payload: newModals,
    });
  };

  const handleModalClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      const shouldClose = !whiteList.some((w) => w?.contains(e.target));
      if (shouldClose) handleClose();
    }
  };

  const handleModalKeyDown = (e) => {
    if (e.type === "keydown" && e.keyCode === 27) {
      handleClose();
    }
  };

  const onDialogTransitionEnd = (e) => {
    // if (e.propertyName === "transform") {
    if (!visibility) {
      handleClose();
      onClose();
    }
    // }
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    if (isOnTopRef.current) {
      if (store.modals.length === 1) {
        setVisibility(false);
        removeModal();
        removeClassNames();
      } else {
        setVisibility(false);
        removeModal();
      }
    }
  };

  //   effects
  useEffect(() => {
    setVisibility(visible);
    if (visible) {
      addClassNames();
      addModal();
    } else {
      handleClose();
    }
  }, [visible]);

  useEffect(() => {
    const isOnTop =
      store.modals.find((m) => m.id === id)?.index === store.modals.length;
    setIsInTop(isOnTop);
    isOnTopRef.current = isOnTop;
    modalLengthRef.current = store.modals.length;
  }, [store.modals]);

  useEffect(() => {
    if (!!node && visibility) {
      window.addEventListener("click", handleModalClick);
      window.addEventListener("keydown", handleModalKeyDown);
    }

    return () => {
      window.removeEventListener("click", handleModalClick);
      window.removeEventListener("keydown", handleModalKeyDown);
    };
  }, [node, visibility]);

  // renders
  const renderDialogContent = () =>
    visible ? (
      <>
        <section
          className={containerClassName}
          ref={modalRef}
          onTransitionEnd={onDialogTransitionEnd}
        >
          {renderDialogHeader()}
          {children}
          {renderDialogButtons()}
        </section>
      </>
    ) : null;

  const renderDialogButtons = () => {
    return buttons.length > 0 ? (
      <div className={styles.buttons}>
        {buttons.map((button) => (
          <Button
            key={button.id}
            {...button}
            className={cn(styles.button, styles[button.type])}
          >
            {button.title}
          </Button>
        ))}
      </div>
    ) : null;
  };

  const renderDialogHeader = () =>
    title ? (
      <>
        <div className={headerClassName}>
          <h1 className="">{title}</h1>
          <span className={closeButtonClassName} onClick={handleClose}>
            <i className={"fas fa-times"}></i>
          </span>
        </div>
      </>
    ) : null;

  //   varibales
  return (
    <>{node && ReactDOM.createPortal(renderDialogContent(visibility), node)}</>
  );
};

export default Dialog;
