import {
  constants,
  getFromLocalStorage,
  createQueryParams,
} from "../helperFuncs";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
const Token =
  getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN) || {};
// const instanceId = getFromLocalStorage(
//   constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
// );

const instanceId = () => {
  const id = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID);
  return id;
};

export async function getNews() {
  const data = await axios.get(`/api/${instanceId()}/AdminNews`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function createNews(Data) {
  const data = await axios.post(`/api/${instanceId()}/AdminNews`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function editNews({ Data, id }) {
  const data = await axios.put(`/api/${instanceId()}/AdminNews/${id}`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getCategoryById(id) {
  const data = await axios.get(`/api/${instanceId()}/AdminCategory/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getForms() {
  const data = await axios.get(`/api/${instanceId()}/AdminForms`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getFormById(id) {
  const data = await axios.get(`/api/${instanceId()}/AdminForms/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function postForm(payload) {
  const data = await axios.post(`/api/${instanceId()}/AdminForms`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function editForm({ id, payload }) {
  const data = await axios.put(`/api/${instanceId()}/AdminForms/${id}`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function deleteForm(id) {
  const data = await axios.delete(`/api/${instanceId()}/AdminForms/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}
