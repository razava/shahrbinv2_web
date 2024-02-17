export const formElements = [
  {
    id: "tool-1",
    title: "متن",
    type: "text",
    icon: "text",
    color: "#06d6a0",
    category: "input",
  },
  {
    id: "tool-2",
    title: "چند گزینه‌ای",
    type: "select",
    icon: "caret-down",
    color: "#231942",
    category: "input",
  },
  {
    id: "tool-3",
    title: "متن توضیحات",
    type: "textarea",
    icon: "info",
    color: "#006d77",
    category: "input",
  },
  {
    id: "tool-4",
    title: "تک انتخابی",
    type: "radio",
    icon: "dot-circle",
    color: "#ffba08",
    category: "input",
  },
  {
    id: "tool-5",
    title: "چند انتخابی",
    type: "checkbox",
    icon: "check-square",
    color: "#3a0ca3",
    category: "input",
  },
  {
    id: "tool-6",
    title: "سربرگ",
    type: "header",
    icon: "heading",
    color: "#f72585",
    category: "input",
  },
  // {
  //   id: "tool-7",
  //   title: "ساختار درختی",
  //   type: "tree",
  //   icon: "folder-tree",
  //   color: "#2b9348",
  //   category: "input",
  // },
  {
    id: "tool-8",
    title: "آپلود فایل",
    type: "dropzone",
    icon: "file-upload",
    color: "#d00000",
    category: "input",
  },
  // {
  //   id: "tool-9",
  //   title: "امضا",
  //   type: "signature",
  //   icon: "signature",
  //   color: "#b5179e",
  //   category: "input",
  // },
  {
    id: "tool-10",
    title: "پیام",
    type: "message",
    icon: "comment-alt",
    color: "#3a86ff",
    category: "input",
  },
];

export const containerElements = [
  // {
  //   id: "tool-1",
  //   title: "محفظه",
  //   type: "container",
  //   icon: "box",
  //   color: "#ffb703",
  //   category: "container"
  // },
];

export const elementTypes = [
  {
    id: "element-type-1",
    elements: formElements,
    title: "المان‌های فرم",
    color: "#219ebc",
    icon: "outdent",
  },
  {
    id: "element-type-2",
    elements: containerElements,
    title: "المان‌های محفظه",
    icon: "box",
    color: "#ffbe0b",
  },
];
