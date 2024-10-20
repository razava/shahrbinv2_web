import axios from "axios";
import {
  constants,
  getFromLocalStorage,
  createQueryParams,
} from "./helperFuncs";
import TicketingAxios from "./api/TicketBaseUrl";
import { toast } from "react-toastify";

const prefix = window.__ENV__?.REACT_APP_API_URL;
const prefix2 = "https://ticketingapi.shetabdahi.ir";
// ? "https://192.168.1.11"
// "https://192.168.1.130:3749"
// https://shahrbin.ashkezar.ir:8181
// const prefix = process.env.REACT_APP_API_URL;
axios.interceptors.response.use(
  function (response) {
    if (response.status == 200 || response.status == 201) {
      if (response.data?.message) {
        toast(response.data?.message, { type: "success" });
      }
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export class ReportsAPI {
  static getTasks(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/StaffReport?fromRoleId=${
      payload ? payload : ""
    }`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static sendSatisfaction(token, payload, source, instance, reportId) {
    return axios
      .post(`${prefix}/api/StaffReport/Satisfaction/${reportId}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getReportHistory(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/StaffReport/ReportHistory/${payload}`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
  static getPossibleTransitions(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/StaffReport/PossibleTransitions/${payload}`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getReports(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/StaffInfo/Reports`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getReportLocations(
    token,
    payload,
    source,
    instance,
    {
      page = 1,
      perPage = 10,
      fromDate = "",
      toDate = "",
      query = "",
      categoryIds = [],
      stages = [],
      priorities = [],
      regions = [],
      organs = [],
    }
  ) {
    let newFromDate = fromDate === null ? "" : `&SentFromDate=${fromDate}`;
    let newToDate = toDate === null ? "" : `&SentToDate=${toDate}`;
    let categoryParam = categoryIds
      .map((categoryId) => `categoryIds=${categoryId}`)
      .join("&");
    if (categoryIds.length > 0) categoryParam = "&" + categoryParam;

    let stageParam = stages.map((stageId) => `stageIds=${stageId}`).join("&");
    if (stages.length > 0) stageParam = "&" + stageParam;

    let priorityParam = priorities
      .map((priorityId) => `priorityIds=${priorityId}`)
      .join("&");
    if (priorities.length > 0) priorityParam = "&" + priorityParam;

    let regionParam = regions
      .map((region) => `regionIds=${region.id}`)
      .join("&");
    if (regions.length > 0) regionParam = "&" + regionParam;

    let organParam = organs
      .map((organId) => `ExecutiveIds=${organId.id}`)
      .join("&");
    if (organs.length > 0) organParam = "&" + organParam;
    const queryParam = !query ? "" : `&query=${query}`;
    return axios
      .get(
        `${prefix}/api/Info/Locations?pageNumber=${page}&pageSize=${perPage}${newFromDate}${newToDate}${queryParam}${categoryParam}${stageParam}${priorityParam}${regionParam}${organParam}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getExcel(queries, instance) {
    const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
    const initialUrl = `${prefix}/api/StaffInfo/Excel`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
        responseType: "blob",
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getTask(token, id, source, instance) {
    return axios
      .get(`${prefix}/api/StaffReport/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getOperatorTasks(
    token,
    payload,
    source,
    instance,
    page,
    perPage,
    fromDate,
    toDate,
    query
  ) {
    return axios
      .get(
        `${prefix}/api/Task/NewReports?pageNumber=${page}&pageSize=${perPage}&fromDate=${fromDate}&toDate=${toDate}&query=${query}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getPossibleSources(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/StaffReport/PossibleSources`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static createTransition(token, payload, source, instance, id) {
    return axios
      .post(`${prefix}/api/StaffReport/MakeTransition/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static createStage(token, payload, source, instance, id) {
    return axios
      .post(`${prefix}/api/StaffReport/Review/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static registerByOperator(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/StaffReport/RegisterByOperator`, payload, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }
  static confirmRequestByOperator(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/StaffReport/Accept/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static sendMessageToCitizen(token, payload, source, instance, id) {
    return axios
      .post(`${prefix}/api/StaffReport/MessageToCitizen/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getComments(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/StaffReport/Comments`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static updateComment(token, payload, source, instance, commentId) {
    return axios
      .post(`${prefix}/api/StaffReport/ReplyComment/${commentId}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static deleteComment(token, payload, source, instance, commentId) {
    return axios
      .delete(`${prefix}/api/StaffReport/Comment/${commentId}`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static updateCitizenRequest(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/StaffReport/Comment/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static updateReport(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/StaffReport/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }
}

export class ExecutivesAPI {
  static getExecutives(token, payload, source, instance) {
    return axios
      .get(
        `https://5fd9bd406cf2e7001737e8eb.mockapi.io/api/${instance?.id}/v1/executives`
      )
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class DistrictAPI {
  static getDistricts(token, payload, source, instance) {
    return axios
      .get(
        `https://5fd9bd406cf2e7001737e8eb.mockapi.io/api/${instance?.id}/v1/distinct`
      )
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class CommonAPI {
  static getSubjectGroups(token, payload, source, instance) {
    const Instance =
      getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID) || {};
    return axios
      .get(`${prefix}/api/StaffCommon/Categories`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getTickets(token, payload, source, instance, queries) {
    const userName = localStorage.getItem(
      constants.SHAHRBIN_MANAGEMENT_USERNAME
    );
    const initialUrl = `${prefix2}/ProjectClientTicket/Get?userName=${userName}`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl)
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getTicketCategories(token, payload, source, instance, queries) {
    const userName = localStorage.getItem(
      constants.SHAHRBIN_MANAGEMENT_USERNAME
    );
    return TicketingAxios.get(
      `${prefix2}/ProjectCommonCategory/Get?userName=${userName}`
    )
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getEducationList(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/StaffCommon/Educations`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getStages(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/Common/Stages`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getPriorities(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/Common/Priorities`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getYazdRegions(token, payload, source, instance) {
    const instanceId =
      getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID) || {};
    const cityId = getFromLocalStorage(
      constants.SHAHRBIN_MANAGEMENT_INSTANCE
    ).cityId;
    return axios
      .get(`${prefix}/api/StaffCommon/Regions/${cityId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getRegions(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/StaffCommon/Regions/${instance.cityId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getAshkezarRegions(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/Common/RegionsByName/اشکذر`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static postFiles(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/Files`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class AuthenticateAPI {
  static signin(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/Authenticate/LoginStaff`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }
  static resetPassword(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminUserManagement/Password/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static changePassword(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminUserManagement/Password/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static registerExecutive(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/Authenticate/RegisterExecutive`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static registerContractor(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/AdminUserManagement/RegisterContractor`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static registerMayor(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/Authenticate/registerMayor`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static registerManager(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/Authenticate/registerManager`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static registerWithRoles(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/AdminUserManagement`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getuserRegions(token, id, source, instance) {
    const instanceId = getFromLocalStorage(
      constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
    );
    return axios
      .get(`${prefix}/api/AdminUserManagement/Regions/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }
}

export class UserInfoAPI {
  static getAllUsers(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/AdminUserManagement/AllUsers`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }
  static getContractors(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/AdminUserManagement/GetContractors`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getRolesForCreate(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/AdminUserManagement/Roles`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getRoles(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/StaffCommon/Roles`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getUserRoles(token, id, source, instance) {
    return axios
      .get(`${prefix}/api/AdminUserManagement/Roles/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static saveUserRegions(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminUserManagement/Regions/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static saveRoles(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminUserManagement/Roles/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static registerUser(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/Authenticate/RegisterWithRoles`, payload, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getUser(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/Authenticate`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static updateUser(token, payload, source, instance) {
    console.log(payload);
    return axios
      .put(`${prefix}/api/Authenticate`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          // "Content-Type": "multipart/form-data",
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static updateUserById(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminUserManagement/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }
}

export class InfoAPI {
  static getInfos(token, payload, source, instance, queries = {}) {
    const categoryIdsParams = queries.categoryIds
      ? queries.categoryIds.map((c) => `CategoryIds=${c}`).join("&")
      : "";

    return axios
      .get(
        `${prefix}/api/Info/Summary2?SentFromDate=${
          queries.fromDate || ""
        }&SentToDate=${
          queries.toDate || ""
        }&${categoryIdsParams}&GroupCategories=${!!queries.groupCategories}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          cancelToken: source.token,
        }
      )
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getListCharts(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/StaffInfo/ListChart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getChart(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/StaffInfo/Charts/${payload?.code}?parameter=${payload?.parameter}`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getReportById(token, id, source, instance) {
    return axios
      .get(`${prefix}/api/StaffReport/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getExecutives(token, id, source, instance) {
    return axios
      .get(`${prefix}/api/StaffCommon/Executives`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }
}

export class PollAPI {
  static createPoll(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/AdminPolls`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static publishPoll(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminPolls/Edit/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getAllPolls(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/AdminPolls/All`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static changePollStatus(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminPolls/Edit/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }

  static getPollResults(token, payload, source, instance, id) {
    return axios
      .get(`${prefix}/api/AdminPolls/Summary/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: source.token,
      })
      .then((res) => res)
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          return err.response;
        }
      });
  }
}

export class ParsiMap {
  static reverse(token, payload, source, instance) {
    return axios
      .get(
        `${prefix}/api/Map/Backward/${instance?.id}/${payload.longitude}/${payload.latitude}`
      )
      .then((res) => res)
      .catch((err) => err.response);
  }

  static routing(address) {
    return axios
      .get(`${prefix}/api/Map/Forward/${address}`)
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class ActorsAPI {
  static getActorRegions(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/StaffCommon/UserRegions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getActors(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/Actors`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class OrganizationalUnitAPI {
  static getOrgans(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/OrganizationalUnit`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static createUnit(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/AdminOrganizationalUnit`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static updateUnit(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminOrganizationalUnit/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getUnit(token, payload, source, instance, id) {
    return axios
      .get(`${prefix}/api/AdminOrganizationalUnit/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getAllOrgans(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/AdminOrganizationalUnit/All`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getOrgansActors(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/OrganizationalUnit/Actors`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class ProcessesAPI {
  static getProcesses(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/Processes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getProcessById(token, payload, source, instance, id) {
    return axios
      .get(`${prefix}/api/AdminProcesses/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static createProcess(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/AdminProcesses`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static updateProcess(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminProcesses/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getExecutives(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/AdminProcesses/Executives`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class ConfigurationsAPI {
  static getForms(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/AdminForms`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getCategories(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/StaffCommon/Categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getOperators(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/AdminCategory/Operators`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getAllCategories(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/AdminCategory/All`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getProcesses(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/AdminProcesses`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          // "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static createCategory(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/AdminCategory`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static deleteCategory(token, payload, source, instance) {
    return axios
      .delete(`${prefix}/api/AdminCategory/${payload}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static updateCategory(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminCategory/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class ViolationAPI {
  static getViolations(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/StaffReport/ReportViolations`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getCommentViolations(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/StaffReport/CommentViolations`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static handleViolation(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/StaffReport/ReportViolations/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static handleCommentViolation(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/StaffReport/CommentViolations/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class QuickAccessAPI {
  static getAccesses(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/AdminQuickAccess`;
    const wholeUrl = createQueryParams(initialUrl, queries);
    return axios
      .get(wholeUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static createAccess(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/AdminQuickAccess`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static editAccess(token, payload, source, instance, id) {
    return axios
      .put(`${prefix}/api/AdminQuickAccess/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static deleteAccess(token, payload, source, instance) {
    return axios
      .delete(`${prefix}/api/AdminQuickAccess/${payload}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class InstanceManagementAPI {
  static getInstances(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/StaffCommon/ShahrbinInstances`;
    return axios
      .get(initialUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getInstanceById(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/StaffCommon/MyShahrbinInstance`;
    return axios
      .get(initialUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class ComplaintsAPI {
  static getComplaints(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintTask`;
    return axios
      .get(initialUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getLiveComplaints(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintTask/All?complaintStates=1`;
    return axios
      .get(initialUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getFinishedComplaints(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintTask/All?complaintStates=1&DeadlineReached=true`;
    return axios
      .get(initialUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getAllComplaints(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintTask/All`;
    return axios
      .get(initialUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getComplaintById(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintTask/${payload}`;
    return axios
      .get(initialUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static referComplaint(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintTask/refer`;
    return axios
      .post(initialUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static finishComplaint(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintTask/finish`;
    return axios
      .post(initialUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getComplaintsCategories(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintCategory`;
    return axios
      .get(initialUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getComplaintsUnits(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintOrganizationalUnit`;
    return axios
      .get(initialUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static createCategoryComplaint(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintCategory`;
    return axios
      .post(initialUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static updateCategoryComplaint(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintCategory`;
    return axios
      .put(initialUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static createOrganizationalUnitComplaint(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintOrganizationalUnit`;
    return axios
      .post(initialUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static updateOrganizationalUnitComplaint(token, payload, source, instance) {
    const initialUrl = `${prefix}/api/complaintOrganizationalUnit`;
    return axios
      .put(initialUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }
}
