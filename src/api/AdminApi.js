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

export async function getNews() {
  const data = await axios.get(`/api/${instanceId}/AdminNews`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function createNews(Data) {
  const data = await axios.post(`/api/${instanceId}/AdminNews`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function editNews({ Data, id }) {
  const data = await axios.put(`/api/${instanceId}/AdminNews/${id}`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getCategoryById(id) {
  const data = await axios.get(`/api/${instanceId}/AdminCategory/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}
