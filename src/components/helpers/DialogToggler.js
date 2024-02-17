import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styles from "../../stylesheets/dialog.module.css";
import Loader from "./Loader";
import useClick from "../hooks/useClick";
import useAddLisener from "../hooks/useAddLisener";
import { AppStore } from "../../store/AppContext";

const modalRoot = document && document.getElementById("modal-root");
const multiSelectWrapper =
  document && document.getElementById("modal-selectlist");
const Toastify = document && document.querySelector("Toastify");

const DialogToggler = ({
  condition,
  setCondition,
  dialogId,
  data = {},
  width = 400,
  height,
  fixHeight,
  children,
  isUnique = true,
  loading = false,
  outSideClick = true,
  fixedDimension = true,
  outSideClickEvent = "click",
  id = "",
}) => {
  const [store, dispatch] = useContext(AppStore);
  const pageRoot = document && document.getElementById("content");
  console.log(loading);
  const dialogRef = useRef(null);
  const isOnTopRef = useRef(null);
  const modalLengthRef = useRef(null);

  const [isShowing, setIsShowing] = useState("d-none");
  const [isOnTop, setIsInTop] = useState(false);

  const addClassNames = () => {
    pageRoot.classList.add("modal");
    document.body.style.overflowY = "hidden";
  };

  const removeClassNames = () => {
    pageRoot.classList.remove("modal");
    document.body.style.overflowY = "auto";
  };

  useEffect(() => {
    if (condition) {
      openModal();
    } else {
      closeModal();
    }
  }, [condition]);

  const openModal = () => {
    modalRoot.classList.add("active");
    setIsClicked(true);
    setIsShowing("fcs");
    addClassNames();
    setTimeout(() => {
      setIsShowing("fcs slidein");
    }, 50);
    dispatch({
      type: "setModals",
      payload: [...store.modals, { id, index: store.modals.length + 1 }],
    });
  };

  const closeModal = () => {
    if (isOnTop) {
      removeClassNames();
    }
    setIsShowing("hide");
    setTimeout(() => {
      setIsShowing("d-none");
    }, 50);
    const newModals = store.modals.filter((m) => m.id !== id);
    dispatch({
      type: "setModals",
      payload: newModals,
    });
  };

  const [isClicked, setIsClicked] = useClick(dialogRef, outSideClickEvent, [
    { current: multiSelectWrapper },
    { current: Toastify },
  ]);

  const closeDialog = () => {
    if (modalRoot.children.length === 2) {
      modalRoot.classList.remove("active");
    }
    setCondition(false);
  };

  useEffect(() => {
    if (outSideClick) {
      if (isClicked) {
        modalRoot.classList.add("active");
        setCondition(true);
      } else {
        if (isOnTop) {
          setCondition(false);
          if (store.modals.length === 1) {
            modalRoot.classList.remove("active");
          }
        }
      }
    }
  }, [isClicked]);

  useEffect(() => {
    const isOnTop =
      store.modals.find((m) => m.id === id)?.index === store.modals.length;
    setIsInTop(isOnTop);
    setIsClicked(isOnTop);
    isOnTopRef.current = isOnTop;
    modalLengthRef.current = store.modals.length;
  }, [store.modals]);

  const onEscape = () => {
    if (isOnTopRef.current) {
      setCondition(false);
      if (modalLengthRef.current === 1) {
        setIsShowing("hide");
        if (!isOnTopRef.current) {
          removeClassNames();
        }
        modalRoot.classList.remove("active");
        setIsShowing("d-none");
      }
    }
  };

  useAddLisener({
    ref: "window",
    listenTo: "keydown",
    condition: true,
    callback: (ref, event) => {
      if (event.type === "keydown" && event.keyCode === 27) onEscape(event);
    },
  });

  const container = fixedDimension
    ? {
        maxWidth: width + "px",
        width: "100%",
        maxHeight: height ? height + "px" : "auto",
        height: height ? "100%" : fixHeight ? fixHeight : "auto",
      }
    : {};

  const renderContent = () => {
    return (
      <div className={styles.dialog}>
        <div
          className={[styles.dialogContainer, isShowing].join(" ")}
          style={container}
          ref={dialogRef}
        >
          {loading && <Loader absolute={true} />}
          <div className={styles.dialogClose}>
            <span className={styles.dialogCloseIcon} onClick={closeDialog}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className={styles.dialogContent}>{children}</div>
        </div>
      </div>
    );
  };

  return isUnique
    ? condition &&
        dialogId === data.id &&
        ReactDOM.createPortal(renderContent(), modalRoot)
    : condition && ReactDOM.createPortal(renderContent(), modalRoot);
};

DialogToggler.propTypes = {
  condition: PropTypes.bool,
  setCondition: PropTypes.func,
  children: PropTypes.instanceOf(Object),
  width: PropTypes.number,
  height: PropTypes.number,
};

export default React.memo(DialogToggler);
