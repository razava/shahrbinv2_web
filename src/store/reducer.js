export const reducer = (state, action) => {
  switch (action.type) {
    case "setSideBar":
      return { ...state, sidebarIsOpen: action.payload };
    case "setFilters":
      return { ...state, filters: action.payload };

    case "setApiCall":
      return { ...state, apiCall: action.payload };

    case "setMode":
      return { ...state, darkMode: action.payload };

    case "setRefreshPage":
      return { ...state, refresh: action.payload };

    case "setModals":
      return { ...state, modals: action.payload };

    case "setInitials":
      return { ...state, initials: action.payload };

    default:
      throw new Error("unexpected action type");
  }
};
