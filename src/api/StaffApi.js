import {
  constants,
  getFromLocalStorage,
  createQueryParams,
} from "../helperFuncs";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
const Token =
  getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN) || {};
const instanceId = getFromLocalStorage(
  constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
);

export async function getFAQ() {
  const data = await axios.get(`/api/${instanceId}/StaffFaq`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function makeFAQ(Data) {
  const data = await axios.post(`/api/${instanceId}/StaffFaq`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function editFAQ({Data, id}) {
  const data = await axios.put(`/api/${instanceId}/StaffFaq/${id}`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}
