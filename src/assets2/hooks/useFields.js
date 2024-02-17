import React, { useContext } from "react";
import { AppStore } from "../../formStore/store";
import { appActions, defaultProps } from "../../utils/constants";
import {
  createId,
  findNodeAndClone,
  findNodeAndDelete,
} from "../../utils/functions";

const useFields = () => {
  // store
  const [store, dispatch] = useContext(AppStore);

  const addField = (tool, index, parent) => {
    const field = {
      id: createId(),
      elementType: tool.type,
      elementCategory: tool.category,
      props: defaultProps[tool.type],
      items: [],
    };
    let newForm = [...store.form];
    console.log(parent);
    if (parent) {
      newForm.map((f) => {
        if (f.id === parent) {
          if (index === undefined) f.items = [...f.items, field];
          else f.items.splice(index, 0, field);
          return f;
        } else return f;
      });
    } else {
      if (index === undefined) newForm = [...newForm, field];
      else newForm.splice(index, 0, field);
    }
    dispatch({ type: appActions.ADD_FIELD, payload: newForm });
  };

  const deleteField = (field) => {
    const tree = {
      children: store.form.slice(),
    };
    const { children: newForm } = findNodeAndDelete(
      tree,
      { tree: "children", value: "id" },
      field
    );
    dispatch({ type: appActions.DELETE_FIELD, payload: newForm });
  };

  const cloneField = (field) => {
    const tree = {
      children: store.form.slice(),
    };
    console.log(tree);
    const { children: newForm } = findNodeAndClone(
      tree,
      { tree: "children", value: "id" },
      field
    );
    dispatch({ type: appActions.CLONE_FIELD, payload: newForm });
  };

  const getField = (fieldId) =>
    store.form.find((field) => String(field.id) === String(fieldId));

  const updateField = (field) => {
    dispatch({ type: appActions.UPDATE_FIELD, payload: field });
  };

  const addChange = (data = {}) => {
    dispatch({
      type: appActions.SET_EDIT_DIALOG_VISIBILITY,
      payload: { ...store.edit, changes: { ...store.edit.changes, ...data } },
    });
  };

  const openEditDialog = (field) => {
    dispatch({
      type: appActions.SET_EDIT_DIALOG_VISIBILITY,
      payload: { open: true, field, changes: {} },
    });
  };

  const closeEditDialog = () => {
    dispatch({
      type: appActions.SET_EDIT_DIALOG_VISIBILITY,
      payload: { open: false, field: {}, changes: {} },
    });
  };

  return {
    addField,
    deleteField,
    cloneField,
    getField,
    updateField,
    openEditDialog,
    closeEditDialog,
    addChange,
    store,
  };
};

export default useFields;
