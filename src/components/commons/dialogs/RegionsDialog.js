import React, { useEffect, useState } from "react";
import { AuthenticateAPI, CommonAPI, UserInfoAPI } from "../../../apiCalls";
import useMakeRequest from "../../hooks/useMakeRequest";
import Loader from "../../helpers/Loader";
import { getAuthToken, serverError, unKnownError } from "../../../helperFuncs";
import Button from "../../helpers/Button";
import { toast } from "react-toastify";
import CheckBoxGroup from "../../helpers/CheckBox/CheckBoxGroup";

const modalRoot = document && document.getElementById("modal-root");

const RolesDialog = ({ userId, setCondition }) => {
  const [regions, setRegions] = useState([]);
  const [makeRequest, setMakeRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(null);

  const handleRegionChange = (items = []) => {
    const newRegions = regions.map((region) => ({
      ...region,
      selected: items.findIndex((item) => item === region.id) !== -1,
    }));
    setRegions(newRegions);
  };

  const saveRegions = (e) => {
    const regionIds = regions.filter((r) => r.selected).map((r) => r.id);
    const payload = {
      regionIds,
      id: userId,
    };
    setPayload(payload);
    setMakeRequest(true);
  };

  const getNeccessaryData = () => {
    const regionsPromise = new Promise((resolve, reject) => {
      const token = getAuthToken();
      return CommonAPI.getYazdRegions(token).then((res) => {
        if (res && res.status === 200) resolve(res.data);
        else if (serverError(res)) {
          reject([]);
          return;
        } else if (unKnownError(res)) {
          reject([]);
          return;
        }
      });
    });
    const userRegionsPromise = new Promise((resolve, reject) => {
      const token = getAuthToken();
      return AuthenticateAPI.getuserRegions(token, userId).then((res) => {
        if (res && res.status === 200) resolve(res.data);
        else if (serverError(res)) {
          reject([]);
          return;
        } else if (unKnownError(res)) {
          reject([]);
          return;
        }
      });
    });

    return Promise.all([regionsPromise, userRegionsPromise]);
  };

  const handleData = async () => {
    setLoading(true);
    try {
      const res = await getNeccessaryData();
      let regions = res[0];
      regions.forEach((region) => {
        const exists = res[1].find((r) => r === region.id);
        if (exists) region.selected = true;
        else region.selected = false;
      });
      setRegions(regions);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setCondition(false);
      modalRoot.classList.remove("active");
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  const [, saveLoading] = useMakeRequest(
    UserInfoAPI.saveUserRegions,
    204,
    makeRequest,
    payload,
    (res) => {
      setMakeRequest(false);
      setCondition(false);
      modalRoot.classList.remove("active");
      if (res.status === 204) {
        toast("تغییرات با موفقیت ذخیره شد.", { type: "success" });
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    userId
  );

  return (
    <>
      {loading && (
        <div className="w100 h100 relative fcc bg-white">
          <Loader absolute />
        </div>
      )}
      <CheckBoxGroup
        items={regions.map((region) => ({
          id: region.id,
          label: region.name,
          checked: region.selected,
          wrapperClassName: "w30 d-flex al-c ju-s my1",
          labelClassName: "f12 my05",
        }))}
        onChange={handleRegionChange}
        wrapperClassName="px1 mh100"
        title="نقش‌ها"
      />
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title="ذخیره تغییرات"
          className="py1 br05 bg-primary"
          onClick={saveRegions}
          loading={saveLoading}
        />
      </div>
    </>
  );
};

export default RolesDialog;
