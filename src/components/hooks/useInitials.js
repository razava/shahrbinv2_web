import React, { useContext, useEffect } from "react";
import { CommonAPI, InstanceManagementAPI } from "../../apiCalls";
import {
  callAPI,
  constants,
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../helperFuncs";
import { AppStore } from "../../store/AppContext";
import jwt_decode from "jwt-decode";

const useInitials = () => {
  // store
  const [store, dispatch] = useContext(AppStore);
  const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);

  // functions
  const getInitials = async (instance_id) => {
    let instance = {};

    callAPI({
      caller:
        instance_id !== "-1"
          ? InstanceManagementAPI.getInstanceById
          : () => Promise.reject({}),
      payload: instance_id,
      successCallback: async (res) => {
        if (res.data) {
          instance = res.data;
          saveToLocalStorage(constants.SHAHRBIN_MANAGEMENT_INSTANCE, instance);
        }
        const categoryPromise = new Promise((resolve, reject) => {
          callAPI({
            caller: CommonAPI.getSubjectGroups,
            successCallback: (res) => {
              resolve(res.data);
              console.log(res.data);
            },
            errorCallback: (err) => {
              reject(err);
            },
          });
        });

        const regionsPromise = new Promise((resolve, reject) => {
          callAPI({
            caller: CommonAPI.getRegions,
            successCallback: (res) => {
              resolve(res.data);
            },
            errorCallback: (err) => {
              reject(err);
            },
          });
        });

        const [categories, regions] = await Promise.all([
          categoryPromise,
          regionsPromise,
        ]);
        const payload = { categories, regions, instance };

        dispatch({
          type: "setInitials",
          payload,
        });
      },
      errorCallback: (err) => {},
    });
  };

  // effects
  useEffect(() => {
    let instance_id;
    if (token) {
      instance_id = jwt_decode(token).instance_id;
      getInitials(instance_id);
    }
  }, [token]);

  return;
};

export default useInitials;
