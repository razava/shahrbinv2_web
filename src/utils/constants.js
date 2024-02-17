export const appActions = {
  UPDATE_LIST: "UPDATE_LIST",
  ADD_FIELD: "ADD_FIELD",
  DELETE_FIELD: "DELETE_FIELD",
  CLONE_FIELD: "CLONE_FIELD",
  UPDATE_FIELD: "UPDATE_FIELD",
  SET_EDIT_DIALOG_VISIBILITY: "SET_EDIT_DIALOG_VISIBILITY",
  SET_DRAGGING: "SET_DRAGGING",
  SET_MODALS: "SET_MODALS",
};

export const defaultProps = {
  text: {
    label: "عنوان",
    placeholder: "متن راهنما",
    type: "text",
    editable: true,
    disabled: false,
    englishOnly: false,
    style: {},
  },
  select: {
    label: "برچسب",
    placeholder: "انتخاب کنید.",
    editable: false,
    style: {
      cursor: "pointer",
    },
    options: [
      {
        id: "drop-down-item-1",
        title: "گزینه 1",
        value: "option-1",
      },
      {
        id: "drop-down-item-2",
        title: "گزینه 2",
        value: "option-2",
      },
      {
        id: "drop-down-item-3",
        title: "گزینه 3",
        value: "option-3",
      },
    ],
  },
  textarea: {
    label: "عنوان",
    placeholder: "متن راهنما",
    editable: true,
    disabled: false,
    englishOnly: false,
    style: {},
  },
  radio: {
    label: "عنوان",
    disabled: false,
    nameKey: "title",
    valueKey: "value",
    horizontal: true,
    options: [
      {
        id: "radio-item-1",
        title: "گزینه 1",
        value: "option-1",
      },
      {
        id: "radio-item-2",
        title: "گزینه 2",
        value: "option-2",
      },
      {
        id: "radio-item-3",
        title: "گزینه 3",
        value: "option-3",
      },
    ],
  },
  checkbox: {
    label: "عنوان",
    disabled: false,
    horizontal: true,
    defaultSelecteds: [],
    options: [
      {
        id: "checkbox-item-1",
        title: "گزینه 1",
        value: "option-1",
      },
      {
        id: "checkbox-item-2",
        title: "گزینه 2",
        value: "option-2",
      },
      {
        id: "checkbox-item-3",
        title: "گزینه 3",
        value: "option-3",
      },
    ],
  },
  header: {
    title: "عنوان",
    subTitle: "زیر عنوان",
    style: {},
  },
  tree: {
    title: "ساختار درختی",
    defaultSelecteds: [],
    label: "عنوان",
    placeholder: "انتخاب کنید.",
    singleSelect: false,
    data: {
      id: "c-01",
      title: "ریشه",
      child_categories: [
        {
          id: "c-11",
          title: "گزینه اول 1",
          child_categories: [
            {
              id: "c-211",
              title: "گزینه اول ",
              child_categories: [],
            },
          ],
        },
        {
          id: "c-12",
          title: "گزینه اول دوم",
          child_categories: [
            {
              id: "c-212",
              title: "گزینه اول دوم",
              child_categories: [],
            },
          ],
        },
      ],
    },
  },
  dropzone: {
    label: "برچسب",
    placeholder: "فایل را بکشید و اینجا رها کنید.",
  },
  signature: {
    label: "امضای شما",
  },
  message: {
    title: "عنوان پیام",
    description: "توضیحات پیام",
  },
  container: {
    label: "گروه",
  },
};
