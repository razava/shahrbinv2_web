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

export async function editFAQ({ Data, id }) {
  const data = await axios.put(`/api/${instanceId}/StaffFaq/${id}`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getReportHistory(id) {
  const data = await axios.get(
    `/api/${instanceId}/StaffReport/ReportHistory/${id}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function getReportComments(ReportId) {
  const data = await axios.get(
    `/api/${instanceId}/StaffReport/ReportComments/${ReportId}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function postMessageToCitizen({ id, payload }) {
  const data = await axios.post(
    `/api/${instanceId}/StaffReport/MessageToCitizen/${id}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function getAllNotes() {
  const data = await axios.get(`/api/${instanceId}/StaffReport/Notes`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getReportNotes(reportId) {
  const data = await axios.get(
    `/api/${instanceId}/StaffReport/Notes/${reportId}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function postReportNote({ ReportId, payload }) {
  const data = await axios.post(
    `/api/${instanceId}/StaffReport/Notes/${ReportId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function putReportNote({ noteId, payload }) {
  const data = await axios.put(
    `/api/${instanceId}/StaffReport/Notes/${noteId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function deleteReportNote(noteId) {
  const data = await axios.delete(
    `/api/${instanceId}/StaffReport/Notes/${noteId}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function getSatisfaction(reportId) {
  const data = await axios.get(
    `/api/${instanceId}/StaffReport/Satisfaction/${reportId}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function postObjection({ ReportId, payload }) {
  const data = await axios.post(
    `/api/${instanceId}/StaffReport/Objection/${ReportId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}
