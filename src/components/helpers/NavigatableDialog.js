import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Portal } from "react-portal";
import styles from "../../stylesheets/dialog.module.css";
import Loader from "./Loader";
import useClick from "../hooks/useClick";
import useAddLisener from "../hooks/useAddLisener";
import { AppStore } from "../../store/AppContext";

const modalRoot = document && document.getElementById("modal-root");
const pageRoot = document && document.getElementById("content");
const Toastify = document && document.querySelector("Toastify");
const multiSelectWrapper =
  document && document.getElementById("modal-selectlist");

const NavigatableDialog = ({
  condition,
  setCondition,
  data,
  width = 400,
  height,
  isUnique = true,
  loading = false,
  outSideClick = true,
  fixedDimension = true,
  list = [],
  childProps,
  Child,
  id = "",
}) => {
  const [store, dispatch] = useContext(AppStore);

  const dialogRef = useRef(null);
  const dataRef = useRef(null);
  const isOnTopRef = useRef(null);
  const modalLengthRef = useRef(null);

  const [isShowing, setIsShowing] = useState("d-none");
  const [currentData, setCurrentData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOnTop, setIsInTop] = useState(false);

  useEffect(() => {
    if (condition) {
      handleData();
      showDialog();
    } else {
      hideDialog();
    }
  }, [condition]);

  const [isClicked, setIsClicked] = useClick(dialogRef, "click", [
    // {
    //   current: multiSelectWrapper,
    // },
    {
      current: Toastify,
    },
  ]);

  const addClassNames = () => {
    pageRoot.classList.add("modal");
    document.body.style.overflowY = "hidden";
  };

  const removeClassNames = () => {
    pageRoot.classList.remove("modal");
    document.body.style.overflowY = "auto";
  };

  const handleData = () => {
    setCurrentData(data);
    const currentIndex = list.findIndex((d) => d.id === data.id);
    setCurrentIndex(currentIndex + 1);
    dataRef.current = data;
  };

  const showDialog = () => {
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

  const hideDialog = () => {
    setIsShowing("hide");
    removeClassNames();
    setTimeout(() => {
      setIsShowing("d-none");
      modalRoot.classList.remove("active");
    }, 50);
    const newModals = store.modals.filter((m) => m.id !== id);
    dispatch({
      type: "setModals",
      payload: newModals,
    });
  };

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
          if (modalRoot.children.length === 1) {
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
        removeClassNames();
        modalRoot.classList.remove("active");
        setIsShowing("d-none");
      }
    }
  };

  const onRightKey = (e, refer = false) => {
    if (e) e.stopPropagation();

    const currentIndex = list.findIndex((d) => d.id === dataRef.current?.id);
    const nextIndex = currentIndex + 1;
    const next = list[nextIndex];
    if (!next) closeDialog();
    setCurrentData(next);
    if (!refer) setCurrentIndex(nextIndex + 1);
    dataRef.current = next;
  };

  const onLeftKey = (e) => {
    if (e) e.stopPropagation();

    const currentIndex = list.findIndex((d) => d.id === dataRef.current?.id);
    const prevIndex = currentIndex - 1;
    const prev = list[prevIndex];
    if (!prev) closeDialog();
    setCurrentData(prev);
    setCurrentIndex(prevIndex + 1);
    dataRef.current = prev;
  };

  useAddLisener({
    ref: "window",
    listenTo: "keydown",
    condition: condition,
    callback: (ref, event) => {
      if (event.type === "keydown" && event.keyCode === 27) onEscape();
      if (event.type === "keydown" && event.keyCode === 39) onRightKey(event);
      if (event.type === "keydown" && event.keyCode === 37) onLeftKey(event);
    },
  });

  const container = fixedDimension
    ? {
        maxWidth: width + "px",
        width: "100%",
        maxHeight: height ? height + "px" : "auto",
        height: height ? "100%" : "auto",
      }
    : {};

  const createContent = () => {
    return (
      <div className={styles.dialog}>
        <div
          className={styles.nextBtn}
          onClick={(e) => {
            e.stopPropagation();
            onRightKey();
          }}
        >
          <i className="fas fa-angle-right"></i>
        </div>
        <div className={styles.prevBtn} onClick={onLeftKey}>
          <i className="fas fa-angle-left"></i>
        </div>
        <div className={styles.index}>
          <span className="text-white">
            {list.length} / {currentIndex}
          </span>
        </div>
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
          <Child
            {...childProps}
            childData={currentData}
            onNext={onRightKey}
            onPrev={onLeftKey}
          />
        </div>
      </div>
    );
  };

  return isUnique
    ? condition && <Portal node={modalRoot}>{createContent()}</Portal>
    : condition && <Portal node={modalRoot}>{createContent()}</Portal>;
};

NavigatableDialog.propTypes = {
  condition: PropTypes.bool,
  setCondition: PropTypes.func,
  children: PropTypes.instanceOf(Object),
  width: PropTypes.number,
  height: PropTypes.number,
};

export default React.memo(NavigatableDialog);
