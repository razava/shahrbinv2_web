import axios from "axios";
import {
  constants,
  getFromLocalStorage,
  createQueryParams,
} from "./helperFuncs";

const prefix =
  process.env.REACT_APP_API_URL;
    // ? "https://192.168.1.11"
   // "https://192.168.1.130:3749"
// https://shahrbin.ashkezar.ir:8181
// const prefix = process.env.REACT_APP_API_URL;

export class ReportsAPI {
  static getTasks(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/${instance?.id}/Task?fromRoleId=${
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

  static getReports(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/${instance?.id}/Info/Report`;
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
        `${prefix}/api/${instance?.id}/Info/Locations?pageNumber=${page}&pageSize=${perPage}${newFromDate}${newToDate}${queryParam}${categoryParam}${stageParam}${priorityParam}${regionParam}${organParam}`,
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
    const initialUrl = `${prefix}/api/${instance?.id}/Info/Excel`;
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
      .get(`${prefix}/api/${instance?.id}/Task/${id}`, {
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
        `${prefix}/api/${instance?.id}/Task/NewReports?pageNumber=${page}&pageSize=${perPage}&fromDate=${fromDate}&toDate=${toDate}&query=${query}`,
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
      .get(`${prefix}/api/${instance?.id}/Task/PossibleSources`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static createTransition(token, payload, source, instance, id) {
    return axios
      .post(`${prefix}/api/${instance?.id}/Task/${id}`, payload, {
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
      .post(`${prefix}/api/${instance?.id}/Task/Review/${id}`, payload, {
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
      .post(
        `${prefix}/api/${instance?.id}/Report/RegisterByOperator`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
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

  static sendMessageToCitizen(token, payload, source, instance, id) {
    return axios
      .post(
        `${prefix}/api/${instance?.id}/Task/MessageToCitizen/${id}`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
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

  static getComments(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/${instance?.id}/Task/Comments`;
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
      .put(
        `${prefix}/api/${instance?.id}/Task/Comments/${commentId}`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
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

  static deleteComment(token, payload, source, instance, commentId) {
    return axios
      .delete(`${prefix}/api/${instance?.id}/Task/Comments/${commentId}`, {
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
      .put(
        `${prefix}/api/${instance?.id}/Report/UpdateComments/${id}`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
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

  static updateReport(token, payload, source, instance) {
    return axios
      .put(`${prefix}/api/${instance?.id}/Report`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
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
    return axios
      .get(`${prefix}/api/${instance?.id}/Common/Categories`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getEducationList(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/${instance?.id}/Common/Educations`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getStages(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/${instance?.id}/Common/Stages`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getPriorities(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/${instance?.id}/Common/Priorities`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getYazdRegions(token, payload, source, instance) {
    return axios
      .get(
        `${prefix}/api/${instance?.id}/Common/RegionsByName/${process.env.REACT_APP_REGION_FA}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getRegions(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/${instance?.id}/Common/Regions/${instance.cityId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getAshkezarRegions(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/${instance?.id}/Common/RegionsByName/اشکذر`, {
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
      .post(
        `${prefix}/api/${instance?.id}/Authenticate/LoginAdminUser`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
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
  static resetPassword(token, payload, source, instance, id) {
    return axios
      .put(
        `${prefix}/api/${instance?.id}/Authenticate/Password/${id}`,
        payload,
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

  static changePassword(token, payload, source, instance) {
    return axios
      .put(`${prefix}/api/${instance?.id}/Authenticate/Password`, payload, {
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
      .post(
        `${prefix}/api/${instance?.id}/Authenticate/RegisterExecutive`,
        payload,
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

  static registerContractor(token, payload, source, instance) {
    return axios
      .post(
        `${prefix}/api/${instance?.id}/Authenticate/RegisterContractor`,
        payload,
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

  static registerMayor(token, payload, source, instance) {
    return axios
      .post(
        `${prefix}/api/${instance?.id}/Authenticate/registerMayor`,
        payload,
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

  static registerManager(token, payload, source, instance) {
    return axios
      .post(
        `${prefix}/api/${instance?.id}/Authenticate/registerManager`,
        payload,
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

  static registerWithRoles(token, payload, source, instance) {
    return axios
      .post(
        `${prefix}/api/${instance?.id}/Authenticate/registerWithRoles`,
        payload,
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

  static getuserRegions(token, id, source, instance) {
    return axios
      .get(`${prefix}/api/${instance?.id}/Authenticate/Regions/${id}`, {
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
    const initialUrl = `${prefix}/api/${instance?.id}/Authenticate/GetAllUsers`;
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
      .get(`${prefix}/api/${instance?.id}/Authenticate/RolesForCreate`, {
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
      .get(`${prefix}/api/${instance?.id}/Authenticate/Roles`, {
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
      .get(`${prefix}/api/${instance?.id}/Authenticate/Roles/${id}`, {
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
      .post(
        `${prefix}/api/${instance?.id}/Authenticate/Regions/${id}`,
        payload,
        {
          headers: {
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

  static saveRoles(token, payload, source, instance, id) {
    return axios
      .post(`${prefix}/api/${instance?.id}/Authenticate/Roles/${id}`, payload, {
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
      .post(
        `${prefix}/api/${instance?.id}/Authenticate/RegisterWithRoles`,
        payload,
        {
          headers: {
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

  static getUser(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/UserInformation`, {
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
    return axios
      .put(`${prefix}/api/UserInformation`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
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
      .put(`${prefix}/api/UserInformation/${id}`, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
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
        `${prefix}/api/${instance?.id}/Info/Summary2?SentFromDate=${
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
      .get(`${prefix}/api/${instance?.id}/Info/ListCharts`, {
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
    const initialUrl = `${prefix}/api/${instance?.id}/Info/Chart/${payload}`;
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
      .get(`${prefix}/api/${instance?.id}/Info/Report/${id}`, {
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
      .get(`${prefix}/api/${instance?.id}/Info/Executives`, {
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
      .post(`${prefix}/api/${instance?.id}/Polls`, payload, {
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
      .put(`${prefix}/api/${instance?.id}/Polls/Edit/${id}`, payload, {
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
    const initialUrl = `${prefix}/api/${instance?.id}/Polls/All`;
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
      .put(
        `${prefix}/api/${instance?.id}/Polls/Status/${id}?pollState=${payload}`,
        null,
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

  static getPollResults(token, payload, source, instance, id) {
    return axios
      .get(`${prefix}/api/${instance?.id}/Polls/Summary/${id}`, {
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
  static reverse(coordinates) {
    return axios
      .get(
        `${prefix}/api/Map/Backward/${coordinates.longitude}/${coordinates.latitude}`
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
      .get(`${prefix}/api/${instance?.id}/Actors/Regions`, {
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
      .get(`${prefix}/api/${instance?.id}/Actors`, {
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
      .get(`${prefix}/api/${instance?.id}/OrganizationalUnit`, {
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
      .post(`${prefix}/api/${instance?.id}/OrganizationalUnit`, payload, {
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
      .put(`${prefix}/api/${instance?.id}/OrganizationalUnit/${id}`, payload, {
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
      .get(`${prefix}/api/${instance?.id}/OrganizationalUnit/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getAllOrgans(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/${instance?.id}/OrganizationalUnit/All`;
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
      .get(`${prefix}/api/${instance?.id}/OrganizationalUnit/Actors`, {
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
      .get(`${prefix}/api/${instance?.id}/Processes`, {
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
      .get(`${prefix}/api/${instance?.id}/Processes/${id}`, {
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
      .post(`${prefix}/api/${instance?.id}/Processes`, payload, {
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
      .put(`${prefix}/api/${instance?.id}/Processes/${id}`, payload, {
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
      .get(`${prefix}/api/${instance?.id}/Processes/Executives`, {
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
  static getCategories(token, payload, source, instance) {
    return axios
      .get(`${prefix}/api/${instance?.id}/Configurations/Categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);
  }

  static getAllCategories(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/${instance?.id}/Configurations/AllCategories`;
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
    const initialUrl = `${prefix}/api/${instance?.id}/Configurations/Processes`;
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

  static createCategory(token, payload, source, instance) {
    return axios
      .post(`${prefix}/api/${instance?.id}/Configurations/Category`, payload, {
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
      .delete(
        `${prefix}/api/${instance?.id}/Configurations/Category/${payload}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => res)
      .catch((err) => err.response);
  }

  static updateCategory(token, payload, source, instance, id) {
    return axios
      .put(
        `${prefix}/api/${instance?.id}/Configurations/Category/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => res)
      .catch((err) => err.response);
  }
}

export class ViolationAPI {
  static getViolations(token, payload, source, instance, queries) {
    const initialUrl = `${prefix}/api/${instance?.id}/Violation`;
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
      .put(`${prefix}/api/${instance?.id}/Violation/${id}`, payload, {
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
    const initialUrl = `${prefix}/api/${instance?.id}/QuickAccess`;
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
      .post(`${prefix}/api/${instance?.id}/QuickAccess`, payload, {
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
      .put(`${prefix}/api/${instance?.id}/QuickAccess/${id}`, payload, {
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
      .delete(`${prefix}/api/${instance?.id}/QuickAccess/${payload}`, {
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
    const initialUrl = `${prefix}/api/InstanceManagement`;
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
    const initialUrl = `${prefix}/api/InstanceManagement/${payload}`;
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
