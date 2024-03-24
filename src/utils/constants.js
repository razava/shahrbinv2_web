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

export const backgroundColor = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(255, 0, 0, 0.2)",
  "rgba(0, 255, 0, 0.2)",
  "rgba(0, 0, 255, 0.2)",
  "rgba(255, 255, 0, 0.2)",
  "rgba(255, 0, 255, 0.2)",
  "rgba(0, 255, 255, 0.2)",
  "rgba(128, 0, 0, 0.2)",
  "rgba(0, 128, 0, 0.2)",
  "rgba(0, 0, 128, 0.2)",
  "rgba(128, 128, 0, 0.2)",
  "rgba(128, 0, 128, 0.2)",
  "rgba(0, 128, 128, 0.2)",
  "rgba(255, 128, 0, 0.2)",
  "rgba(128, 255, 0, 0.2)",
  "rgba(0, 255, 128, 0.2)",
  "rgba(0, 128, 255, 0.2)",
  "rgba(128, 0, 255, 0.2)",
  "rgba(255, 0, 128, 0.2)",
  "rgba(255, 128, 128, 0.2)",
  "rgba(128, 255, 128, 0.2)",
  "rgba(128, 128, 255, 0.2)",
  "rgba(192, 192, 192, 0.2)",
  "rgba(128, 128, 128, 0.2)",
  "rgba(0, 0, 0, 0.2)",
];

export const borderColor = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255, 0, 0, 1)",
  "rgba(0, 255, 0, 1)",
  "rgba(0, 0, 255, 1)",
  "rgba(255, 255, 0, 1)",
  "rgba(255, 0, 255, 1)",
  "rgba(0, 255, 255, 1)",
  "rgba(128, 0, 0, 1)",
  "rgba(0, 128, 0, 1)",
  "rgba(0, 0, 128, 1)",
  "rgba(128, 128, 0, 1)",
  "rgba(128, 0, 128, 1)",
  "rgba(0, 128, 128, 1)",
  "rgba(255, 128, 0, 1)",
  "rgba(128, 255, 0, 1)",
  "rgba(0, 255, 128, 1)",
  "rgba(0, 128, 255, 1)",
  "rgba(128, 0, 255, 1)",
  "rgba(255, 0, 128, 1)",
  "rgba(255, 128, 128, 1)",
  "rgba(128, 255, 128, 1)",
  "rgba(128, 128, 255, 1)",
  "rgba(192, 192, 192, 1)",
  "rgba(128, 128, 128, 1)",
  "rgba(0, 0, 0, 1)",
];

export const priorities = [
  { id: 0, title: "کم" },
  { id: 1, title: "عادی" },
  { id: 2, title: "زیاد" },
  { id: 3, title: "فوری" },
];
