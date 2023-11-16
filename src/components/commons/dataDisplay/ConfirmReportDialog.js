import React, { useContext, useEffect, useState } from "react";
import {
  findRegionId,
  getRegions,
  serverError,
  unKnownError,
} from "../../../helperFuncs";
import styles from "../../../stylesheets/reportdialog.module.css";
import SelectOnMapDialog from "../dialogs/SelectOnMapDialog";
import useMakeRequest from "../../hooks/useMakeRequest";
import { CommonAPI, ReportsAPI } from "../../../apiCalls";
import { toast } from "react-toastify";
import SelectBox from "../../helpers/SelectBox";
import ShowAttachments from "./ShowAttachments";
import Textarea from "../../helpers/Textarea";
import TextInput from "../../helpers/TextInput";
import DialogToggler from "../../helpers/DialogToggler";
import TreeSystem from "../dialogs/TreeSystem";
import Button from "../../helpers/Button";
import Radio from "../../helpers/Radio/Radio";
import { AppStore } from "../../../store/AppContext";

const ConfirmReportDialog = ({
  report,
  setDialog = (f) => f,
  verifiedCallBack = (f) => f,
}) => {
  // store
  const [store] = useContext(AppStore);
  const regions = store.initials.regions;

  // states
  const [comments, setComments] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [addressDetail, setAddressDetail] = useState("");
  const [regionId, setRegionId] = useState("");
  const [medias, setMedias] = useState([]);
  const [tempMedias, setTempMedias] = useState([]);
  const [isPublic, setIsPublic] = useState(0);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [payload, setPayload] = useState(null);
  const [verifyRequset, setVerifyRequest] = useState(false);
  const [mapDialog, setMapDialog] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);

  const onTextChange = (name) => (e) => {
    let value = e.target ? e.target.value : e;
    if (name === "comments") {
      setComments(value);
    } else if (name === "addressDetail") {
      setAddressDetail(value);
    } else if (name === "regionId") {
      setRegionId(value);
    }
  };

  useEffect(() => {
    if (report) {
      setComments(report.comments);
      setCategoryTitle(report.category && report.category.title);
      setCategoryId(report.category && report.category.id);
      setAddressDetail(report.address && report.address.detail);
      setCoordinates({
        latitude: report.address && report.address.latitude,
        longitude: report.address && report.address.longitude,
      });
      setMedias(report.medias);
      setRegionId(report.address?.regionId || "");
      setTempMedias(
        report?.medias
          ? report.medias.map((media) => {
              return { ...media, isDeleted: false };
            })
          : []
      );
    }
  }, []);

  const saveLocation = (address, coordinates, geofences) => {
    console.log(geofences);
    const regionId = findRegionId(regions, geofences);
    setAddressDetail(address);
    setCoordinates(coordinates);
    setRegionId(regionId);
  };

  const deleteHandler = (mediaToDelete) => {
    const newTempMedias = tempMedias.map((media) => {
      if (media.url !== mediaToDelete.url) return media;
      else {
        media.isDeleted = !media.isDeleted;
        return media;
      }
    });
    setTempMedias(newTempMedias);
  };

  const showComments = (comments) => {
    const isJSON = /JSON/.test(comments);
    if (isJSON) {
      const array = JSON.parse(String(comments).replace(/\[JSON\]/, ""));

      return array.map((a) => `${a.title}: ${a.value}`).join(" \n");
    } else return comments ? comments : "";
  };

  const verifyReport = () => {
    if (!regionId) {
      toast("منطقه درخواست را انتخاب نمایید", { type: "error" });
      return;
    }
    const payload = new FormData();
    payload.append("address.detail", addressDetail);
    payload.append("address.latitude", coordinates.latitude);
    payload.append("address.longitude", coordinates.longitude);
    payload.append("address.regionId", regionId);
    payload.append("categoryId", categoryId);
    payload.append("visibility", isPublic);
    payload.append("id", report.id);
    tempMedias
      .filter((media) => !media.isDeleted)
      .forEach((media, i) => {
        payload.append(`medias[${i}].id`, media.id);
      });

    setPayload(payload);
    setVerifyRequest(true);
  };

  const [, loading] = useMakeRequest(
    ReportsAPI.registerByOperator,
    200,
    verifyRequset,
    payload,
    (res) => {
      setVerifyRequest(false);
      if (res && res.status === 200) {
        setDialog(false);
        // modalRoot.classList.remove("active");
        verifiedCallBack(report);
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    }
  );

  const onCategoriesSelected = (selecteds) => {
    const selected = selecteds[0];
    setCategoryTitle(selected.title);
    setCategoryId(selected.id);
  };

  const onVisibilityChange = (name) => (e) =>
    setIsPublic(name === "public" ? 0 : 1);

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
      <div className={"w90 mxa frc row"}>
        <div className="w100 mxa row frc">
          <TextInput
            wrapperClassName={"col-md-6 col-sm-12"}
            value={addressDetail}
            onChange={onTextChange}
            name={"addressDetail"}
            title="آدرس"
            required={false}
            icon="fas fa-map-marker-alt"
            iconClassName="f15 text-color"
            inputClassName="px2 pointer"
            onClick={() => setMapDialog(true)}
          >
            <DialogToggler
              condition={mapDialog}
              setCondition={setMapDialog}
              loading={mapLoading}
              width={600}
              height={600}
              isUnique={false}
              outSideClick={false}
              fixedDimension={true}
              id="select-on-map-confirm"
            >
              <SelectOnMapDialog
                condition={mapDialog}
                setCondition={setMapDialog}
                setLoading={setMapLoading}
                defaultCoordinates={coordinates}
                saveChanges={saveLocation}
                defaultAddress={addressDetail}
                height={500 - 40}
              />
            </DialogToggler>
          </TextInput>

          <TreeSystem
            isStatic
            staticData={store.initials.categories}
            condition={categoryDialog}
            setCondition={setCategoryDialog}
            onChange={onCategoriesSelected}
            defaultSelected={[{ id: categoryId }]}
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
          ></TreeSystem>
        </div>

        <div className={"w100 mxa frc row"}>
          <SelectBox
            staticData
            options={store.initials.regions}
            name="regionId"
            value={regionId}
            handleChange={onTextChange}
            handle={["name"]}
            label="منطقه"
            wrapperClassName="col-md-6 col-sm-12 col-12"
          />
          <Radio
            name="visibility"
            id="visibility"
            title={"نوع انتشار"}
            options={visibilityOptions}
            defaultStyles={true}
            onChange={onVisibilityChange}
            wrapperClassName="col-md-6 col-sm-12 col-12"
          />
        </div>
        <div className="w100 mxa">
          <Textarea
            wrapperClassName="col-md-12"
            inputClassName="flex-auto mh150"
            value={showComments(comments)}
            handleChange={onTextChange}
            name="comments"
            title="توضیحات"
          />
        </div>
        <div className={"w90 mxa px1"}>
          <label className={styles.infoLabel}>پیوست ها</label>
          <ShowAttachments
            medias={tempMedias}
            isDeletable={true}
            deleteHandler={deleteHandler}
          />
        </div>
      </div>
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title="تایید"
          className="py1 br05 bg-primary"
          onClick={verifyReport}
          loading={loading}
        />
      </div>
    </>
  );
};

export default ConfirmReportDialog;
