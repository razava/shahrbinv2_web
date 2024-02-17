import React, { useReducer } from "react";
import { appReducer } from "./reducer";

const initialState = {
  form: [],
  edit: {
    open: false,
    field: {},
    changes: {},
  },
  isDragging: {
    state: false,
    tool: null,
  },
  modals: [],
};
console.log(initialState.form);
export const AppStore = React.createContext(initialState);

const AppContext = ({ children }) => {
  const value = useReducer(appReducer, initialState);

  return <AppStore.Provider value={value}>{children}</AppStore.Provider>;
};

export default AppContext;
