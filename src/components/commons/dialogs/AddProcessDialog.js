import React, { useEffect, useState } from "react";
import TextInput from "../../helpers/TextInput";
import MultiSelect from "../../helpers/MultiSelect";
import { ProcessesAPI } from "../../../apiCalls";
import styles from "../../../stylesheets/reportdialog.module.css";
import Button from "../../helpers/Button";
import useMakeRequest from "../../hooks/useMakeRequest";
import { callAPI, serverError, unKnownError } from "../../../helperFuncs";

const AddProcessDialog = ({
  setLoading = (f) => f,
  onSuccess = (f) => f,
  mode = "create",
  defaltValues,
  processId,
}) => {
  const isEditMode = mode === "edit";

  // data states
  const [values, setValues] = useState({
    title: "",
    actorIds: [],
  });
  const [defaultActors, setDefaultActors] = useState([]);

  // other states
  const [payload, setPayload] = useState(null);

  // flags
  const [createRequest, setCreateRequest] = useState(false);

  const fillInputs = (data) => {
    const actors =
      data.stages.find((s) => s.name === "Executive")?.actors || [];
    setValues({
      title: data.title,
      actorIds: actors,
    });
    setDefaultActors(actors);
  };

  const getData = () => {
    setLoading(true);
    callAPI(
      {
        caller: ProcessesAPI.getProcessById,
        successStatus: 200,
        successCallback: (res) => fillInputs(res.data),
        requestEnded: (res) => setLoading(false),
      },
      processId
    );
  };

  useEffect(() => {
    if (isEditMode) {
      getData();
    }
  }, []);

  const handleChange =
    (name, options = {}) =>
    (e) => {
      let value = e.target ? e.target.value : e;
      if (options?.onlyDigits) {
        value = String(value).replace(/\D/g, "");
      }
      setValues({ ...values, [name]: value });
    };

  const createProcess = () => {
    const actorIds = values.actorIds.map((a) => a.id);
    const payload = {
      title: values.title,
      actorIds,
    };
    setPayload(payload);
    setCreateRequest(true);
  };

  const [, loading] = useMakeRequest(
    isEditMode ? ProcessesAPI.updateProcess : ProcessesAPI.createProcess,
    isEditMode ? 204 : 201,
    createRequest,
    payload,
    (res) => {
      setCreateRequest(false);
      const status = isEditMode ? 204 : 201;
      if (res && res.status === status) {
        onSuccess();
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    processId
  );
  return (
    <>
      <form className="w90 mx-a relative fcc">
        <div className="w100 mxa row">
          <MultiSelect
            strings={{ label: "واحدهای اجرایی" }}
            caller={ProcessesAPI.getExecutives}
            isStatic={false}
            nameKey="displayName"
            valueKey="id"
            maxHeight={250}
            onChange={(values) => handleChange("actorIds")(values)}
            defaultSelecteds={defaultActors}
            isInDialog={true}
            wrapperClassName="col-md-12"
            id="proccesses"
          />
        </div>
        <div className="w100 mxa row">
          <TextInput
            wrapperClassName="col-md-12"
            title="عنوان"
            required={false}
            value={values.title}
            name="title"
            onChange={handleChange}
          />
        </div>
      </form>

      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={isEditMode ? "ویرایش فرآیند" : "ایجاد فرآیند"}
          className="py1 br05 bg-primary"
          onClick={createProcess}
          loading={loading}
        />
      </div>
    </>
  );
};

export default AddProcessDialog;
