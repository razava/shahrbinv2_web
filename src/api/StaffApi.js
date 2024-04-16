import {
  constants,
  getFromLocalStorage,
  createQueryParams,
} from "../helperFuncs";
import axios from "axios";
import TicketingAxios from "./TicketBaseUrl";
axios.defaults.baseURL = window.__ENV__?.REACT_APP_API_URL;
const Token =
  getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN) || {};
const instanceId = getFromLocalStorage(
  constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
);

export async function getFAQ() {
  const data = await axios.get(`/api/StaffFaq`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data.data;
}

export async function makeFAQ(Data) {
  const data = await axios.post(`/api/StaffFaq`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function editFAQ({ Data, id }) {
  const data = await axios.put(`/api/StaffFaq/${id}`, Data, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getReportHistory(id) {
  const data = await axios.get(
    `/api/StaffReport/ReportHistory/${id}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data.data;
}

export async function getReportComments(ReportId) {
  const data = await axios.get(
    `/api/StaffReport/ReportComments/${ReportId}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data.data;
}

export async function postMessageToCitizen({ id, payload }) {
  const data = await axios.post(
    `/api/StaffReport/MessageToCitizen/${id}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function getAllNotes() {
  const data = await axios.get(`/api/StaffReport/Notes`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data.data;
}

export async function getReportNotes(reportId) {
  const data = await axios.get(
    `/api/StaffReport/Notes/${reportId}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data.data;
}

export async function postReportNote({ ReportId, payload }) {
  const data = await axios.post(
    `/api/StaffReport/Notes/${ReportId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function putReportNote({ noteId, payload }) {
  const data = await axios.put(
    `/api/StaffReport/Notes/${noteId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function deleteReportNote(noteId) {
  const data = await axios.delete(
    `/api/StaffReport/Notes/${noteId}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function getSatisfaction(reportId) {
  const data = await axios.get(
    `/api/StaffReport/Satisfaction/${reportId}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data.data;
}

export async function postObjection({ ReportId, payload }) {
  const data = await axios.post(
    `/api/StaffReport/Objection/${ReportId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function getExcel(payload) {
  const data = await axios.get(`/api/StaffInfo/Excel`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data.data;
}

export async function getViolationsOfReport(id) {
  const data = await axios.get(
    `/api/StaffReport/ReportViolations/${id}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data.data;
}

export async function getCommentViolations(id) {
  const data = await axios.get(
    `/api/StaffReport/CommentViolations/${id}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data.data;
}

export async function getTickets(id) {
  axios.defaults.baseURL = "https://ticketingapi.shetabdahi.ir";
  const data = await axios.get(`/ProjectClientTicket/Get`, {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU2hhaHJiaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImNjZGYzMWM1LTJhNjktNDEzMi1iZmRmLTFiZTgyZTFkODE1ZiIsImp0aSI6IjQ4MzU3MmFkLTczODMtNDdjNS05Y2ZkLTA5NDU5OGY1MGVjOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlByb2plY3QiLCJleHAiOjE3NDMxNTE3MDYsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0In0.BA1TfqGWjO90iDeVMwfD0Z2r2X6cSzULLw0m-5ZnR8s`,
    },
  });
  return data.data.data;
}

export async function openTicket(payload) {
  const data = await TicketingAxios.post(`/ProjectClientTicket/Open`, payload);
  return data.data;
}

export async function getTicketById(id) {
  const userName = localStorage.getItem(constants.SHAHRBIN_MANAGEMENT_USERNAME);
  const data = await TicketingAxios.get(
    `/ProjectClientTicket/Get/${id}?userName=${userName}`
  );
  return data.data.data;
}

export async function replyTicket({ payload, id }) {
  const data = await TicketingAxios.post(
    `/ProjectClientTicket/Reply/${id}`,
    payload
  );
  return data.data.data;
}

export async function closeTicket({ payload, id }) {
  const data = await TicketingAxios.put(
    `/ProjectClientTicket/Close/${id}`,
    payload
  );
  return data.data.data;
}
