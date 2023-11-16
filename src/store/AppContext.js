import React, { useReducer } from "react";
import { constants, getFromLocalStorage } from "../helperFuncs";
import { reducer } from "./reducer";

const initialState = {
  sidebarIsOpen: false,
  apiCall: false,
  darkMode: false,
  refresh: {
    call: 0,
    page: "",
  },
  filters: {
    fromDate: "",
    toDate: "",
    query: "",
    categoryIds: [],
    regions: [],
    organs: [],
    roles: [],
    statuses: [],
  },
  modals: [],
  initials: {
    regions: [],
    categories: {},
    instance: {},
  },
};

export const AppStore = React.createContext({
  sidebarIsOpen: false,
  apiCall: false,
  darkMode: false,
  refresh: {
    call: 0,
    page: "",
  },
  filters: {},
});

const AppContext = ({ children }) => {
  const darkMode = getFromLocalStorage(constants.SHAHRBIN_MODE);

  const state = { ...initialState, darkMode };

  const value = useReducer(reducer, state);

  return (
    <>
      <AppStore.Provider value={value}>{children}</AppStore.Provider>
    </>
  );
};

export default AppContext;
