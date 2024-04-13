import {
  constants,
  getFromLocalStorage,
  createQueryParams,
  saveToLocalStorage,
} from "../helperFuncs";
import axios from "axios";
axios.defaults.baseURL = window.__ENV__?.REACT_APP_API_URL;
// const prefix = process.env.REACT_APP_API_URL;
const ticketingToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU2hhaHJiaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImNjZGYzMWM1LTJhNjktNDEzMi1iZmRmLTFiZTgyZTFkODE1ZiIsImp0aSI6IjQ4MzU3MmFkLTczODMtNDdjNS05Y2ZkLTA5NDU5OGY1MGVjOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlByb2plY3QiLCJleHAiOjE3NDMxNTE3MDYsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0In0.BA1TfqGWjO90iDeVMwfD0Z2r2X6cSzULLw0m-5ZnR8s";
const Token =
  getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN) || {};
const instanceId = getFromLocalStorage(
  constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
);

axios.interceptors.request.use(function (config) {
  const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
  console.log(config);
  if (config?.url?.origin == "https://ticketingapi.shetabdahi.ir") {
    config.headers.Authorization = `bearer ${ticketingToken}`;
  } else {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }
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

export async function forgotPassword(payload) {
  const data = await axios.post(`/api/1/Authenticate/ForgotPassword`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function resetPassword(payload) {
  const data = await axios.post(`/api/1/Authenticate/ResetPassword`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function resendOtp(payload) {
  const data = await axios.post(`/api/1/Authenticate/ResendOtp`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function refreshToken(payload) {
  const data = await axios.post(`/api/1/Authenticate/Refresh`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}
export async function RefreshToken(payload) {
  try {
    const response = await axios.post(
      `/api/${instanceId}/Authenticate/Refresh`,
      payload
    );
    saveToLocalStorage(
      constants.SH_CT_ACCESS_TOKEN,
      response.data.data.jwtToken
    );
    saveToLocalStorage(
      constants.SH_CT_REFRESH_TOKEN,
      response.data.data.refreshToken
    );
    // localStorage.setItem(
    //   appConstants.SH_CT_ACCESS_TOKEN,
    //   response.data.jwtToken
    // );
    // localStorage.getItem(
    //   appConstants.SH_CT_REFRESH_TOKEN,
    //   response.data.refreshToken
    // );
    // window.location.reload();
    return response.data;
  } catch (error) {
    // removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
    // removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_REFRESH_TOKEN);
    // removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN_EXPIRATION);
    // removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_USER_ROLES);
    // removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID);
    // window.location.href = "/";
  }
}