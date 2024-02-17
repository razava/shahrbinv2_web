import { appActions } from "../utils/constants";
import { createId } from "../utils/functions";

export const appReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case appActions.UPDATE_LIST: {
      return { ...state, form: action.payload };
    }
    case appActions.ADD_FIELD: {
      return { ...state, form: action.payload };
    }
    case appActions.DELETE_FIELD: {
      return { ...state, form: action.payload };
    }
    case appActions.CLONE_FIELD: {
      return { ...state, form: action.payload };
    }
    case appActions.SET_EDIT_DIALOG_VISIBILITY:
      return { ...state, edit: action.payload };

    case appActions.UPDATE_FIELD: {
      const newForm = state.form.map((field) => {
        if (String(field.id) === String(action.payload.id))
          return { ...field, ...action.payload };
        else return field;
      });
      return { ...state, form: newForm };
    }

    case appActions.SET_DRAGGING:
      return { ...state, isDragging: action.payload };

    case appActions.SET_MODALS:
      return { ...state, modals: action.payload };
  }
};
