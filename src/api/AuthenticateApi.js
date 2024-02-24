import {
  constants,
  getFromLocalStorage,
  createQueryParams,
} from "../helperFuncs";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// const prefix = process.env.REACT_APP_API_URL;
const Token =
  getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN) || {};
const instanceId = getFromLocalStorage(
  constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
);

axios.interceptors.request.use(function (config) {
  const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export async function updateAvatar(Data) {
  const data = await axios.put(`/api/Authenticate/Avatar`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getCaptcha() {
  const data = await axios.get(
    `/api/${instanceId}/Authenticate/Captcha`,
    { responseType: "blob" },
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data;
}

export async function verifyStaff(payload) {
  const data = await axios.post(`/api/1/Authenticate/VerifyStaff`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function postNewPhoneNumber(payload) {
  const data = await axios.post(`/api/1/Authenticate/PhoneNumber`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function putNewPhoneNumber(payload) {
  const data = await axios.put(`/api/1/Authenticate/PhoneNumber`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}
