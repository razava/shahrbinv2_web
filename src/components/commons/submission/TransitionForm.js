import React, { useContext, useEffect, useState } from "react";
import {
  callAPI,
  clearNull,
  constants,
  getFromLocalStorage,
  getUserRoles,
  hasRole,
  mapObjectToFormData,
} from "../../../helperFuncs";
import styles from "../../../stylesheets/reportdialog.module.css";
import Textarea from "../../helpers/Textarea";
import Button from "../../helpers/Button";
import SelectBox from "../../helpers/SelectBox";
import { toast } from "react-toastify";
import { ReportsAPI } from "../../../apiCalls";
import Loader from "../../helpers/Loader";
import MultiSelect from "../../helpers/MultiSelect";
import { AppStore } from "../../../store/AppContext";
import AttachmentToggle from "../dataDisplay/Attachment/AttachmentToggle";
import VideoRecorder from "../dataDisplay/Record/VideoRecorder";
import Modal from "react-responsive-modal";
import VoiceRecorder from "../dataDisplay/Record/VoiceRecorder";
import RadioGroup from "../../../components2/Radio/RadioGroup";

// get logged in user roles
const roles = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_USER_ROLES);

const TransitionForm = ({
  data,
  transition,
  createTransition,
  createLoading = false,
}) => {
  const [store] = useContext(AppStore);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  // data states
  const [referralData, setRefrerralData] = useState({
    // isPublic: 0,
    comment: "",
    reasonId: transition.reasonList[0].id,
    messageToCitizen: "",
  }); // data needed for submit
  const [attachments, setAttachments] = useState([]); // user attachments to be send to selected destination
  const [selectedActors, setSelectedActors] = useState(); // list of users or roles that current user can send this request to.
  const [closeWebcam, setCloseWebcam] = useState(0);
  const [allActors, setAllActors] = useState([]); // list of users or roles that current user can send this request to.

  // other states
  const [defaultActors, setDefaultActors] = useState([]); // list of users that should be preselected.
  const userRoles = getUserRoles();
  const isContractor = hasRole(userRoles, ["Contractor"]);
  // flags
  const [loading, setLoading] = useState(false); // flag used to indicate loader status

  const { comment, reasonId, messageToCitizen } = referralData;

  useEffect(() => {
    // show preselected actors
    handleSelectedActors();
    showActors();
  }, []);

  const handleSelectedActors = () => {
    console.log(transition.actors);
    const selectedActor = transition.actors
      .filter((a) => a.type !== 2)
      .map((a, i) => setActors(a));
    console.log(selectedActor[0]);
    setSelectedActors(selectedActor[0]);
    const actors = transition.actors
      .filter((a) => a.type !== 2)
      .map((a, i) => setActors(a));
    console.log(actors);
    if (actors.length === 1) setDefaultActors(actors[0]);
  };

  const handleChange = (name) => (e) =>
    setRefrerralData({ ...referralData, [name]: e.target.value });
  // func that keep track of changes in form
  const handleActors = (name) => (e) => {
    console.log(e.target.value);
    setSelectedActors(e.target.value);
  }; // func that keep track of changes in form

  const validations = () => {
    // should not send request if no actor has been selected
    if (selectedActors.length === 0) {
      toast("لطفا مقصد ارجاعی را انتخاب نمایید", { type: "error" });
      return false;
    }
    // should not send request if no reason has been selected
    if (!reasonId) {
      toast("لطفا دلیل ارجاع را انتخاب نمایید", { type: "error" });
      return false;
    }

    return true;
  };

  const getReportPayload = () => {
    // get actor ids
    // const actors = selectedActors.map((a, i) => {
    //   return { id: a.value };
    // });
    let payload = new FormData();
    payload = mapObjectToFormData(
      // add form data to payload
      {
        comment,
        reasonId,
        transitionId: transition.transitionId,
        messageToCitizen,
      },
      payload
    );
    // add attachments to payload
    attachments.map((attachment) => {
      payload.append("attachments", attachment.file);
    });
    // add visibility to payload
    // payload.append("visibility", isPublic);
    // add actorIds to payload
    // actors.map((actor, i) => {
    //   payload.append(`actors[${i}].id`, actor.id);
    // });
    console.log(selectedActors);
    return {
      transitionId: transition.transitionId,
      reasonId: reasonId,
      toActorId: selectedActors?.id ? selectedActors?.id : selectedActors,
      attachments: attachments.map((item) => item.id),
      comment: comment,
      id: data.id,
    };
    return payload;
  };

  const setReportPayload = (e) => {
    // check validations
    const isValid = validations();
    if (!isValid) return;

    const payload = getReportPayload();
    // send payload
    createTransition(payload);
  };

  const selectActorLabel = (actor) => {
    // create proper label based on actor type, type 0 => person, type 1 => role, type 2 => auto
    if (actor.type === 0) {
      return actor.title
        ? actor.title
        : actor.firstName || actor.lastName
        ? clearNull(actor.firstName) + " " + clearNull(actor.lastName)
        : actor.phoneNumber
        ? actor.phoneNumber
        : "";
    }
    if (actor.type === 1) {
      return "نقش " + actor.firstName;
    }
  };

  const setActors = (a) => {
    return {
      label: selectActorLabel(a),
      id: a.id,
    };
  };

  const sendMessageToCitizen = () => {
    // function to handle message to citizen request
    const payload = { message: messageToCitizen };
    setLoading(true);
    callAPI(
      {
        caller: ReportsAPI.sendMessageToCitizen,
        successStatus: 200,
        payload,
        successCallback: (res) =>
          toast("پیام شما با موفقیت به شهروند ارسال شد.", { type: "success" }),
        requestEnded: () => setLoading(false),
      },
      data?.id
    );
  };

  const showActors = () => {
    // this function prepare and returns the avaiable actors
    let actors = [];

    transition.actors
      .filter((a) => a.type !== 2)
      .map((a, i) => {
        if (a.type === 1 && a.actors) {
          actors.push(setActors(a));
          a.actors.map((b) => actors.push(setActors(b)));
        } else actors.push(setActors(a));
      });

    setAllActors(actors);
  };

  const onAddAttachment = (attachs) => {
    console.log(attachs);
    setAttachments(attachs);
  };

  const onRemoveRecord = (type) => {
    const newAttachments = attachments.filter((item) => item?.type == "type");
    setAttachments(newAttachments);
  };

  const onAddRecords = (record, type) => {
    setAttachments([...attachments, { id: record.id, type: type }]);
    if (type == "video") setOpen(false);
    if (type == "voice") setOpen2(false);
  };
  const hasVideo = attachments.find((item) => item?.type == "video");
  const hasVoice = attachments.find((item) => item?.type == "voice");
  return (
    <>
      <div className={[styles.infoList, "pb5 mb1"].join(" ")}>
        {/* list of available actors */}
        <div className={[`w90 mxa mt1 row`].join(" ")}>
          {/* <MultiSelect
            staticData={allActors}
            defaultSelecteds={defaultActors}
            onChange={setSelectedActors}
            isStatic={true}
            wrapperClassName={"col-md-6 col-sm-12"}
            nameKey="label"
            valueKey="value"
            strings={{ label: "ارجاع به" }}
            maxHeight={300}
            id="actors-list"
          /> */}
          {/* <div className="flex flex-col gap-0 col-md-12 col-sm-12 mb-2">
            <span>ارجاع به</span>
            <RadioGroup
              // label="ارجاع به"
              valueKey="value"
              nameKey="label"
              defaultValue={defaultActors}
              onChange={(value) => setSelectedActors(value)}
              options={allActors}
            />
          </div> */}
          <SelectBox
            label="ارجاع به"
            staticData={true}
            name="actorId"
            handleChange={handleActors}
            options={allActors}
            handle={["label"]}
            value={selectedActors}
            wrapperClassName="col-md-6 col-sm-12"
          />
          {/* list of reasons */}
          <SelectBox
            label="دلیل"
            staticData={true}
            name="reasonId"
            handleChange={handleChange}
            options={transition.reasonList}
            handle={["title"]}
            value={reasonId}
            wrapperClassName="col-md-6 col-sm-12"
          />
        </div>
        {/* comment box */}
        <div className={["w90 mxa mt1"].join(" ")}>
          <Textarea
            name="comment"
            title="توضیحات"
            value={comment}
            handleChange={handleChange}
            wrapperClassName="col-md-12"
            inputClassName="mh100"
          />
        </div>
        {/* a box used to send a message to citizen. visibility based on transition type */}
        {/* {transition?.canSendMessageToCitizen && (
          <div className={["w90 mxa mt1"].join(" ")}>
            <Textarea
              name="messageToCitizen"
              title="پاسخ به شهروند:"
              value={messageToCitizen}
              handleChange={handleChange}
              wrapperClassName="col-md-12"
              inputClassName="mh100"
            />
            <Button
              title="ارسال پیام"
              outline={!store.darkMode}
              onClick={sendMessageToCitizen}
              loading={loading}
            />
          </div>
        )} */}
        {/* add and show attachments */}
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            setCloseWebcam((pre) => pre + 1);
          }}
          center
          modalId="recorder"
          styles={{ direction: "ltr" }}
          //   classNames={styles.customModal}
        >
          <VideoRecorder
            removeRecord={onRemoveRecord}
            addRecord={onAddRecords}
            closeWebcam={closeWebcam}
            closeDialog={() => {
              setOpen(false);
              setCloseWebcam((pre) => pre + 1);
            }}
          />
        </Modal>
        <Modal
          open={open2}
          onClose={() => setOpen2(false)}
          center
          modalId="recorder"
          styles={{ direction: "ltr" }}
          //   classNames={styles.customModal}
        >
          <VoiceRecorder
            removeRecord={onRemoveRecord}
            addRecord={onAddRecords}
          />
        </Modal>
        <div className="w90 frc mxa mt1 flex items-center gap-5">
          {isContractor && (
            <>
              <Button outline onClick={() => setOpen2(true)}>
                <div className=" flex gap-2">
                  <span>میکروفون</span>
                  <span>
                    <i class="fas fa-microphone-alt"></i>
                  </span>
                </div>
                {hasVoice && (
                  <span className=" absolute bg-primary -top-2 -left-2 rounded-full h-6 w-6 text-white grid place-content-center">
                    1
                  </span>
                )}
              </Button>
              <Button
                outline
                onClick={() => setOpen(true)}
                className=" flex !items-center gap-2"
              >
                <div className=" flex items-center gap-2">
                  <span>دوربین</span>
                  <span>
                    <i class="fas fa-camera-alt"></i>
                  </span>
                </div>
                {hasVideo && (
                  <span className=" absolute bg-primary -top-2 -left-2 rounded-full h-6 w-6 text-white grid place-content-center">
                    1
                  </span>
                )}
              </Button>
            </>
          )}

          <AttachmentToggle onAddAttachment={onAddAttachment} />
        </div>
        {/* submit button */}
      </div>
      <div className="w80 mxa fre py1 px2 border-t-light mt1 fixed b0 bg-white">
        <Button
          title="ارجاع درخواست"
          className="py1 br05 bg-primary"
          onClick={setReportPayload}
          loading={createLoading}
        />
      </div>
    </>
  );
};

export default TransitionForm;
