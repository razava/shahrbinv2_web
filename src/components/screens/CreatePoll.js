import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { PollAPI } from "../../apiCalls";
import {
  constants,
  getFromLocalStorage,
  initialSteps,
  pollTypes,
} from "../../helperFuncs";
import Button from "../helpers/Button";
import EditorContainer from "../helpers/EditorContainer";
import Loader from "../helpers/Loader";
import useMakeRequest from "../hooks/useMakeRequest";
import styles from "../../stylesheets/polls.module.css";
import { useHistory, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { AppStore } from "../../store/AppContext";

const CreatePoll = ({ onPollCreated = (f) => f, pollData }) => {
  const [store] = useContext(AppStore);

  const [currentStep, setCurrentStep] = useState(0);
  const [pollTitle, setPollTitle] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollAnswers, setPollAnswers] = useState([]);
  const [pollId, setPollId] = useState(null);
  const [pollType, setPollType] = useState(0);
  const [tempContent, setTempContent] = useState("");
  const [editor, setEditor] = useState(false);
  const [input, setInput] = useState(false);
  const [radio, setRadio] = useState(false);
  const [button, setButton] = useState(false);
  const [payload, setPayload] = useState(undefined);
  const [publishRequest, setPublishRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState({ id: null, bool: false });
  const [steps, setSteps] = useState(initialSteps);
  const [mode, setMode] = useState("create");

  useEffect(() => {
    if (pollData) {
      setMode("edit");
      initializePoll(pollData);
    } else {
      setSteps([
        {
          id: 1,
          title: "نوع نظرسنجی را انتخاب نمایید.",
          type: "radio",
          finished: false,
          role: "",
          writable: true,
        },
        {
          id: 2,
          title: "عنوان نظر سنجی را وارد نمایید.",
          type: "input",
          finished: false,
          role: "",
          writable: true,
        },
        {
          id: 3,
          title: "سوال نظرسنجی را اینجا وارد نمایید.",
          type: "editor",
          finished: false,
          role: "question",
          writable: true,
        },
        {
          id: 4,
          title: "گزینه نظرسنجی را اینجا وارد نمایید.",
          type: "editor",
          finished: false,
          role: "answer",
          writable: true,
          shortTitle: "",
        },
      ]);
      setMode("create");
    }
  }, []);

  const initializePoll = (data) => {
    const steps = [
      {
        id: 1,
        title: "نوع نظرسنجی را انتخاب نمایید.",
        type: "radio",
        finished: false,
        role: "",
        writable: true,
      },
      {
        id: 2,
        title: "عنوان نظر سنجی را وارد نمایید.",
        type: "input",
        finished: true,
        role: "",
        writable: false,
      },
    ];
    steps.push({
      id: 3,
      title: "سوال نظرسنجی را اینجا وارد نمایید.",
      type: "editor",
      finished: true,
      role: "question",
      writable: false,
    });
    data.choices.map((choice, i) => {
      steps.push({
        id: i + 4,
        title: "گزینه نظرسنجی را اینجا وارد نمایید.",
        type: "editor",
        finished: true,
        role: "answer",
        writable: false,
        shortTitle: choice.shortTitle,
      });
    });
    steps.push(
      {
        id: steps.length + 1,
        title: "گزینه نظرسنجی را اینجا وارد نمایید.",
        type: "editor",
        role: "answer",
        finished: false,
        writable: true,
        shortTitle: "",
      },
      {
        id: steps.length + 2,
        title: "گزینه نظرسنجی را اینجا وارد نمایید.",
        type: "editor",
        role: "answer",
        finished: false,
        writable: true,
        shortTitle: "",
      }
    );
    const answers = data.choices.map((choice) => choice.text);
    setSteps(steps);
    setPollQuestion(data.question);
    setPollAnswers(answers);
    setPollTitle(data.title);
    setPollId(data.id);
    setEditor(true);
    setButton(true);
    setCurrentStep(steps.length - 2);
  };

  const handlePollCreation = (step) => {
    if (steps[step].type === "editor") setEditor(true);
    else if (steps[step].type === "input") setInput(true);
    else if (steps[step].type === "radio") setRadio(true);
    setButton(true);
  };

  const addPoll = (e) => {
    handlePollCreation(currentStep);
  };

  const handleTitleAdd = (e) => {
    setPollTitle(e.target.value);
  };

  const createPoll = (e) => {
    setLoading(true);
    setButton(false);
    const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
    return new Promise((resolve, reject) => {
      PollAPI.createPoll(token, {
        title: pollTitle,
        pollType: parseInt(pollType),
        pollState: 0,
      }).then((res) => {
        setLoading(false);
        if (res.status === 201) {
          setPollId(res.data.id);
          resolve(true);
        } else resolve(false);
      });
    });
  };

  const stepForward = () => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === currentStep + 1) {
          step.finished = true;
          step.writable = false;
          if (step.role === "question") {
            setPollQuestion(tempContent);
          } else if (step.role === "answer") {
            setPollAnswers((prev) => [...prev, tempContent]);
          }
          return step;
        } else return step;
      })
    );
    if (currentStep > steps.length - 3) {
      const newSteps = [
        ...steps,
        {
          id: steps.length + 1,
          title: "گزینه نظرسنجی را اینجا وارد نمایید.",
          type: "editor",
          role: "answer",
          finished: false,
          writable: true,
          shortTitle: "",
        },
      ];
      setSteps(newSteps);
    }
    handlePollCreation(currentStep + 1);
  };

  const proceed = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentStep((prev) => prev + 1);
    setInput(false);
    setEditor(false);
    setRadio(false);
    setTempContent("");
    if (currentStep === 1) {
      const isSuccess = await createPoll();
      if (isSuccess) {
        stepForward();
      } else {
        toast("در ساختن نظرسنجی مشکلی پیش آمد. لطفا دوباره امتحان نمایید.", {
          type: "error",
        });
        return;
      }
    } else {
      stepForward();
    }
  };

  const editStep = (id) => (e) => {
    setIsEditing({ id, bool: !isEditing.bool });
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === id) {
          step.writable = isEditing.bool ? false : true;
          return step;
        } else return step;
      })
    );
  };

  const onEditStep = (value, role, id) => {
    if (role === "question") {
      setPollQuestion(value);
    } else if (role === "answer") {
      const newPollAnswers = pollAnswers;
      newPollAnswers[id - 4] = value;
      setPollAnswers(newPollAnswers);
    }
  };

  const onEditShortTitle = (value, id) => {
    setSteps((prev) =>
      prev.map((step, i) => {
        if (id - 1 === i) {
          step.shortTitle = value;
          return step;
        } else return step;
      })
    );
  };

  const publishPoll = (e) => {
    const choices = pollAnswers.map((pollAnswer, i) => {
      return {
        text: pollAnswer,
        shortTitle: steps[i + 3].shortTitle,
        order: i,
      };
    });
    const payload = {
      id: pollId,
      question: pollQuestion,
      choices,
    };
    setPayload(payload);
    setPublishRequest(true);
  };

  const handleShortTitleChange = (e) => {
    setSteps((prev) =>
      prev.map((step, i) => {
        if (i === currentStep) {
          step.shortTitle = e.target.value;
          return step;
        } else return step;
      })
    );
  };

  const [, publishLoading] = useMakeRequest(
    PollAPI.publishPoll,
    204,
    publishRequest,
    payload,
    (res) => {
      setPublishRequest(false);
      if (res.status === 204) {
        toast("نظرسنجی با موفقیت ایجاد شد.", { type: "success" });
        onPollCreated();
      }
    },
    pollId
  );
  return (
    <>
      {(loading || publishLoading) && <Loader />}
      <div className="w100 mx-a px-4 frc" style={{height: window.innerHeight * 0.2}}>
        {mode === "create" && (
          <Button
            title="ایجاد نظرسنجی"
            onClick={addPoll}
            className="rw2 br2 mx1"
            outline={!store.darkMode}
          />
        )}
        <Button
          disabled={currentStep <= 3}
          title="انتشار نظرسنجی"
          onClick={publishPoll}
          className="rw2 br2 mx1"
          outline={!store.darkMode}
        />
      </div>
      <div className="w100 mx-a px-4 of-auto-y scrollbar" style={{height: window.innerHeight * 0.8}}>
        {steps
          .filter((step) => step.finished)
          .map((step, i) => {
            if (step.type === "editor") {
              return (
                <Fragment key={i}>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <EditorContainer
                    isReadOnly={!step.writable}
                    content={
                      step.role === "question"
                        ? pollQuestion
                        : step.role === "answer"
                        ? pollAnswers[step.id - 4]
                        : ""
                    }
                    setContent={(value) =>
                      onEditStep(value, step.role, step.id)
                    }
                  />
                  {step.role === "answer" && (
                    <input
                      type="text"
                      value={step.shortTitle}
                      onChange={(e) =>
                        onEditShortTitle(e.target.value, step.id)
                      }
                      readOnly={!step.writable}
                      className={[styles.input, "my-2"].join(" ")}
                      placeholder="عنوان کوتاه گزینه"
                    />
                  )}
                  <Button className="my-1" onClick={editStep(step.id)}>
                    {isEditing.bool && isEditing.id === step.id
                      ? "تایید"
                      : "ویرایش"}
                  </Button>
                </Fragment>
              );
            } else if (step.type === "input") {
              return (
                <>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <input
                    type="text"
                    className={styles.input}
                    readOnly={true}
                    value={pollTitle}
                  />
                </>
              );
            }
          })}
        {editor && (
          <>
            <div className={styles.stepTitle}>{steps[currentStep].title}</div>
            <EditorContainer
              content={tempContent}
              setContent={setTempContent}
              pollId={pollId}
            />
            {steps[currentStep].role === "answer" && (
              <input
                type="text"
                value={steps[currentStep].shortTitle}
                onChange={handleShortTitleChange}
                className={[styles.input, "my-2"].join(" ")}
                placeholder="عنوان کوتاه گزینه"
              />
            )}
          </>
        )}
        {input && (
          <>
            <div className={styles.stepTitle}>{steps[currentStep].title}</div>
            <input
              type="text"
              className={styles.input}
              onChange={handleTitleAdd}
            />
          </>
        )}
        {radio && (
          <>
            <div className={styles.stepTitle}>{steps[currentStep].title}</div>
            {pollTypes.map((pollType, i) => (
              <div className="pollRadio" key={i}>
                <input
                  type="radio"
                  name="pollType"
                  id={pollType.id}
                  value={pollType.id}
                  onChange={(e) => setPollType(e.target.value)}
                />
                <label htmlFor={pollType.id} className="pollRadioLabel">
                  {pollType.label}
                </label>
              </div>
            ))}
          </>
        )}
        {button && (
          <form onSubmit={proceed}>
            <Button
              type="submit"
              title="تایید"
              className="my-1"
              onClick={proceed}
            />
          </form>
        )}
      </div>
    </>
  );
};

export default CreatePoll;
