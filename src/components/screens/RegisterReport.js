import React, { useContext, useEffect, useRef, useState } from "react";
import { CommonAPI, ReportsAPI } from "../../apiCalls";
import {
  callAPI,
  closeModal,
  findRegionId,
  fixDigit,
  getRegions,
} from "../../helperFuncs";
import { AppStore } from "../../store/AppContext";
import ReportDialog from "../commons/dataDisplay/ReportDialog";
import SelectOnMapDialog from "../commons/dialogs/SelectOnMapDialog";
import TreeSystem from "../commons/dialogs/TreeSystem";
import Button from "../helpers/Button";
import DialogToggler from "../helpers/DialogToggler";
import SelectBox from "../helpers/SelectBox";
import Textarea from "../helpers/Textarea";
import TextInput from "../helpers/TextInput";
import { toast } from "react-toastify";
import Radio from "../helpers/Radio/Radio";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import IsIdentityVisible from "../helpers/IsIdentityVisible";
import AttachmentToggle from "../commons/dataDisplay/Attachment/AttachmentToggle";
import NavigatableDialog from "../helpers/NavigatableDialog";

const modalRoot = document && document.getElementById("modal-root");

const defaultValues = {
  comments: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  address: "",
  coordinates: {
    latitude: null,
    longitude: null,
  },
  region: "",
};

const RegisterReport = () => {
  const childData = useRef(null);

  const [store = {}] = useContext(AppStore);
  const { initials: { regions } = {} } = store;

  const [values, setValues] = useState(defaultValues);

  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [reportId, setReportId] = useState(null);
  const [referDialog, setReferDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [mapDialog, setMapDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [isIdentityVisible, setIsIdentityVisible] = useState(true);
  const [isPublic, setIsPublic] = useState(0);
  const [reset, setReset] = useState(false);

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const validate = () => {
    if (!values.coordinates.latitude || !values.coordinates.longitude) {
      return {
        state: false,
        message: "لطفا مکان محل درخواست را روی نقشه انتخاب کنید",
      };
    }
    if (!categoryId) {
      return {
        state: false,
        message: "لطفا یک دسته‌بندی را انتخاب کنید.",
      };
    }
    if (!values.region) {
      return {
        state: false,
        message: "لطفا منطقه محل گزارش را انتخاب نمایید.",
      };
    }
    if (!values.phoneNumber) {
      return {
        state: false,
        message: "لطفا شماره تلفن را وارد نمایید.",
      };
    }

    return { state: true };
  };

  const registerReport = (e) => {
    const validation = validate();
    if (validation.state) {
      const payload = new FormData();
      payload.set("categoryId", categoryId);
      payload.set("comments", values.comments);
      payload.set("firstName", values.firstName);
      payload.set("lastName", values.lastName);
      payload.set("isIdentityVisible", isIdentityVisible);
      payload.set("visibility", isPublic);
      payload.set("address.detail", values.address);
      if (values.coordinates.latitude) {
        payload.set("address.latitude", values.coordinates.latitude);
      }
      if (values.coordinates.longitude) {
        payload.set("address.longitude", values.coordinates.longitude);
      }
      payload.set("address.regionId", values.region && values.region);
      payload.set("phoneNumber", fixDigit(values.phoneNumber, true));
      attachments.forEach((attachment) => {
        payload.append("attachments", attachment.file);
      });
      callRegister(payload);
    } else {
      toast(validation.message, { type: "error" });
    }
  };

  const callRegister = (payload) => {
    setLoading(true);
    callAPI({
      caller: ReportsAPI.registerByOperator,
      payload,
      successCallback: (res) => {
        setReportId(res.data);
        childData.current = { id: res.data };
        modalRoot.classList.add("active");
        clearValues();
        setReferDialog(true);
      },
      requestEnded: () => setLoading(false),
    });
  };

  const onCategoriesSelected = (selecteds) => {
    if (selecteds.length > 0) {
      const selected = selecteds[0];
      setCategoryTitle(selected.title);
      setCategoryId(selected.id);
    } else {
      setCategoryTitle("");
      setCategoryId(null);
    }
    modalRoot.classList.remove("active");
  };

  const onCloseCategoryDialog = () => {
    setCategoryDialog(false);
    modalRoot.classList.remove("active");
  };

  const saveAddressChanges = (detail, coordinates, geofences = []) => {
    let regionId = "";
    if (geofences) {
      regionId = findRegionId(regions, geofences);
    }
    setValues({ ...values, address: detail, coordinates, region: regionId });
    closeModal();
  };

  const clearValues = () => {
    setValues(defaultValues);
    setAttachments([]);
    setCategoryId(null);
    setCategoryTitle("");
    setIsIdentityVisible(true);
    setIsPublic(0);
    setReset(true);
    setTimeout(() => {
      setReset(false);
    }, 500);
  };

  const closeDialog = () => {
    setReferDialog(false);
    modalRoot.classList.remove("active");
    clearValues();
  };

  const onVisibilityChange = (name) => (e) =>
    setIsPublic(name === "public" ? 0 : 1);

  const onAddAttachment = (attachs) => {
    setAttachments(attachs);
  };

  const visibilityOptions = [
    {
      id: "vs-1",
      checked: isPublic === 0,
      name: "public",
      title: "عمومی",
    },
    {
      id: "vs-2",
      checked: isPublic !== 0,
      name: "private",
      title: "خصوصی",
    },
  ];
  return (
    <>
      <LayoutScrollable>
        <div className="w100 mxa br05 bg-white pt2 ">
          <div className="w90 mxa frc wrap">
            <div className="w100 row">
              <TextInput
                value={values.phoneNumber}
                name="phoneNumber"
                onChange={handleChange}
                required={false}
                title="تلفن همراه"
                wrapperClassName="col-md-6 col-sm-12"
              />
              <TextInput
                value={values.firstName}
                name="firstName"
                onChange={handleChange}
                required={false}
                title="نام"
                wrapperClassName="col-md-6 col-sm-12"
              />
            </div>
            <div className="w100 row">
              <TextInput
                value={values.lastName}
                name="lastName"
                onChange={handleChange}
                required={false}
                title="نام خانوادگی"
                wrapperClassName="col-md-6 col-sm-12"
              />
              <TextInput
                value={values.address}
                name="address"
                onChange={handleChange}
                required={false}
                title="آدرس"
                wrapperClassName="col-md-6 col-sm-12"
                inputClassName="pointer bg-white"
                icon="fas fa-map-marker-alt"
                iconClassName="f15 text-color"
                onIconClick={() => setMapDialog(true)}
                onClick={() => setMapDialog(true)}
                readOnly={true}
              >
                <DialogToggler
                  condition={mapDialog}
                  setCondition={setMapDialog}
                  loading={mapLoading}
                  width={700}
                  isUnique={false}
                  outSideClickEvent={"mousedown"}
                  id="select-on-map-dialog"
                >
                  <SelectOnMapDialog
                    saveChanges={saveAddressChanges}
                    condition={mapDialog}
                    setCondition={setMapDialog}
                    setLoading={setMapLoading}
                    // width={600}
                    height={500}
                    defaultAddress={values.address}
                  />
                </DialogToggler>
              </TextInput>
            </div>

            <div className="w100 row">
              <TreeSystem
                caller={CommonAPI.getSubjectGroups}
                condition={categoryDialog}
                setCondition={setCategoryDialog}
                onChange={onCategoriesSelected}
                defaultSelected={[{ id: categoryId }]}
                singleSelect={true}
                onClose={onCloseCategoryDialog}
                renderToggler={(selecteds) => (
                  <TextInput
                    title="دسته‌بندی"
                    readOnly={true}
                    onClick={() => setCategoryDialog(true)}
                    wrapperClassName="col-md-6 col-sm-12"
                    inputClassName="pointer"
                    required={false}
                    value={
                      selecteds.length > 0 && categoryId
                        ? selecteds[0]?.title
                        : ""
                    }
                  />
                )}
                reset={reset}
              ></TreeSystem>
              <SelectBox
                // caller={CommonAPI.getRegions}
                handleChange={handleChange}
                staticData={true}
                options={regions}
                name="region"
                handle={["name"]}
                wrapperClassName="col-md-6 col-sm-12"
                title="منطقه"
                value={values.region}
                label="منطقه"
              />
            </div>

            <div className="w100 row">
              <Radio
                name="visibility"
                id="visibility"
                title={"نوع انتشار"}
                options={visibilityOptions}
                defaultStyles={true}
                wrapperClassName="col-md-6 col-sm-12 px1"
                onChange={onVisibilityChange}
              />
              <IsIdentityVisible
                wrapperClassName="px1 py05 w100 d-flex fdc al-s ju-c relative col-md-6 col-sm-12"
                value={isIdentityVisible}
                onChange={setIsIdentityVisible}
              />
            </div>
          </div>
          <div className="w100 mxa">
            <Textarea
              value={values.comments}
              name="comments"
              handleChange={handleChange}
              title="توضیحات"
              wrapperClassName="mxa"
              inputClassName="w100 mxa"
              defaultStyles={true}
            />
          </div>
          <div className="w90 mxa frc mt1 px3">
            <AttachmentToggle onAddAttachment={onAddAttachment} reset={reset} />
          </div>

          <div className="w100 mxa fre py1 px2 border-t-light mt1">
            <Button
              title="ثبت درخواست"
              className=""
              onClick={registerReport}
              loading={loading}
            />
          </div>
        </div>
        {/* <DialogToggler
          condition={referDialog}
          setCondition={setReferDialog}
          isUnique={false}
          width={800}
          height={650}
          id="report-dialog-frgthj"
        >
          <ReportDialog
            setDialog={setReferDialog}
            caller={ReportsAPI.getTask}
            childData={childData.current}
            onNext={closeDialog}
          />
        </DialogToggler> */}

        <NavigatableDialog
          condition={referDialog}
          dialogId={reportId}
          data={{ id: reportId }}
          setCondition={setReferDialog}
          width={900}
          height={600}
          list={[{ id: reportId }]}
          Child={ReportDialog}
          childProps={{
            id: reportId,
            readOnly: false,
            setDialog: setReferDialog,
            // refresh: refresh,
            caller: ReportsAPI.getTask,
          }}
          id="report-dialog"
        />
      </LayoutScrollable>
    </>
  );
};

export default RegisterReport;
