import React, { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";
import styles from "./styles.module.css";

const Signature = ({ label = "" }) => {
  //   refs
  const canvasRef = useRef(null);

  //   variables
  const canvasHeight = 300;

  //   states
  const [signatureD, setSignatureD] = useState(false);
  const [context, setContext] = useState(undefined);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPainting, setIsPainting] = useState(false);
  const [start, setStart] = useState({ x: undefined, y: undefined });

  //   functions
  const handleOnMouseDown = (e) => {
    setIsPainting(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  const handleOnMouseUp = (e) => {
    setIsPainting(false);
    context.stroke();
    context.beginPath();
  };

  const handleOnMouseMove = (e) => {
    if (!isPainting) return;
    context.lineWidth = 3;
    context.lineCap = "round";

    context.lineTo(e.clientX - canvasOffset.x, e.clientY - canvasOffset.y -20);
    context.stroke();
  };

  const closeDialog = () => {
    setSignatureD(false);
    setIsPainting(false);
  };

  const onRemoveClick = () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  const onConfirmClick = () => {
    // TODO: fetch the signature
    setSignatureD(false);
  };

  //   effects
  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current?.getContext("2d");
      const canvasWidth = canvasRef.current?.parentElement?.offsetWidth;
      const canvasOffsetX = canvasRef.current?.parentElement?.offsetLeft;
      const canvasOffsetY = canvasRef.current?.parentElement?.offsetTop;
      setCanvasWidth(canvasWidth);
      setCanvasOffset({ x: canvasOffsetX, y: canvasOffsetY });
      setContext(context);
    }
  }, [canvasRef.current]);
  return (
    <>
      <section>
        <span className={styles.label}>{label}</span>
        <Button onClick={() => setSignatureD(true)}>ایجاد امضا</Button>
      </section>

      <Dialog
        visible={signatureD}
        onClose={closeDialog}
        id="signature"
        classNames={{ container: styles.signatureD }}
        title="امضا"
        buttons={[
          {
            id: "signature-btn-2",
            title: "پاک کردن",
            onClick: onRemoveClick,
            type: "error",
          },
          {
            id: "signature-btn-1",
            title: "تایید",
            onClick: onConfirmClick,
            type: "primary",
          },
        ]}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={300}
          className={styles.canvas}
          onMouseDown={handleOnMouseDown}
          onMouseUp={handleOnMouseUp}
          onMouseMove={handleOnMouseMove}
        ></canvas>
      </Dialog>
    </>
  );
};

export default Signature;
