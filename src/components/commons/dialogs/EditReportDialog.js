import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ReportsAPI } from "../../../apiCalls";
import { callAPI, findRegionId } from "../../../helperFuncs";
import { AppStore } from "../../../store/AppContext";
import Button from "../../helpers/Button";
import DialogToggler from "../../helpers/DialogToggler";
import IsIdentityVisible from "../../helpers/IsIdentityVisible";
import Loader from "../../helpers/Loader";
import Radio from "../../helpers/Radio/Radio";
import SelectBox from "../../helpers/SelectBox";
import Textarea from "../../helpers/Textarea";
import TextInput from "../../helpers/TextInput";
import ShowAttachments from "../dataDisplay/ShowAttachments";
import SelectOnMapDialog from "./SelectOnMapDialog";
import TreeSystem from "./TreeSystem";
// import CategoryForm2 from "../dataDisplay/CategoryForm2";
import { getReportById } from "../../../api/commonApi";
import { useQuery } from "@tanstack/react-query";
import CategoryForm2 from "../dataDisplay/CategoryForm2";

const EditReportDialog = ({ report = {}, onSuccess = (f) => f }) => {
  // store
  const [store] = useContext(AppStore);
  const regions = store.initials.regions;
  const categories = store.initials.categories || {};

  // data states
  const [values, setValues] = useState({
    category: {},
    comments: "",
    address: "",
    coordinates: {},
    visibility: 0,
    isIdentityVisible: false,
    medias: [],
    regionId: "",
    priority: "",
  });

  //   flags
  const [mapDialog, setMapDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [loading, setLoading] = useState({ type: "", state: false });
  const [getLoading, setGetLoading] = useState(false);
  let categoryTitle;
  const category = store.initials.categories.categories.map((item) => {
    if (item.id == report.categoryId) {
      return item;
    } else {
      const a = item.categories.map((itm) => {
        if (itm.id == report.categoryId) {
          categoryTitle = itm.title;
          // return itm.id;
        }
      });
    }
  });
  // functions
  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const saveAddressChange = (address, coordinates, geofences) => {
    const regionId = findRegionId(regions, geofences);
    setValues({ ...values, address, coordinates, regionId });
  };

  const onVisibilityChange = (name) => (e) =>
    setValues({ ...values, visibility: name === "public" ? 0 : 1 });

  const onIdentityVisibilityChange = (value) => {
    setValues({ ...values, isIdentityVisible: value });
  };

  const onMediaChange = (mediaToDelete) => {
    const newMedias = values.medias.map((media) => {
      if (media.url !== mediaToDelete.url) return media;
      else {
        media.isDeleted = !media.isDeleted;
        return media;
      }
    });
    setValues({ ...values, medias: newMedias });
  };
  console.log(report);

  const getPayload = () => {
    const payload = new FormData();
    // payload.append("id", report.id);
    payload.append("comments", values.comments);
    payload.append("address.detail", values.address);
    payload.append("address.latitude", values.coordinates.latitude);
    payload.append("address.longitude", values.coordinates.longitude);
    payload.append("address.regionId", values.regionId);
    payload.append("visibility", values.visibility);
    payload.append("isIdentityVisible", values.isIdentityVisible);
    payload.append("categoryId", values.category.id);
    values.medias
      .filter((media) => !media.isDeleted)
      .forEach((media, i) => {
        payload.append(`medias[${i}].id`, media.id);
      });
    console.log(values);
    return {
      categoryId: values.category.id,
      comments: values.comments,
      isIdentityVisible: values.isIdentityVisible,
      visibility: 0,
      address: {
        regionId: values.regionId,
        street: "",
        valley: "",
        detail: values.address,
        number: "",
        postalCode: "",
        latitude: values.coordinates.latitude,
        longitude: values.coordinates.longitude,
        elevation: 0,
      },
      priority: Number(values.priority),
      attachments: values.medias
        .filter((media) => !media.isDeleted)
        .map((media, i) => media.id),
    };
    return payload;
  };

  const editReport = ({ withRefer = false } = {}) => {
    const payload = getPayload();
    setLoading({ type: withRefer ? "editAndRefer" : "edit", state: true });
    callAPI(
      {
        caller: ReportsAPI.updateReport,
        successStatus: 200,
        payload,
        successCallback: () => {
          onSuccess({ withRefer, report });
        },
        requestEnded: () =>
          setLoading({
            type: withRefer ? "editAndRefer" : "edit",
            state: false,
          }),
      },
      report?.id
    );
  };

  const editAndReferReport = () => {
    editReport({ withRefer: true });
  };

  const onCategoriesSelected = (selecteds) => {
    const selected = selecteds[0];
    setValues({ ...values, category: selected });
  };

  //   variables
  const visibilityOptions = [
    {
      id: "vs-1",
      checked: values.visibility === 0,
      name: "public",
      title: "عمومی",
    },
    {
      id: "vs-2",
      checked: values.visibility !== 0,
      name: "private",
      title: "خصوصی",
    },
  ];

  //queries
  const { data: ReportData, isLoading } = useQuery({
    queryKey: ["ReportData", report.id],
    queryFn: () => getReportById(report.id),
  });

  // effetcs
  useEffect(() => {
    if (report.id) {
      setGetLoading(true);
      callAPI({
        caller: ReportsAPI.getTask,
        successStatus: 200,
        payload: report.id,
        successCallback: (res) => {
          setValues({
            comments: res.data.comments || "",
            address: res.data.address?.detail || "",
            coordinates: {
              latitude: res.data.address?.latitude || null,
              longitude: res.data.address?.longitude || null,
            },
            visibility: res.data.visibility || 0,
            isIdentityVisible: res.data.isIdentityVisible || false,
            medias: res.data.medias || [],
            regionId: res.data.address?.regionId || "",
            category: res.data.category || {},
            priority: res.data?.priority,
          });
        },
        requestEnded: (res) => {
          setGetLoading(false);
          console.log(res);
        },
      });
    }
  }, [report]);

  const haveForm = ReportData?.comments?.[0] == "{";

  console.log(ReportData?.media);
  return (
    <>
      <>
        {getLoading && (
          <div style={{ backgroundColor: "#fff" }}>
            <Loader absolute={true} />
          </div>
        )}
        <div className="w100 frc row">
          <TreeSystem
            isStatic
            staticData={categories}
            condition={categoryDialog}
            setCondition={setCategoryDialog}
            onChange={onCategoriesSelected}
            defaultSelected={[{ id: values.category.id }]}
            singleSelect={true}
            onClose={() => setCategoryDialog(false)}
            renderToggler={(selected) => (
              <TextInput
                placeholder="انتخاب کنید."
                title="گروه موضوعی"
                readOnly={true}
                onClick={() => setCategoryDialog(true)}
                wrapperClassName="col-md-6 col-sm-12 col-12"
                inputClassName="pointer"
                required={false}
                value={
                  selected.length > 0
                    ? selected[0].title
                    : categoryTitle
                    ? categoryTitle
                    : ""
                }
              />
            )}
          />
          <SelectBox
            label="مناطق"
            name="regionId"
            value={values.regionId}
            staticData
            options={regions}
            handleChange={handleChange}
            isStatic={false}
            wrapperClassName="col-md-6 col-sm-12"
            handle={["name"]}
          />
        </div>
        <div className="w100 frc row">
          <TextInput
            value={values.address}
            onChange={handleChange}
            name={"address"}
            title="آدرس"
            required={false}
            icon="fas fa-map-marker-alt"
            iconClassName="f15 text-color"
            wrapperClassName="col-md-6 col-sm-12"
            onIconClick={() => setMapDialog(true)}
          >
            <DialogToggler
              condition={mapDialog}
              setCondition={setMapDialog}
              loading={mapLoading}
              width={700}
              // height={500}
              isUnique={false}
              outSideClick={false}
              fixedDimension={true}
              id="select-on-map"
            >
              <SelectOnMapDialog
                condition={mapDialog}
                setCondition={setMapDialog}
                setLoading={setMapLoading}
                defaultCoordinates={values.coordinates}
                saveChanges={saveAddressChange}
                defaultAddress={values.address}
                height={500}
              />
            </DialogToggler>
          </TextInput>
          <Radio
            name="visibility"
            id="visibility"
            title={"نوع انتشار"}
            wrapperClassName="col-md-6 col-sm-12"
            options={visibilityOptions}
            defaultStyles={true}
            onChange={onVisibilityChange}
          />
        </div>

        <div className="w100 mxa frs row">
          <IsIdentityVisible
            onChange={onIdentityVisibilityChange}
            value={values.isIdentityVisible}
            wrapperClassName="col-md-6 col-sm-12"
          />
          <SelectBox
            staticData
            options={[
              { id: 0, title: "کم" },
              { id: 1, title: "عادی" },
              { id: 2, title: "زیاد" },
              { id: 3, title: "فوری" },
            ]}
            name="priority"
            value={values.priority}
            handleChange={handleChange}
            handle={["title"]}
            label="اولویت"
            wrapperClassName="col-md-6 col-sm-12 col-12"
          />
        </div>

        <div className=" w-full mxa">
          {haveForm ? (
            <CategoryForm2
              readOnly={false}
              onChange={(data) =>
                setValues({ ...values, comments: JSON.stringify(data) })
              }
              data={ReportData}
            />
          ) : (
            <div className="w100 mxa">
              <Textarea
                value={values.comments}
                name="comments"
                handleChange={handleChange}
                title="توضیحات"
                inputClassName="mh100"
                wrapperClassName="col-sm-12"
              />
            </div>
          )}
        </div>
        <div className={"w90 mxa px1"}>
          <label className={"text-secondary f15"}>پیوست ها</label>
          <ShowAttachments
            medias={values.medias}
            isDeletable={true}
            deleteHandler={onMediaChange}
          />
        </div>

        <div className="w100 mxa fre py1 px2 border-t-light mt1">
          <Button
            title="ویرایش"
            className="py1 br05 bg-primary"
            onClick={editReport}
            loading={loading.state && loading.type === "edit"}
          />
          <Button
            title="ویرایش و ارجاع"
            className="py1 br05 bg-success mr1"
            onClick={editAndReferReport}
            loading={loading.state && loading.type === "editAnRefer"}
          />
        </div>
      </>
    </>
  );
};

export default EditReportDialog;
