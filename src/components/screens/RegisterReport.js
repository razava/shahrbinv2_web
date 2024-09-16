import React, { useContext, useEffect, useRef, useState } from "react";
import { CommonAPI, ReportsAPI } from "../../apiCalls";
import {
  callAPI,
  closeModal,
  constants,
  findRegionId,
  fixDigit,
  getFromLocalStorage,
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
import CategoryForm2 from "../commons/dataDisplay/CategoryForm2";
import RegisterCategoryForm from "../commons/dataDisplay/RegisterCategoryForm";

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
  defaultPriority: "",
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
  const [category, setCategory] = useState("");
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
    const regionId = getFromLocalStorage(
      constants.SHAHRBIN_MANAGEMENT_INSTANCE
    ).cityId;
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
      // callRegister(payload);
      console.log(regionId);
      callRegister({
        categoryId: categoryId,
        comments: JSON.stringify({
          values: values.comments,
          formId: category.form.id,
        }),
        phoneNumber: fixDigit(values.phoneNumber, true),
        firstName: values.firstName,
        lastName: values.lastName,
        isIdentityVisible: isIdentityVisible,
        address: {
          regionId: values.region && values.region,
          street: "",
          valley: "",
          detail: values.address,
          number: "",
          postalCode: "",
          latitude: values.coordinates.latitude,
          longitude: values.coordinates.longitude,
          elevation: 0,
        },
        attachments: attachments.map((attachment) => attachment.id),
        visibility: isPublic,
        priority: Number(values.defaultPriority),
      });
    } else {
      toast(validation.message, { type: "error" });
    }
  };

  const callRegister = (payload) => {
    setLoading(true);
    callAPI({
      caller: ReportsAPI.registerByOperator,
      payload,
      successStatus: 201,
      successCallback: (res) => {
        setReportId(res.data.id);
        childData.current = { id: res.data };
        modalRoot.classList.add("active");
        clearValues();
        setReferDialog(true);
      },
      requestEnded: () => setLoading(false),
    });
  };

  const onCategoriesSelected = (selecteds) => {
    console.log(selecteds[0]);
    if (selecteds.length > 0) {
      const selected = selecteds[0];
      console.log(selected);
      setCategory(selected);
      setCategoryTitle(selected.title);
      setCategoryId(selected.id);
      setValues({ ...values, defaultPriority: selecteds[0].defaultPriority });
    } else {
      setCategory("");
      setCategoryTitle("");
      setCategoryId(null);
    }
    modalRoot.classList.remove("active");
  };

  const onCloseCategoryDialog = () => {
    setCategoryDialog(false);
    modalRoot.classList.remove("active");
  };

  const saveAddressChanges = (detail, coordinates, geofences) => {
    console.log("Add Report")
    setValues({ ...values, address: detail, coordinates,region:geofences });
    closeModal();
  };

  const clearValues = () => {
    setValues(defaultValues);
    setAttachments([]);
    setCategoryId(null);
    setCategory("");
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
    console.log(attachs);
    setAttachments(attachs);
  };
  useEffect(() => {
    console.log(values);
  }, [values]);

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
  useEffect(() => {
    console.log(values.region);
  }, [values.region]);

  const hasAttachment = category?.form?.elements?.find(
    (item) => item.elementType == "dropzone"
  );

  console.log(hasAttachment);
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
                  <>
                    <SelectOnMapDialog
                      saveChanges={saveAddressChanges}
                      condition={mapDialog}
                      setCondition={setMapDialog}
                      setLoading={setMapLoading}
                      // width={600}
                      height={500}
                      defaultAddress={values.address}
                    ></SelectOnMapDialog>
                  </>
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
                wrapperClassName="col-md-6 col-sm-12"
                onChange={onVisibilityChange}
              />
              <IsIdentityVisible
                wrapperClassName=" py05 w100 d-flex fdc al-s ju-c relative col-md-6 col-sm-12"
                value={isIdentityVisible}
                onChange={setIsIdentityVisible}
              />
            </div>
            <div className={"w100 row"}>
              <SelectBox
                staticData
                options={[
                  { id: 0, title: "کم" },
                  { id: 1, title: "عادی" },
                  { id: 2, title: "زیاد" },
                  { id: 3, title: "فوری" },
                ]}
                name="defaultPriority"
                value={values.defaultPriority}
                handleChange={handleChange}
                handle={["title"]}
                label="اولویت"
                wrapperClassName="col-md-6 col-sm-12"
              />
            </div>
          </div>
          {category && (
            <>
              <div className=" w-[88%] mx-auto h-2 my-3 bg-gray-200"></div>
              <div className="w100 px-36">
                <RegisterCategoryForm
                  onChange={(data) => setValues({ ...values, comments: data })}
                  data={{ category: category }}
                  addAttachment={(data) => {
                    console.log(data);
                    setAttachments(data);
                  }}
                />{" "}
              </div>
            </>
          )}
          {!hasAttachment && (
            <div className="w90 mxa frc mt1 px3">
              <AttachmentToggle
                onAddAttachment={onAddAttachment}
                reset={reset}
              />
            </div>
          )}

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
            canRefer: true,
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
