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
export async function postFiles(Data) {
  const data = await axios.post("/api/Files", Data, {
    headers: { Authorization: `Bearer ${Token}` },
    "Content-Type": "multipart/form-data",
  });
  return data.data;
}

export async function EditProfile(Data) {
  const data = await axios.put(
    `/api/${instanceId}/Authenticate`,
    Data,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function getCitizenInformation(id) {
  const data = await axios.get(`/api/${instanceId}/StaffReport/Citizen/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getReportById(id) {
  const data = await axios.get(`/api/${instanceId}/StaffReport/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}
