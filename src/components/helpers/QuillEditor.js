import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
function QuillEditor({ setData, data, mode , readOnly = false }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: ["monospace"] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
  ];

  const [code, setCode] = useState("hellllo");
  const handleProcedureContentChange = (content, delta, source, editor) => {
    setCode(content);
    console.log(content);
    setData(content);
    //let has_attribues = delta.ops[1].attributes || "";
    //console.log(has_attribues);
    //const cursorPosition = e.quill.getSelection().index;
    // this.quill.insertText(cursorPosition, "★");
    //this.quill.setSelection(cursorPosition + 1);
  };
  console.log(data);
    // useEffect(() => {
    //   if (mode == "step") {
    //     setCode(data);
    //   }
    // }, [data]);
  console.log(data);
  return (
    <>
      <div>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={data}
          onChange={handleProcedureContentChange}
        />
      </div>
    </>
  );
}

export default QuillEditor;
