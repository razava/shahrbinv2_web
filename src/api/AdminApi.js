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

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async function (error) {
//     // const originalRequest = error.config;
//     // if (error.response.status === 403) {
//     //   window.location.href = "/";
//     //   deleteCookie("Sootzani_Admin_Token");
//     //   deleteCookie("Sootzani_Admin_Refresh_Token");
//     //   localStorage.removeItem("privateKey");
//     // }
//     // if (error.response.status === 401) {
//     //   if (!originalRequest._retry) {
//     //     originalRequest._retry = true;
//     //     const accessToken = getCookie("Sootzani_Admin_Token");
//     //     const refreshToken = getCookie("Sootzani_Admin_Refresh_Token");
//     //     //accessToken && refreshToken && !isRefreshing
//     //     if (!isRefreshing) {
//     //       isRefreshing = true;

//     //       try {
//     //         // Perform token refresh
//     //         const data = await RefreshToken({
//     //           token: accessToken,
//     //           refreshToken: refreshToken,
//     //         });

//     //         // Retry the original request
//     //         return axios(originalRequest);
//     //       } catch (refreshError) {
//     //         console.error("Token refresh failed", refreshError);
//     //         // Handle refresh error, e.g., redirect to login page
//     //         return Promise.reject(refreshError);
//     //       } finally {
//     //         isRefreshing = false;
//     //       }
//     //     }
//     //   }
//     // }

//     // For other errors or if refresh token logic is not applicable
//     return Promise.reject(error);
//   }
// );

const instanceId = () => {
  const id = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID);
  return id;
};

export async function getNews() {
  const data = await axios.get(`/api/${instanceId()}/AdminNews`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data.data;
}

export async function getNewsById(id) {
  const data = await axios.get(`/api/${instanceId()}/AdminNews/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data.data;
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
  const response = await axios.get(`/api/${instanceId()}/AdminCategory/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return response.data.data;
}

export async function getForms() {
  const data = await axios.get(`/api/${instanceId()}/AdminForms`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data.data;
}

export async function getFormById(id) {
  const data = await axios.get(`/api/${instanceId()}/AdminForms/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data.data;
}

export async function postForm(payload) {
  const data = await axios.post(`/api/${instanceId()}/AdminForms`, payload, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function editForm({ id, payload }) {
  const data = await axios.put(
    `/api/${instanceId()}/AdminForms/${id}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function deleteForm(id) {
  const data = await axios.delete(`/api/${instanceId()}/AdminForms/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  return data.data;
}

export async function getOperatorCategories(id) {
  const data = await axios.get(
    `/api/${instanceId()}/AdminUserManagement/Categories/${id}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data.data;
}

export async function putOperatorCategories({ id, payload }) {
  const data = await axios.put(
    `/api/${instanceId()}/AdminUserManagement/Categories/${id}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function deleteOrganizationalUnit(id) {
  const data = await axios.delete(
    `/api/${instanceId()}/AdminOrganizationalUnit/${id}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}

export async function deleteProcess(id) {
  const data = await axios.delete(`/api/${instanceId()}/AdminProcesses/${id}`, {
    headers: { Authorization: `Bearer ${Token}` },
  });
  console.log(data);
  return data;
}

export async function getUserRolesByAdmin(id) {
  const data = await axios.get(
    `/api/${instanceId()}/AdminUserManagement/Roles/${id}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data.data;
}

export async function getUserReports(id) {
  const data = await axios.get(
    `/api/${instanceId()}/AdminUserManagement/UserReports/${id}`,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data.data;
}

export async function putPolls({ id, payload }) {
  const data = await axios.put(
    `/api/${instanceId()}/AdminPolls/Edit/${id}`,
    payload,
    {
      headers: { Authorization: `Bearer ${Token}` },
    }
  );
  return data.data;
}
