export const inputTypes = [
  {
    id: "input-type-1",
    title: "متن",
    value: "text",
  },
  {
    id: "input-type-2",
    title: "عدد",
    value: "number",
  },
  {
    id: "input-type-3",
    title: "رمز",
    value: "password",
  },
  {
    id: "input-type-4",
    title: "فایل",
    value: "file",
  },
];

export const options = {
  text: [
    {
      id: "text-option-1",
      title: "غیرفعال",
      value: "disabled",
    },
    {
      id: "text-option-2",
      title: "قابل ویرایش",
      value: "editable",
    },
    {
      id: "text-option-3",
      title: "فقط حروف انگلیسی",
      value: "englishOnly",
    },
    {
      id: "text-option-4",
      title: "فقط اعداد",
      value: "digitsOnly",
    },
    {
      id: "text-option-5",
      title: "الزامی",
      value: "required",
    },
  ],
  select: [
    // {
    //   id: "select-option-1",
    //   title: "غیرفعال",
    //   value: "disabled",
    // },
    {
      id: "text-option-2",
      title: "قابل ویرایش",
      value: "editable",
    },
    // {
    //   id: "select-option-2",
    //   title: "چند انتخابی",
    //   value: "multiple",
    // },
    // {
    //   id: "select-option-3",
    //   title: "قابل پاک کردن",
    //   value: "clearable",
    // },
    // {
    //   id: "select-option-4",
    //   title: "جستجو",
    //   value: "searchable",
    // },
    {
      id: "select-option-5",
      title: "الزامی",
      value: "required",
    },
  ],
  textarea: [
    // {
    //   id: "textarea-option-1",
    //   title: "غیرفعال",
    //   value: "disabled",
    // },
    {
      id: "textarea-option-2",
      title: "قابل ویرایش",
      value: "editable",
    },
    {
      id: "textarea-option-3",
      title: "فقط حروف انگلیسی",
      value: "englishOnly",
    },
    {
      id: "textarea-option-4",
      title: "فقط اعداد",
      value: "digitsOnly",
    },
    {
      id: "textarea-option-5",
      title: "الزامی",
      value: "required",
    },
  ],
  radio: [
    // {
    //   id: "radio-option-1",
    //   title: "غیرفعال",
    //   value: "disabled",
    // },
    {
      id: "radio-option-2",
      title: "افقی",
      value: "horizontal",
    },
    {
      id: "radio-option-3",
      title: "قابل ویرایش",
      value: "editable",
    },
    {
      id: "radio-option-4",
      title: "الزامی",
      value: "required",
    },
  ],
  checkbox: [
    // {
    //   id: "checkbox-option-1",
    //   title: "غیرفعال",
    //   value: "disabled",
    // },
    {
      id: "checkbox-option-2",
      title: "افقی",
      value: "horizontal",
    },
    {
      id: "checkbox-option-3",
      title: "قابل ویرایش",
      value: "editable",
    },
    {
      id: "checkbox-option-4",
      title: "الزامی",
      value: "required",
    },
  ],
  header: [],
  tree: [
    {
      id: "tree-option-1",
      title: "تک انتخابی",
      value: "singleSelect",
    },
  ],
};

const selectDefaultOptions = [
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
];

export const editTabs = [
  {
    id: "edit-tab-1",
    title: "عمومی",
    value: "general",
    fields: {
      text: [
        {
          type: "radio",
          options: inputTypes,
          name: "type",
          label: "نوع",
        },
        { type: "text", name: "placeholder", label: "متن راهنما" },
        { type: "text", name: "label", label: "برچسب" },
        {
          type: "checkbox",
          options: options.text,
          name: "otherOptions",
          label: "ویژگی‌های دیگر",
        },
      ],
      select: [
        { type: "text", name: "placeholder", label: "متن راهنما" },
        { type: "text", name: "label", label: "برچسب" },
        {
          type: "checkbox",
          options: options.select,
          name: "otherOptions",
          label: "ویژگی‌های دیگر",
        },
        {
          type: "options",
          values: selectDefaultOptions,
          name: "options",
        },
      ],
      textarea: [
        { type: "text", name: "placeholder", label: "متن راهنما" },
        { type: "text", name: "label", label: "برچسب" },
        {
          type: "checkbox",
          options: options.textarea,
          name: "otherOptions",
          label: "ویژگی‌های دیگر",
        },
        {
          type: "text",
          name: "maxLength",
          label: "حداکثر تعداد کاراکتر",
        },
      ],
      radio: [
        { type: "text", name: "label", label: "برچسب" },
        {
          type: "checkbox",
          options: options.radio,
          name: "otherOptions",
          label: "ویژگی‌های دیگر",
        },
        {
          type: "options",
          values: selectDefaultOptions,
          name: "options",
        },
      ],
      checkbox: [
        { type: "text", name: "label", label: "برچسب" },
        {
          type: "checkbox",
          options: options.checkbox,
          name: "otherOptions",
          label: "ویژگی‌های دیگر",
        },
        {
          type: "options",
          values: selectDefaultOptions,
          name: "options",
        },
      ],
      header: [
        { type: "text", name: "title", label: "سربرگ" },
        { type: "text", name: "subTitle", label: "توضیح کوتاه" },
      ],
      tree: [
        { type: "text", name: "label", label: "برچسب" },
        { type: "text", name: "placeholder", label: "متن راهنما" },
        {
          type: "tree",
          treeKey: "child_categories",
          dataKey: "data",
        },
        {
          type: "checkbox",
          options: options.tree,
          name: "otherOptions",
          label: "ویژگی‌های دیگر",
        },
      ],
      dropzone: [
        { type: "text", name: "label", label: "برچسب" },
        { type: "text", name: "placeholder", label: "متن راهنما" },
      ],
      signature: [{ type: "text", name: "label", label: "برچسب" }],
      message: [
        { type: "text", name: "title", label: "عنوان" },
        { type: "text", name: "description", label: "زیر عنوان" },
      ],
      container: [{ type: "text", name: "label", label: "برچسب" }],
    },
  },
  {
    id: "edit-tab-2",
    title: "استایل",
    value: "style",
    fields: {
      text: ["background-color", "color", "font-size"],
      select: ["background-color", "color", "font-size"],
      textarea: ["background-color", "color", "font-size", "rows"],
      radio: [],
      checkbox: [],
      header: ["alignment", "color"],
    },
  },
  {
    id: "edit-tab-3",
    title: "شرط",
    value: "condition",
    fields: {
      text: [],
    },
  },
  {
    id: "edit-tab-4",
    title: "غیره",
    value: "else",
    fields: {
      text: [],
    },
  },
];
