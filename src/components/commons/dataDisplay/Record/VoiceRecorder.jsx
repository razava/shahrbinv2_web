import React, { useEffect } from "react";
import AudioTimer from "./AudioTimer";
import { ReactMic } from "react-mic";
import Button from "../../../helpers/Button";
import { useMutation } from "@tanstack/react-query";
import { postFiles } from "../../../../api/commonApi";
import { toast } from "react-toastify";

const VoiceRecorder = ({ addRecord, removeRecord }) => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [voice, setVoice] = React.useState(false);
  const [recordBlobLink, setRecordBlobLink] = React.useState(null);
  const [recordFile, setRecordFile] = React.useState(null);

  const uploadMutation = useMutation({
    mutationKey: ["File"],
    mutationFn: postFiles,
    onSuccess: (res) => {
      addRecord(res, "voice");
    },
    onError: (err) => {},
  });

  const onStop = (recordedBlob) => {
    console.log(recordedBlob);
    const recordedFile = new File([recordedBlob], "recording.weba", {
      type: "video/weba",
    });
    console.log(recordedFile);
    setRecordFile(recordedFile);
    setRecordBlobLink(recordedBlob.blobURL);
    setIsRunning(false);
  };

  const startHandle = () => {
    setElapsedTime(0);
    setIsRunning(true);
    setVoice(true);
  };
  const stopHandle = () => {
    setIsRunning(false);
    setVoice(false);
  };

  const clearHandle = () => {
    setIsRunning(false);
    setVoice(false);
    setRecordBlobLink(false);
    setElapsedTime(0);
    localStorage.removeItem("myVoice");
    removeRecord("voice");
  };
  console.log(voice);
  const onData = (recordedBlob) => {
    console.log(recordedBlob);
  };

  const uploadVoice = () => {
    localStorage.setItem("myVoice", recordBlobLink);
    const formData = new FormData();
    formData.append("File", recordFile);
    formData.append("AttachmentType", 0);
    uploadMutation.mutate(formData);
  };

  useEffect(() => {
    if (localStorage.getItem("myVoice")) {
      setRecordBlobLink(localStorage.getItem("myVoice"));
    }
  }, []);

  return (
    <div>
      <div className="  py-1 px-6 mx-auto bg-white  ">
        <AudioTimer
          isRunning={isRunning}
          elapsedTime={elapsedTime}
          setElapsedTime={setElapsedTime}
        />

        <ReactMic
          record={voice}
          className="sound-wave w-full hidden "
          onStop={onStop}
          onData={onData}
          strokeColor="#000000"
          // backgroundColor="#FF4081"
        />
        <div className=" flex gap-5 items-center justify-center mt-2">
          {recordBlobLink ? (
            <Button
              outline
              onClick={clearHandle}
              className=" font-medium text-[16px] w-40 h-16"
            >
              پاک کردن
            </Button>
          ) : (
            ""
          )}
          <div className=" ">
            {!voice ? (
              <Button
                outline
                onClick={startHandle}
                className=" rounded-md w-40 h-16 text-[16px] "
              >
                شروع
              </Button>
            ) : (
              <></>
            )}
          </div>{" "}
          <Button
            outline
            onClick={stopHandle}
            className=" rounded-md w-40 h-16 text-[16px] flex items-center gap-2 "
          >
            {/* <span>
              <i class="fas fa-stop"></i>
            </span> */}
            <span>توقف</span>
          </Button>
        </div>
        <div className="w-full">
          {recordBlobLink ? (
            <audio controls src={recordBlobLink} className="mt-6 w-full" />
          ) : (
            ""
          )}
        </div>
        {recordBlobLink && (
          <Button
            title="تایید"
            loading={uploadMutation.isLoading}
            className="py1 br05 bg-primary text-white w-full mt-10 !mb-0"
            onClick={uploadVoice}
            //   loading={createLoading}
          />
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
