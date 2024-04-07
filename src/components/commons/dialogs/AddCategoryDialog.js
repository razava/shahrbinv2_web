import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "../../../stylesheets/reportdialog.module.css";
import { CommonAPI, ConfigurationsAPI, ProcessesAPI } from "../../../apiCalls";
import Button from "../../helpers/Button";
import {
  constants,
  getFromLocalStorage,
  serverError,
  unKnownError,
} from "../../../helperFuncs";
import useMakeRequest from "../../hooks/useMakeRequest";
import MultiSelect from "../../helpers/MultiSelect";
import TextInput from "../../helpers/TextInput";
import SelectBox from "../../helpers/SelectBox";
import Textarea from "../../helpers/Textarea";
import TreeSystem from "./TreeSystem";
import AppContext, { AppStore } from "../../../store/AppContext";
import { editForm, getCategoryById } from "../../../api/AdminApi";
import { useQuery } from "@tanstack/react-query";
import SelectBox2 from "../../helpers/SelectBox2";
import Loader from "../../helpers/Loader";
import { findNodeAndParents } from "../../../utils/functions";

const objectionValues = [
  {
    value: 1,
    title: "بله",
  },
  {
    value: 0,
    title: "خیر",
  },
];

const AddCategoryDialog = ({
  onSuccess = (f) => f,
  setLoading = (f) => f,
  mode = "create",
  defaltValues,
  categoryId,
  category,
}) => {
  const isEditMode = mode === "edit";

  // data states
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["categoryData", categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: isEditMode,
    onSuccess: (data) => {
      console.log(data);
      setCategoryId2(data.parentId);
      if (data.parentId != 1) {
        setParent([{ id: data.parentId, title: handelParent(data.parentId) }]);
      }
    },
  });
  console.log(data);
  const [values, setValues] = useState({
    title: "",
    processId: "",
    order: 0,
    code: "",
    responseDuration: "",
    duration: "",
    description: "",
    objectionAllowed: "",
    editingAllowed: "",
    form: "",
    defaultPriority: "",
    operatorIds: [],
  });
  const [processes, setProcesses] = useState([]);
  const [parents, setParents] = useState([]);
  const parentId = useRef(null);
  const [store] = useContext(AppStore);
  // const rootId = store.categories
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryTitle2, setCategoryTitle2] = useState([]);
  const [parent, setParent] = useState([]);
  const [categoryId2, setCategoryId2] = useState(store.initials.categories.id);
  // main states
  let categoryTitle;
  store.initials.categories?.categories?.map((item) => {
    if (item.id == categoryId) {
      categoryTitle = item.title;
      return item;
    } else {
      const a = item.categories.map((itm) => {
        if (itm.id == categoryId) {
          categoryTitle = itm.title;
        }
      });
    }
  });
  const [payload, setPayload] = useState(null);
  // flags
  const [createRequest, setCreateRequest] = useState(false);

  const onCategoriesSelected = (selecteds) => {
    // if (selecteds.length > 0) {
    if (selecteds.length > 0) {
      const selected = selecteds[0];
      setCategoryTitle2(selected.title);
      setCategoryId2(selected.id);
    }

    // }
    // else {
    //   setCategoryTitle2("");
    //   setCategoryId2(null);
    // }
  };
  const getData = () => {
    const token = getFromLocalStorage(constants.SHAHRBIN_MANAGEMENT_AUTH_TOKEN);

    const processes = new Promise((resolve, reject) => {
      ConfigurationsAPI.getProcesses(token).then((res) => {
        if (res && res.status === 200) resolve(res);
        else reject(res);
      });
    });
    const parents = new Promise((resolve, reject) => {
      CommonAPI.getSubjectGroups(token).then((res) => {
        if (res && res.status === 200) resolve(res);
        else reject(res);
      });
    });
    return Promise.all([processes, parents]);
  };
  // console.log(defaltValues);
  const fillInputs = () => {
    parentId.current = data.parentId;
    const ab = {
      title: data.title,
      processId: data.processId,
      order: data.order,
      code: data.code ? data.code : "",
      responseDuration: data.responseDuration / 24,
      duration: data.duration / 24,
      description: data.description,
      objectionAllowed: data.objectionAllowed ? 1 : 0,
      formId: data.formId ? data.formId : null,
    };
    console.log(data.editingAllowed, "ed");
    setValues({
      title: data.title,
      processId: data.processId,
      order: data.order,
      code: data.code,
      responseDuration: data.responseDuration / 24,
      duration: data.duration / 24,
      description: data.description,
      objectionAllowed: data.objectionAllowed ? 1 : 0,
      editingAllowed: data.editingAllowed ? 1 : 0,
      formId: data.form ? data.form.id : null,
      defaultPriority: data.defaultPriority,
    });
  };

  useEffect(() => {
    if (isEditMode && data) {
      fillInputs();
    }

    getData().then((res) => {
      setProcesses(res[0]?.data);
      setParents(res[1]?.data);
    });
  }, [data]);

  const onParentChange = (value) => {
    parentId.current = value && value[0]?.id;
  };

  const handleChange =
    (name, options = {}) =>
    (e) => {
      let value = e?.target ? e.target.value : e;
      if (options?.onlyDigits) {
        value = String(value).replace(/\D/g, "");
      }
      setValues({ ...values, [name]: value });
    };

  const handelParent = (Id) => {
    if (Id == 1) return "";
    const result = findNodeAndParents(
      store?.initials?.categories?.categories,
      Id
    );
    if (result) {
      return result[result.length - 1].title;
    } else {
      return "";
    }
  };

  const findParenTitle = (parentId) => {
    console.log(parentId);
    if (parentId == 1) return "";
    const categories = store.initials.categories;
    let categoryTitle;
    store.initials.categories?.categories?.map((item) => {
      if (item.id == parentId) {
        categoryTitle = item.title;
        return item;
      } else {
        const a = item.categories.map((itm) => {
          if (itm.id == parentId) {
            categoryTitle = itm.title;
          }
        });
      }
    });
    return categoryTitle;
  };
  const createCategory = () => {
    const payload = {
      ...values,
      defaultPriority: Number(values.defaultPriority),
      responseDuration: values.responseDuration * 24,
      duration: values.duration * 24,
      objectionAllowed: Number(values.objectionAllowed) === 1 ? true : false,
      editingAllowed: Number(values.objectionAllowed) === 1 ? true : false,
      parentId: categoryId2,
      processId: values.processId ? Number(values.processId) : null,
    };
    if (!isEditMode) {
      payload["operatorIds"] = values.operatorIds.map((item) => item.value);
    }
    setPayload(payload);
    setCreateRequest(true);
  };
  const [, loading] = useMakeRequest(
    isEditMode
      ? ConfigurationsAPI.updateCategory
      : ConfigurationsAPI.createCategory,
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
    categoryId
  );

  const defaultSelected =
    data?.parentId != 1
      ? [{ id: data?.parentId, title: handelParent(data?.parentId) }]
      : [];

  useEffect(() => {
    console.log(values);
  }, [values]);

  console.log(data);
  return (
    <>
      <>
        <form className="w100 mx-a relative">
          <div className="w100 mxa row">
            <TextInput
              value={values.title}
              title="عنوان"
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="title"
              onChange={handleChange}
              required={false}
            />
            {/* <MultiSelect
            strings={{ label: "پدر" }}
            caller={CommonAPI.getSubjectGroups}
            isStatic={false}
            wrapperClassName={"col-md-6 col-sm-12"}
            nameKey="title"
            valueKey="id"
            maxHeight={300}
            singleSelect={true}
            onChange={onParentChange}
            defaultSelecteds={category ? [{ id: category.parentId }] : []}
            isInDialog={true}
            id="categories"
          /> */}
            <TreeSystem
              // isStatic
              // staticData={store.initials.categories}
              caller={ConfigurationsAPI.getCategories}
              condition={categoryDialog}
              setCondition={setCategoryDialog}
              onChange={onCategoriesSelected}
              defaultSelecteds={parent}
              singleSelect={true}
              onClose={() => setCategoryDialog(false)}
              mode="Add"
              renderToggler={(selected) => (
                <TextInput
                  placeholder="انتخاب کنید."
                  title="پدر"
                  readOnly={true}
                  onClick={() => setCategoryDialog(true)}
                  wrapperClassName="col-md-6 col-sm-12 col-12"
                  inputClassName="pointer"
                  required={false}
                  value={
                    selected.length > 0
                      ? selected[0].title
                      : categoryId
                      ? handelParent(data?.parentId)
                      : ""
                  }
                />
              )}
            ></TreeSystem>
          </div>
          <div className="w100 mxa row">
            <SelectBox
              value={values.processId}
              label="فرآیند"
              caller={ConfigurationsAPI.getProcesses}
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="processId"
              handleChange={handleChange}
              required={false}
            />

            <SelectBox
              value={values.objectionAllowed}
              label="امکان تجدید نظر"
              staticData={true}
              options={objectionValues.map((v) => ({ ...v, id: v.value }))}
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="objectionAllowed"
              handleChange={handleChange}
              required={false}
            />
          </div>
          <div className="w100 mxa row">
            <TextInput
              value={values.order}
              title="ترتیب"
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="order"
              onChange={handleChange}
              required={false}
            />
            <TextInput
              value={values.code}
              title="کد"
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="code"
              onChange={handleChange}
              required={false}
            />
          </div>
          <div className="w100 mxa row">
            <TextInput
              value={values.responseDuration}
              title="ضرب‌العجل پاسخگویی"
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="responseDuration"
              onChange={handleChange}
              required={false}
              placeholder="روز"
            />
            <TextInput
              value={values.duration}
              title="ضرب‌العجل اتمام"
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="duration"
              onChange={handleChange}
              required={false}
              placeholder="روز"
            />
          </div>
          <div className="w100 mxa row">
            <SelectBox
              value={values.formId}
              label="فرم"
              caller={ConfigurationsAPI.getForms}
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="formId"
              handleChange={handleChange}
              required={false}
            />
            <Textarea
              value={values.description}
              title="توضیحات"
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="description"
              handleChange={handleChange}
              required={false}
            />
          </div>
          <div className={"w100 mxa frc row"}>
            <SelectBox
              staticData
              options={[
                { id: 0, title: "کم" },
                { id: 1, title: "عادی" },
                { id: 2, title: "زیاد" },
                { id: 3, title: "فوری" },
              ]}
              name="defaultPriority"
              value={values.defaultPriority}
              handleChange={handleChange}
              handle={["title"]}
              label="اولویت"
              wrapperClassName="col-md-6 col-sm-12 col-12"
            />
            <SelectBox
              value={values.editingAllowed}
              label="نیاز به تایید و ویرایش"
              staticData={true}
              options={objectionValues.map((v) => ({ ...v, id: v.value }))}
              wrapperClassName="col-md-6 col-sm-12"
              inputClassName=""
              name="editingAllowed"
              handleChange={handleChange}
              required={false}
            />
          </div>
          <div className={"w100 mxa frc row"}>
            <MultiSelect
              strings={{ label: "اپراتور" }}
              caller={ConfigurationsAPI.getOperators}
              isStatic={false}
              nameKey="text"
              valueKey={"value"}
              maxHeight={160}
              onChange={(values) => handleChange("operatorIds")(values)}
              // defaultSelecteds={defaultActors}
              isInDialog={true}
              wrapperClassName="col-md-12"
              id="organs-list"
            />
          </div>
        </form>
        <div className="w100 mxa fre py1 px2 border-t-light mt1">
          <Button
            title={isEditMode ? "ویرایش دسته‌بندی" : "ایجاد دسته‌بندی"}
            className="py1 br05 bg-primary"
            onClick={createCategory}
            loading={loading}
          />
        </div>
      </>
    </>
  );
};

export default AddCategoryDialog;
