import React from "react";
import moment from "moment-jalaali";
import { createTheme } from "react-data-table-component";
import { toast } from "react-toastify";
import axios from "axios";
import NoData from "./components/helpers/NoData/NoData";
import { CommonAPI } from "./apiCalls";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import jalaliday from "jalaliday";
import jwtDecode from "jwt-decode";

moment.loadPersian({ usePersianDigits: true });
dayjs.extend(jalaliday);
dayjs.extend(utc);

const MAX_SIZE = 10 * 1024 * 1024;

const modalRoot = document && document.getElementById("modal-root");

export const mapUrlToNav = (location, replace) => {
  const area = location.pathname.replace(replace, "");
  if (area === "/home") return { home: true };
  if (area === "/newReports") return { newReports: true };
  if (area === "/new-ideas") return { newIdeas: true };
  else if (area === "/reports") return { reports: true };
  else if (area === "/manageUsers") return { manageUsers: true };
  else if (area === "/registerReport") return { registerReport: true };
  else if (area === "/wallet") return { wallet: true };
  else if (area === "/warrants") return { warrants: true };
  else if (area === "/ideas") return { ideas: true };
  else if (area === "/polls") return { polls: true };
  else if (area === "/managers") return { managers: true };
  else if (area === "/setting") return { setting: true };
  else if (area === "/dashboard") return { dashboard: true };
  else if (area === "/mayors") return { mayors: true };
  else if (area === "/contractors") return { contractors: true };
  else if (area === "/citizens") return { citizens: true };
  else if (area === "/executives") return { executives: true };
  else if (area === "/admanagers") return { admanagers: true };
  else if (area === "/not-addressed") return { notAddressed: true };
  else if (area === "/infos") return { infos: true };
  else if (area === "/createPoll") return { createPoll: true };
  else if (area === "/comments") return { comments: true };
  else if (area === "/categories") return { categories: true };
  else if (area === "/processes") return { processes: true };
  else if (area === "/violations") return { violations: true };
  else if (area === "/quickAccess") return { quickAccess: true };
  else if (area === "/FAQ") return { FAQ: true };
  else if (area === "/news") return { news: true };
  else if (area === "/forms") return { forms: true };
  else if (area === "/allComplaints") return { allComplaints: true };
  else if (area === "/complaints") return { complaints: true };
  else if (area === "/organizationalUnits")
    return { organizationalUnits: true };
  return {};
};

const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const persianRegex = [
  /۰/g,
  /۱/g,
  /۲/g,
  /۳/g,
  /۴/g,
  /۵/g,
  /۶/g,
  /۷/g,
  /۸/g,
  /۹/g,
];
const latinRegex = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];
const latinNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const format = (num) => {
  if (num < 1) return num;
  const formatted = ("" + num).split(".");
  const integer = formatted[0].replace(
    /(\d)(?=(?:\d{3})+(?:\.|$))|(\.\d\d?)\d*$/g,
    function (m, s1, s2) {
      return s2 || s1 + ",";
    }
  );
  const float = formatted[1] ? "." + formatted[1] : "";
  return integer + float;
};

export const deFormatt = (value) => ("" + value).replace(/,/g, "");

export const fixDigit = (num = "", toLatin = false) => {
  if (toLatin) {
    for (let i = 0; i < 10; i++) {
      num = num.toString().replace(persianRegex[i], latinNumbers[i]);
    }
  } else {
    for (let i = 0; i < 10; i++) {
      num = num.toString().replace(latinRegex[i], persianNumbers[i]);
    }
  }
  return num;
};

const customStyles = {
  pagination: {
    style: {
      "justify-content": "flex-start",
    },
  },
};

export const dataTableProps = {
  customStyles,
  paginationComponentOptions: {
    rowsPerPageText: "تعداد سطر در هر صفحه",
    rangeSeparatorText: "از",
  },
  pagination: true,
  paginationServer: true,
  paginationIconNext: (
    <span className="pagination-icon">
      <i className="fas fa-angle-left"></i>
    </span>
  ),
  paginationIconPrevious: (
    <span className="pagination-icon">
      <i className="fas fa-angle-right"></i>
    </span>
  ),
  paginationIconFirstPage: (
    <span className="pagination-icon">
      <i className="fas fa-angle-double-right"></i>
    </span>
  ),
  paginationIconLastPage: (
    <span className="pagination-icon">
      <i className="fas fa-angle-double-left"></i>
    </span>
  ),
  progressComponent: <div className="loader text-primary"></div>,
};

export const tableLightTheme = () =>
  createTheme("light", {
    text: {
      primary: "var(--text)",
    },
    sortFocus: {
      default: "#777777",
    },
    background: {
      default: "var(--bg)",
    },
    button: {
      default: "var(--btnBg)",
      disabled: "var(--white)",
    },
    action: {
      button: "var(--text)",
      hover: "var(--mute)",
      disabled: "var(--white)",
    },
  });

export const tableDarkTheme = () =>
  createTheme("dark", {
    text: {
      primary: "var(--white)",
    },
    sortFocus: {
      default: "#777777",
    },
    background: {
      default: "var(--dark)",
    },
    button: {
      default: "var(--white)",
      disabled: "var(--white)",
    },
    action: {
      button: "var(--white)",
      hover: "var(--mute)",
      disabled: "var(--white)",
    },
  });

export const reportColumn = [
  {
    name: "شماره رهگیری",
    cell: (row) => <span>{doesExist(row.trackingNumber)}</span>,
  },
  {
    name: "زیر‌گروه موضوعی",
    grow: 2,
    cell: (row) => <span>{doesExist(row.category && row.category.title)}</span>,
  },
  {
    name: "آخرین وضعیت",
    cell: (row) => <span>{doesExist(row.lastStatus)}</span>,
  },
  {
    name: "تاریخ ایجاد",
    grow: 1,
    cell: (row) => <span>{convertserverTimeToDateString(row.sent)}</span>,
  },
];

export const complaintColumn = [
  {
    name: "شماره رهگیری",
    cell: (row) => <span>{doesExist(row.trackingNumber)}</span>,
  },
  {
    name: "زیر‌گروه موضوعی",
    grow: 2,
    cell: (row) => <span>{doesExist(row.category && row.category.title)}</span>,
  },
  {
    name: "واحد",
    cell: (row) => <span>{doesExist(row.currentUnit?.title)}</span>,
  },
  {
    name: "تاریخ ایجاد",
    grow: 1,
    cell: (row) => <span>{convertserverTimeToDateString(row.created)}</span>,
  },
];

export const ideaColumn = [
  {
    name: "شماره ایده",
    cell: (row) => <span>{fixDigit(row.ideaId)}</span>,
  },
  {
    name: "شهروند",
    cell: (row) => <span>{fixDigit(row.username)}</span>,
  },
  {
    name: "عنوان",
    cell: (row) => <span>{fixDigit(row.title)}</span>,
  },
  {
    name: "گروه",
    grow: 2,
    cell: (row) => <span>{fixDigit(row.subjectGroup)}</span>,
  },
  {
    name: "تاریخ ایجاد",
    grow: 2,
    cell: (row) => (
      <span>{moment(new Date(row.createdAt)).format("jYYYY/jMM/jDD")}</span>
    ),
  },
];

export const convertserverTimeToDateString = (
  dateString,
  format = "DD MMMM YYYY ساعت HH:mm"
) => {
  if (!dateString) return "---";
  return dayjs
    .utc(dateString)
    .local()
    .calendar("jalali")
    .locale("fa")
    .format(format);
};

export const isParent = (parents, child) =>
  Array.from(parents).filter((parent) => parent === child).length > 0
    ? true
    : false;

export const dateToTimeString = (date) => {
  const dateObject = new Date(date);
  const hour = dateObject.getHours();
  const minute = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();
  return fixDigit(
    `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}:${
      seconds < 10 ? "0" + seconds : seconds
    }`
  );
};

export const overrideStrings = {
  selectSomeItems: "انتخاب کنید...",
  allItemsAreSelected: "تمام گزینه ها انتخاب شده اند.",
  selectAll: "انتخاب همه",
  search: "جستجو",
  clearSearch: "پاک کردن جستجو",
};

export const isFunction = (functionToCheck) => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
};

export const saveToLocalStorage = (key, value) => {
  if (window !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromLocalStorage = (key) => {
  if (window !== undefined) {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
  }
};

export const removeFromLocalStorage = (key) => {
  if (window !== undefined) {
    localStorage.removeItem(key);
  }
};

export const logout = (callback) => {
  removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
  removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN_EXPIRATION);
  removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_USER_ROLES);
  removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID);
  callback();
};

export const signUserIn = (res, history) => {
  console.log(res);
  const decoded = jwtDecode(res.data);
  console.log(decoded, "tok");
  console.log();
  let time = new Date(decoded.exp);
  const seconds = decoded.exp; // This is an example timestamp in seconds
  const milliseconds = seconds * 1000; // Convert seconds to milliseconds
  const date = new Date(milliseconds); // Create a date object from the milliseconds
  const formattedDate = date.toISOString(); // Format the date object to ISO string
  console.log(formattedDate);
  // new Date().toISOString();
  // ("2016-06-03T23:15:33.008Z");
  saveToLocalStorage(
    constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID,
    decoded["instance_id"]
  );
  saveToLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN, res.data);
  saveToLocalStorage(
    constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN_EXPIRATION,
    formattedDate
  );
  saveToLocalStorage(constants.SHAHRBIN_MANAGEMENT_USER_ROLES, [
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  ]);
  const currentTime = new Date().toISOString();
  saveToLocalStorage(constants.SHAHRBIN_MANAGEMENT_LOGIN_TIME, currentTime);
  const roles =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  console.log(roles);
  // const to = isManager(res.data.roles) ? appRoutes.infos : appRoutes.newReports;
  const to = hasRole(["Mayor", "Manager", "Admin"], roles)
    ? "/admin/infos"
    : hasRole(["ComplaintInspector"], roles)
    ? "/admin/complaints"
    : hasRole(["ComplaintAdmin"], roles)
    ? "/admin/complaints-categories"
    : "/admin/newReports";
  console.log(to);
  history.push(to);
};

export const isManager = (userRoles) =>
  hasRole(["Mayor", "Manager", "Admin"], userRoles);

export const getLoginDestination = (roles) => {
  console.log(roles);
  const to = hasRole(["Mayor", "Manager", "Admin"], roles)
    ? "/admin/infos"
    : hasRole(["ComplaintInspector"], roles)
    ? "/admin/complaints"
    : hasRole(["ComplaintAdmin"], roles)
    ? "/admin/complaints-categories"
    : "/admin/newReports";
  return to;
};

export const getUserRoles = () =>
  getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_USER_ROLES);

export const requiredFields = (fields) => {
  const keys = Object.keys(fields);
  let isEmpty = {};
  keys.forEach((key, i) => {
    if (!!fields[key] === false) {
      isEmpty[key] = true;
    }
  });
  if (Object.keys(isEmpty).length > 0) {
    toast("تمام کادر ها الزامی می باشند.", { type: "error" });
  }
  return isEmpty;
};

export const serverError = (res) => {
  if (res && String(res.status).startsWith("5")) {
    toast("خطایی رخ داد. لطفا از اتصال اینترنت خود اطمینان حاصل نمایید.", {
      type: "error",
    });
    return true;
  }
  return false;
};

export const unKnownError = (res) => {
  toast(
    res && res.data && res.data.message
      ? res.data.message
      : "مشکلی در ارسال درخواست به وجود آمد.",
    { type: "error" }
  );
  return true;
};

export const checkPasswordRequirements = (password) => {
  let errors = [];
  if (password.toString().length < 6) {
    errors.push("طول رمز عبور باید بیشتر از 6 رقم باشد.");
  }
  return errors;
};

export const checkLoginState = () => {
  let isLoggedIn = !!getFromLocalStorage(
    constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN
  );
  if (!isLoggedIn) {
    isLoggedIn = false;
    return isLoggedIn;
  } else {
    const expiration = getFromLocalStorage(
      constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN_EXPIRATION
    );
    if (expiration) {
      const isExpired = new Date(expiration).getTime() - Date.now() <= 0;
      if (isExpired) {
        removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
        removeFromLocalStorage(
          constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN_EXPIRATION
        );
        removeFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_USER_ROLES);
        isLoggedIn = false;
      }
    } else {
      isLoggedIn = false;
    }
  }
  return isLoggedIn;
};

export const doesExist = (x) =>
  x === null || x === undefined || x === "" ? "---" : x;

export const clearNull = (x) => (!x ? "" : x);

export const rolesDisplayName = (role) => {
  switch (role) {
    case "Admin":
      return "مدیر";
    case "Citizen":
      return "شهروند";
    case "Executive":
      return "واحد اجرایی";
    case "Operator":
      return "اپراتور";
    case "Mayor":
      return "شهردار";
    case "Contractor":
      return "پیمانکار";
    default:
      return role;
  }
};

export const getFileExtension = (url) =>
  String(url).includes(".") ? url.split(".")[1] : "";

export const download = (url) => {
  // document.getElementById("download__frame").src = ``;
  // document.getElementById(
  //   "download__frame"
  // ).src = `https://shahrbin.ashkezar.ir:83/${url}`;
};

export const downloadImage = (url) => {
  const link = document.createElement("a");
  link.href = `${
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_API_URL
      : process.env.REACT_APP_API_URL
  }/${url}`;
  link.download = url;
  link.setAttribute("target", "_blank");
  link.style.display = "none";
  document.body.appendChild(link);
  link.onclick = (e) => {
    e.stopPropagation();
  };
  link.click();
  document.body.removeChild(link);
};

export const mapObjectToFormData = (json, formData) => {
  const keys = Object.keys(json);
  keys.forEach((key) => {
    formData.set(key, json[key]);
  });
  return formData;
};

export const isTimePassed = (time) => {
  if (!time) return false;
  const targetTime = new Date(time).getTime();
  const currentTime = new Date().getTime();
  return currentTime > targetTime ? true : false;
};

export const hasRole = (userRoles = [], acceptedRoles = []) => {
  const contains = userRoles.some((r) => acceptedRoles.indexOf(r) !== -1);
  if (contains) return true;
  else return false;
};

export const accessibilityByRoles = (path) => {
  if (path === "/admin/infos")
    return [
      "Manager",
      "Mayor",
      "Executive",
      "Operator",
      "Admin",
      "Inspector",
      "ComplaintInspector",
      "ComplaintAdmin",
    ];
  if (path === "/admin/newReports")
    return [
      "Manager",
      "Mayor",
      "Executive",
      "Operator",
      "Contractor",
      "Inspector",
    ];
  if (path === "/admin/registerReport") return ["Operator"];
  if (path === "/admin/reports")
    return [
      "Manager",
      "Operator",
      "Executive",
      "Contractor",
      "Mayor",
      "Inspector",
    ];
  if (path === "/admin/manageUsers") return ["Admin"];
  if (path === "/admin/contractors") return ["Executive"];
  if (path === "/admin/createPoll") return ["Admin"];
  if (path === "/admin/polls") return ["Admin"];
  if (path === "/admin/comments") return ["Operator"];
  if (path === "/admin/categories") return ["Admin"];
  if (path === "/admin/processes") return ["Admin"];
  if (path === "/admin/organizationalUnits") return ["Admin"];
  if (path === "/admin/violations") return ["Operator"];
  if (path === "/admin/quickAccess") return ["Admin"];
  if (path === "/admin/FAQ") return ["Admin"];
  if (path === "/admin/news") return ["Admin"];
  if (path === "/admin/forms") return ["Admin"];
  if (path === "/newForm") return ["Admin"];
  if (path === "/admin/complaints") return ["ComplaintInspector"];
  if (path === "/admin/allComplaints") return ["ComplaintInspector"];
  if (path === "/admin/complaints-categories") return ["ComplaintAdmin"];
  if (path === "/admin/complaints-units") return ["ComplaintAdmin"];
  if (String(path).toLowerCase().startsWith("/admin/poll/")) return ["Admin"];
};

export const checkPassword = (value) => {
  let regex = "^";
  let errorMessage = "رمز عبور شما باید شامل حداقل ";
  const passwordRequirements = String(process.env.REACT_APP_PASSWORD)
    .split(",")
    .map((r) => r.trim());
  const hasMinimum = passwordRequirements.find((a) => a.includes("minimum"));
  const hasUppercase = passwordRequirements.indexOf("uppercase") !== -1;
  const hasLowercase = passwordRequirements.indexOf("lowercase") !== -1;
  const hasSpecialCharacters =
    passwordRequirements.indexOf("special_characters") !== -1;
  const hasNumbers = passwordRequirements.indexOf("numbers") !== -1;
  const hasWords = passwordRequirements.indexOf("words") !== -1;
  if (hasLowercase) {
    regex += "(?=.*[a-z])";
    errorMessage += "یک حرف کوچک، ";
  }
  if (hasUppercase) {
    regex += "(?=.*[A-Z])";
    errorMessage += "یک حرف بزرگ، ";
  }
  if (hasNumbers) {
    regex += "(?=.*\\d)";
    errorMessage += "یک عدد، ";
  }
  if (hasSpecialCharacters) {
    regex += "(?=.*[@$!%*?&])";
    errorMessage += "یک کاراکتر خاص ";
  }
  if (hasWords) {
    regex += "(?=.*[a-zA-Z])";
    errorMessage += "یک حرف ";
  }
  if (hasMinimum) {
    const minimum = hasMinimum.replace(/minimum/g, "").trim();
    // regex += `[${hasUppercase ? "A-Z" : ""}${hasLowercase ? "a-z" : ""}${
    //   hasNumbers ? "\\d" : ""
    // }${hasWords ? "\\w" : ""}${
    //   hasSpecialCharacters ? "@$!%*?&" : ""
    // }]{${minimum},}`;
    regex += `[A-Za-z\\d#@$^!()-_=+%*?&]{${minimum},}`;
    errorMessage += ` و طول${minimum} کاراکتر `;
  }
  regex += "$";
  errorMessage += " باشد.";
  return {
    isValid: new RegExp(regex).test(value),
    errorMessage,
  };
};

export const JalaliDate = {
  g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
};

JalaliDate.jalaliToGregorian = function (j_y, j_m, j_d) {
  j_y = parseInt(j_y);
  j_m = parseInt(j_m);
  j_d = parseInt(j_d);
  var jy = j_y - 979;
  var jm = j_m - 1;
  var jd = j_d - 1;

  var j_day_no =
    365 * jy + parseInt(jy / 33) * 8 + parseInt(((jy % 33) + 3) / 4);
  for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

  j_day_no += jd;

  var g_day_no = j_day_no + 79;

  var gy =
    1600 +
    400 *
      parseInt(
        g_day_no / 146097
      ); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
  g_day_no = g_day_no % 146097;

  var leap = true;
  if (g_day_no >= 36525) {
    /* 36525 = 365*100 + 100/4 */
    g_day_no--;
    gy +=
      100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
    g_day_no = g_day_no % 36524;

    if (g_day_no >= 365) g_day_no++;
    else leap = false;
  }

  gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;

    g_day_no--;
    gy += parseInt(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }

  for (
    var i = 0;
    g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
    i++
  )
    g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
  var gm = i + 1;
  var gd = g_day_no + 1;

  gm = gm < 10 ? "0" + gm : gm;
  gd = gd < 10 ? "0" + gd : gd;

  return [gy, gm, gd];
};

export const initialSteps = [
  {
    id: 1,
    title: "نوع نظرسنجی را انتخاب نمایید.",
    type: "radio",
    finished: false,
    role: "",
    writable: true,
  },
  {
    id: 2,
    title: "عنوان نظر سنجی را وارد نمایید.",
    type: "input",
    finished: false,
    role: "",
    writable: true,
  },
  {
    id: 3,
    title: "سوال نظرسنجی را اینجا وارد نمایید.",
    type: "editor",
    finished: false,
    role: "question",
    writable: true,
  },
  {
    id: 4,
    title: "گزینه نظرسنجی را اینجا وارد نمایید.",
    type: "editor",
    finished: false,
    role: "answer",
    writable: true,
    shortTitle: "",
  },
];

export const pollTypes = [
  {
    id: 0,
    label: "تک انتخابی",
  },
  {
    id: 1,
    label: "چند انتخابی",
  },
  {
    id: 2,
    label: "توضیحی",
  },
];

export const mapPollStatus = (status) => {
  switch (status) {
    case 0:
      return "فعال";
    case 1:
      return "تعلیق";
    case 2:
      return "منقضی شده";
    default:
      return "";
  }
};

export const mapPriorities = (priority) => {
  switch (priority) {
    case 0:
      return "خیلی کم";
    case 1:
      return "کم";
    case 2:
      return "عادی";
    case 3:
      return "زیاد";
    case 4:
      return "خیلی زیاد";
    case 5:
      return "فوری";
    default:
      return "";
  }
};

export const childrenCount = (node) => node.children.length;

export const fixURL = (path, isAPIAddress = true) => {
  return process.env.NODE_ENV === "development"
    ? `${process.env.REACT_APP_API_URL}/${isAPIAddress ? "api" : ""}${path}`
    : `${process.env.REACT_APP_API_URL}/${isAPIAddress ? "api" : ""}${path}`;
};

export const showErrorMessage = (res) => {
  // Error 500
  if (!res || String(res.status).startsWith("5")) {
    toast("خطایی رخ داد. لطفا از اتصال اینترنت خود اطمینان حاصل نمایید.", {
      type: "error",
    });
    return;
  }

  if (res && res.status === 0) {
    toast("لطفا تمام اطلاعات خواسته شده را وارد نمایید.", { type: "error" });
    return;
  }

  if (res && res.status === 428) {
    toast(res && res.data && res.data.message, { type: "success" });
    return;
  }

  // Bad Requests
  toast(
    res && res.data && res.data.message
      ? res.data.message
      : "مشکلی در ارسال درخواست به وجود آمد.",
    { type: "error" }
  );
  return;
};

export const getAuthToken = () =>
  getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);

export const callAPI = (
  {
    caller = new Promise(),
    successStatus = 200,
    payload = null,
    successCallback = (f) => f,
    errorCallback = (f) => f,
    requestEnded = (f) => f,
  },
  ...args
) => {
  const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);
  const instance = getFromLocalStorage(
    constants.SHAHRBIN_MANAGEMENT_INSTANCE
  ) || { id: 0 };
  const source = axios.CancelToken.source();
  caller(token, payload, source, instance, ...args)
    .then((res) => {
      requestEnded();
      // if server didn't respond
      if (res === undefined) {
        toast("مشکلی در ارسال درخواست به سرور به وجود آمد", { type: "error" });
        return;
      }

      // if request succeeded
      if (res.status === successStatus) {
        successCallback(res);
        return;
      } else if (res.status === 401) {
        showErrorMessage(res);
        if (token) {
          logout(() => {
            window.location.pathname = "/login";
          });
        }
      } else {
        showErrorMessage(res);
        errorCallback(res);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      requestEnded();
    });
};

export const constants = {
  SHAHRBIN_MODE: "SHAHRBIN_MODE",
  SHAHRBIN_MANAGEMENT_AUTH_TOKEN: "SHAHRBIN_MANAGEMENT_AUTH_TOKEN",
  SHAHRBIN_MANAGEMENT_AUTH_TOKEN_EXPIRATION:
    "SHAHRBIN_MANAGEMENT_AUTH_TOKEN_EXPIRATION",
  SHAHRBIN_MANAGEMENT_USER_ROLES: "SHAHRBIN_MANAGEMENT_USER_ROLES",
  SHAHRBIN_MANAGEMENT_LOGIN_TIME: "SHAHRBIN_MANAGEMENT_LOGIN_TIME",
  SHAHRBIN_MANAGEMENT_INSTANCE: "SHAHRBIN_MANAGEMENT_INSTANCE",
  SHAHRBIN_MANAGEMENT_INSTANCE_ID: "SHAHRBIN_MANAGEMENT_INSTANCE_ID",
};

export const appRoutes = {
  newReports: "/admin/newReports",
  complaints: "/admin/complaints",
  allComplaints: "/admin/allComplaints",
  infos: "/admin/infos",
  registerReport: "/admin/registerReport",
  reports: "/admin/reports",
  contractors: "/admin/contractors",
  manageUsers: "/admin/manageUsers",
  polls: "/admin/polls",
  poll: "/admin/poll/:id",
  comments: "/admin/comments",
  categories: "/admin/categories",
  processes: "/admin/processes",
  organizationalUnits: "/admin/organizationalUnits",
  violations: "/admin/violations",
  quickAccess: "/admin/quickAccess",
  FAQ: "/admin/FAQ",
  news: "/admin/news",
  forms: "/admin/forms",
  newForm: "/newForm",
  complaintsCategories: "/admin/complaints-categories",
  complaintsUnits: "/admin/complaints-units",
  login: "/",
};

export const randomColor = () =>
  `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
    Math.random() * 255
  )}, ${Math.round(Math.random() * 255)})`;

export const formatLabel = (str, maxwidth) => {
  var sections = [];
  var words = str.split(" ");
  var temp = "";

  words.forEach(function (item, index) {
    if (temp.length > 0) {
      var concat = temp + " " + item;

      if (concat.length > maxwidth) {
        sections.push(temp);
        temp = "";
      } else {
        if (index == words.length - 1) {
          sections.push(concat);
          return;
        } else {
          temp = concat;
          return;
        }
      }
    }

    if (index == words.length - 1) {
      sections.push(item);
      return;
    }

    if (item.length < maxwidth) {
      temp = item;
    } else {
      sections.push(item);
    }
  });

  return sections;
};

export const getRegions = () => {
  return new Promise((resolve) => {
    callAPI({
      caller: CommonAPI.getRegions,
      successCallback: (res) => {
        resolve(res.data);
      },
    });
  });
};

export const findRegionId = (regions, geofences) => {
  const region = geofences.find((g) => g.type === "9100");
  const regionId =
    regions.find((r) => String(r.parsimapCode) === String(region.id))?.id || "";
  return regionId;
};

export const jalaaliMonth = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const jalaalWeekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

export const getDatePickerFormat = (date) => {
  if (date) {
    const dateString = date.split("T")[0].replace(/-/g, "/");
    const jalaaliDate = moment(dateString).format("jYYYY/jMM/jDD");
    const dateArray = fixDigit(jalaaliDate, true).split("/");
    const dateObject = {
      year: parseInt(dateArray[0]),
      month: parseInt(dateArray[1]),
      day: parseInt(dateArray[2]),
    };
    return dateObject;
  } else return "";
};

export const createQueryParams = (url, queries = {}) => {
  const myUrl = new URL(url);
  // let params = new URLSearchParams()
  const {
    fromDate,
    toDate,
    query,
    categoryIds,
    organs,
    regions,
    roles,
    page,
    perPage,
    statuses,
  } = queries;
  console.log(query);
  if (page) myUrl.searchParams.append("PageNumber", page);
  if (perPage) myUrl.searchParams.append("PageSize", perPage);
  if (fromDate) myUrl.searchParams.append("SentFromDate", fromDate);
  if (toDate) myUrl.searchParams.append("SentToDate", toDate);
  if (query) myUrl.searchParams.set("Query", query);
  if (categoryIds && categoryIds.length > 0)
    categoryIds.forEach((c) => myUrl.searchParams.append("CategoryIds", c));
  if (organs && organs.length > 0)
    organs.forEach((o) => myUrl.searchParams.append("ExecutiveIds", o.id));
  if (regions && regions.length > 0)
    regions.forEach((r) => myUrl.searchParams.append("RegionIds", r.id));
  if (roles && roles.length > 0)
    roles.forEach((r) => myUrl.searchParams.append("RoleNames", r.roleName));
  if (statuses && statuses.length > 0)
    statuses.forEach((r) =>
      myUrl.searchParams.append("CurrentStates", r.value)
    );
  const updatedUrl = myUrl.toString();
  console.log(updatedUrl);
  return myUrl;
};

export const defaultFilters = {
  fromDate: "",
  toDate: "",
  query: "",
  categoryIds: [],
  regions: [],
  organs: [],
  roles: [],
  statuses: [],
};

export const lastStatuses = [
  {
    id: "ls-1",
    title: "در حال بررسی",
    value: 0,
  },
  {
    id: "ls-2",
    title: "پایان‌یافته",
    value: 1,
  },
  {
    id: "ls-3",
    title: "ارجاع به واحد بازرسی",
    value: 2,
  },
  {
    id: "ls-4",
    title: "تایید‌شده",
    value: 3,
  },
];

export const showSizeError = () => {
  toast("حجم پیوست‌ها نمی‌تواند از 10 مگابایت بیشت باشد.", { type: "error" });
};

export const showExtensionError = () => {
  toast("فرمت فایل انتخابی مجاز نیست.", { type: "error" });
};

export const checkOverlAllSize = (attachments) => {
  const overallSize = attachments.reduce((t, a) => t + a.size, 0);
  if (overallSize > MAX_SIZE) {
    return false;
  } else return true;
};

export const isImage = (path) =>
  [
    "jpg",
    "jpeg",
    "jpe",
    "jif",
    "jfif",
    "jfi",
    "png",
    "gif",
    "tiff",
    "tif",
    "svg",
    "svgz",
  ].some((ext) => ext === getExtension(path).toLowerCase());

export const checkExtensions = (path) => {
  const allowedExtensions = [
    "jpg",
    "jpeg",
    "jpe",
    "jif",
    "jfif",
    "jfi",
    "png",
    "gif",
    "tiff",
    "tif",
    "svg",
    "svgz",
    "pdf",
    "mkv",
    "mp4",
    "mov",
    "3gp",
    "ogg",
    "docx",
    "doc",
    "pptx",
    "ppt",
    "xlsx",
    "xls",
    "xlsm",
  ];

  const extension = getExtension(path);
  return allowedExtensions.indexOf(extension.toLowerCase()) !== -1;
};

export const getExtension = (path) =>
  String(path).split(".")[String(path).split(".").length - 1];

export const isFile = (media) => media instanceof File;

export const closeModal = () => {
  modalRoot.classList.remove("active");
};

export const openModal = () => {
  modalRoot.classList.add("active");
};
