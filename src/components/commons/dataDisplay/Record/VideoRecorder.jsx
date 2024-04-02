// import "./styles.css";
import { useReactMediaRecorder } from "react-media-recorder";
import VideoRecorder from "react-video-recorder";
import {
  RecordWebcam,
  useRecordWebcam,
  CAMERA_STATUS,
} from "react-record-webcam";
import { useEffect, useState } from "react";
import Button from "../../../helpers/Button";
import Loader from "../../../helpers/Loader";
import { postFiles } from "../../../../api/commonApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
const OPTIONS = {
  filename: "test-filename",
  fileType: "video/mp4",
  width: 1920,
  height: 1080,
};

export default function App({ addRecord, removeRecord }) {
  const [video, setVideo] = useState();

  const recordWebcam = useRecordWebcam(OPTIONS);
  console.log(recordWebcam);
  const getRecordingFileHooks = async () => {
    const blob = await recordWebcam.getRecording();
    const blobUrl = URL.createObjectURL(blob);

    setVideo(blobUrl);
    localStorage.setItem("myVideo", blobUrl);
    console.log(blobUrl);
    console.log({ blob });
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    blob.lastModifiedDate = new Date();
    blob.name = OPTIONS.filename;
    console.log(blob);
    const myFile = new File([blob], "Sh-Record.mp4", { type: "video/mp4" });
    console.log(myFile);
    const formData = new FormData();
    formData.append("File", myFile);
    formData.append("AttachmentType", 0);
    uploadMutation.mutate(formData);
    return blob;
  };

  const getRecordingFileRenderProp = async (blob) => {
    console.log({ blob });
  };
  useEffect(() => {
    recordWebcam.open();
  }, []);

  const uploadMutation = useMutation({
    mutationKey: ["File"],
    mutationFn: postFiles,
    onSuccess: (res) => {
      toast("ویدیو شما با موفقیت بارگذاری شد", { type: "success" });
      addRecord(res, "video");
    },
    onError: (err) => {},
  });

  console.log(video);

  useEffect(() => {
    if (localStorage.getItem("myVideo")) {
      setVideo(localStorage.getItem("myVideo"));
    }
  }, []);

  return (
    <div className=" mt-10">
      {/* <h1>1.react-media-recorder</h1>
      <RecordView />
      <h1>2.react-video-recorder</h1>
      <VideoRecorder
        onRecordingComplete={(videoBlob) => {
          // Do something with the video...
          console.log("videoBlob", videoBlob);
        }}
      /> */}
      <div>
        {/* <button
          disabled={
            recordWebcam.status === CAMERA_STATUS.OPEN ||
            recordWebcam.status === CAMERA_STATUS.RECORDING ||
            recordWebcam.status === CAMERA_STATUS.PREVIEW
          }
          onClick={recordWebcam.open}
        >
          Open camera
        </button> */}
        {/* <button
          disabled={
            recordWebcam.status === CAMERA_STATUS.CLOSED ||
            recordWebcam.status === CAMERA_STATUS.PREVIEW
          }
          onClick={recordWebcam.close}
        >
          Close camera
        </button> */}
        <div className=" flex gap-2 w-full mb-3">
          <Button
            title="شروع"
            outline
            onClick={() => {
              recordWebcam.start();
              setVideo();
              localStorage.removeItem("myVideo");
            }}
            disabled={
              recordWebcam.status === CAMERA_STATUS.CLOSED ||
              recordWebcam.status === CAMERA_STATUS.RECORDING ||
              recordWebcam.status === CAMERA_STATUS.PREVIEW ||
              video
            }
            className={` flex-1 ${
              (recordWebcam.status === CAMERA_STATUS.CLOSED ||
                recordWebcam.status === CAMERA_STATUS.RECORDING ||
                recordWebcam.status === CAMERA_STATUS.PREVIEW ||
                video) &&
              "opacity-50"
            }`}
            //   loading={createLoading}
          />
          <Button
            title="توقف"
            outline
            onClick={() => {
              recordWebcam.stop();
              console.log(recordWebcam.previewRef.current);
              //   setVideo(recordWebcam.previewRef.current);
            }}
            disabled={recordWebcam.status !== CAMERA_STATUS.RECORDING}
            className={` flex-1 ${
              recordWebcam.status !== CAMERA_STATUS.RECORDING && "opacity-50"
            }`}
            //   loading={createLoading}
          />
          <Button
            title="دوباره"
            outline
            onClick={() => {
              recordWebcam.retake();
              localStorage.removeItem("myVideo");
              setVideo("");
            }}
            disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW && !video}
            className={` flex-1 ${
              recordWebcam.status !== CAMERA_STATUS.PREVIEW &&
              !video &&
              "opacity-50"
            }`}
            //   loading={createLoading}
          />
        </div>
        {/* <button
          disabled={
            recordWebcam.status === CAMERA_STATUS.CLOSED ||
            recordWebcam.status === CAMERA_STATUS.RECORDING ||
            recordWebcam.status === CAMERA_STATUS.PREVIEW
          }
          onClick={recordWebcam.start}
        >
          Start recording
        </button>
        <button
          disabled={recordWebcam.status !== CAMERA_STATUS.RECORDING}
          onClick={recordWebcam.stop}
        >
          Stop recording
        </button>
        <button
          disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
          onClick={recordWebcam.retake}
        >
          Retake
        </button> */}
        {/* <button
          disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
          onClick={recordWebcam.download}
        >
          Download
        </button> */}
        {/* <button
          disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
          onClick={getRecordingFileHooks}
          
        >
          Get recording
        </button> */}
      </div>
      {!video && (
        <video
          ref={recordWebcam.webcamRef}
          style={{
            display: `${
              recordWebcam.status === CAMERA_STATUS.OPEN ||
              recordWebcam.status === CAMERA_STATUS.RECORDING
                ? "block"
                : "none"
            }`,
          }}
          autoPlay
          muted
          className=" w-full rounded-md"
        />
      )}

      {!video && (
        <video
          className="w-full rounded-md"
          ref={recordWebcam.previewRef}
          style={{
            display: `${
              recordWebcam.status === CAMERA_STATUS.PREVIEW ? "block" : "none"
            }`,
          }}
          controls
        />
      )}

      {video && (
        <video
          src={video}
          className="w-full rounded-md"
          controls
          //   style={{
          //     display: `${
          //       video && recordWebcam.status !== CAMERA_STATUS.PREVIEW && "none"
          //     }`,
          //   }}
        />
      )}
      <Button
        title="حذف"
        // loading={uploadMutation.isLoading}
        className="py1 br05 bg-primary text-white w-full mt-3"
        onClick={() => {
          recordWebcam.retake();
          removeRecord("video");
          localStorage.removeItem("myVideo");
          setVideo("");
        }}
        style={{
          display: `${video ? "block" : "none"}`,
        }}
        //   loading={createLoading}
      />
      <Button
        title="تایید"
        loading={uploadMutation.isLoading}
        className="py1 br05 bg-primary text-white w-full mt-3"
        onClick={getRecordingFileHooks}
        style={{
          display: `${
            recordWebcam.status === CAMERA_STATUS.PREVIEW || video
              ? "block"
              : "none"
          }`,
        }}
        //   loading={createLoading}
      />
    </div>
  );
}
