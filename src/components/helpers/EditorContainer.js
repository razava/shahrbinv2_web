import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@moji7798/ckeditor5-custom-build/build/ckeditor";
import { useHistory, useLocation } from "react-router-dom";
// import useMakeRequest from "../Hooks/useMakeRequest";
import { toast } from "react-toastify";
import Loader from "./Loader";
import styles from "../../stylesheets/polls.module.css";

const EditorContainer = ({
  content,
  setContent,
  saveChanges = (f) => f,
  isReadOnly = false,
  pollId,
}) => {
  const location = useLocation();
  const history = useHistory();

  const [payload, setPayload] = useState({});
  const [makeSaveRequest, setMakeSaveRequest] = useState(false);

  const handleEditorChange = (event, editor) => {
    setContent(editor.getData());
  };

  return (
    <>
      {/* {saveLoading && <Loader overlay={true} />} */}
      <div className={styles.editorContainer}>
        <CKEditor
          editor={ClassicEditor}
          onChange={handleEditorChange}
          disabled={isReadOnly}
          config={{
            isReadOnly: isReadOnly,
            ckfinder: {
              headers: {
                "X-CSRF-TOKEN": "CSRF-Token",
                Authorization: `Bearer `,
              },
              uploadUrl: `${
                process.env.NODE_ENV === "development"
                  ? ""
                  : process.env.REACT_APP_API_URL
              }/api/Polls/${pollId}/Attach`,
            },
            language: {
              ui: "fa",
              content: "fa",
            },
            image: {
              styles: [
                "alignLeft",
                "alignCenter",
                "alignRight",
                "full",
                "side",
              ],

              resizeOptions: [
                {
                  name: "imageResize:original",
                  label: "Original",
                  value: null,
                },
                {
                  name: "imageResize:25",
                  label: "25%",
                  value: "25",
                },
                {
                  name: "imageResize:50",
                  label: "50%",
                  value: "50",
                },
                {
                  name: "imageResize:75",
                  label: "75%",
                  value: "75",
                },
              ],
            },
          }}
          data={content}
        />
      </div>
    </>
  );
};

export default EditorContainer;
