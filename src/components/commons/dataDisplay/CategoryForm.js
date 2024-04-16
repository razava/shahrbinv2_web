import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  fixDigit,
  fixURL,
  serverError,
  unKnownError,
  JalaliDate,
} from "../../../helperFuncs";
import MultiSelectBox from "../../helpers/MultiSelectBox";
import SelectBox from "../../helpers/SelectBox";
import Button from "../../helpers/Button";
import moment from "moment-jalaali";
import useMakeRequest from "../../hooks/useMakeRequest";
import { ReportsAPI } from "../../../apiCalls";
import { toast } from "react-toastify";
import TextInput from "../../helpers/TextInput";
import DatePickerConatiner from "../../helpers/Date/DatePicker";
import Textarea from "../../helpers/Textarea";

const CategoryForm = ({ data }) => {
  // data states
  const [textValues, setTextValues] = useState({});
  const [dateValues, setDateValues] = useState({});
  const [selectValues, setSelectValues] = useState({});
  const [multiSelectValues, setMultiSelectValues] = useState({});
  const [plateNumberValues, setPlateNumberValues] = useState({});
  const [textAreaValues, setTextAreaValues] = useState({});
  const [options, setOptions] = useState({});

  // main states
  const [payload, setPayload] = useState(null);

  // flags
  const [editRequest, setEditRequest] = useState(false);

  // get data to select from
  const getOptions = () => {
    const promises = data?.category?.formElements
      .filter((f) => f.formElementType === 3 || f.formElementType === 2)
      .map((f) => {
        return new Promise((resolve, reject) => {
          axios.get(fixURL(f.url)).then((res) => {
            if (res && res.status === 200)
              resolve({ data: res.data, name: f.name });
            else reject({ data: [], name: f.name });
          });
        });
      });

    return Promise.all(promises).then((res) => {
      const newOptions = options;
      res.forEach((r) => {
        newOptions[r.name] = r.data;
      });
      setOptions(newOptions);
      getCitizenValues();
    });
  };

  // get citizen request input values and store them
  const getCitizenValues = () => {
    let citizenValues = JSON.parse(
      String(data?.comments).replace(/\[JSON\]/, "")
    );
    // citizenValues = Array.isArray(citizenValues) ? citizenValues : [];
    const formElements = data?.category?.formElements;
    const textElements = formElements.filter((f) => f.formElementType === 1);
    const selectElements = formElements.filter((f) => f.formElementType === 2);
    const multiSelectElements = formElements.filter(
      (f) => f.formElementType === 3
    );
    const dateElements = formElements.filter((f) => f.formElementType === 4);
    const plateNumberElements = formElements.filter(
      (f) => f.formElementType === 5
    );
    const textAreaElements = formElements.filter(
      (f) => f.formElementType === 6
    );
    const textValues = {};
    const selectValues = {};
    const multiSelectValues = {};
    const dateValues = {};
    const plateNumberValues = {};
    const textAreaValues = {};
    textElements.forEach((e) => {
      textValues[e.name] = [e.name] || "";
    });
    selectElements.forEach((e) => {
      selectValues[e.name] = citizenValues[e.name] || "";
    });
    multiSelectElements.forEach((e) => {
      multiSelectValues[e.name] = citizenValues[e.name] || [];
    });
    dateElements.forEach((e) => {
      const localeDateStrings = moment(citizenValues[e.name])
        .locale("fa")
        .format("jYYYY/jMM/jDD");
      const values = localeDateStrings
        .split("/")
        .map((v) => parseInt(fixDigit(v, true)));
      const year = values[0];
      const month = values[1];
      const day = values[2];

      dateValues[e.name] = { year, month, day };
    });
    plateNumberElements.forEach((e) => {
      let value;
      if (typeof citizenValues[e.name] === "object") {
        value = citizenValues[e.name];
      } else {
        const string = String(citizenValues[e.name]);
        const part4 = string.slice(0, 2);
        const part3 = string.slice(3, 6);
        const part2 = string.slice(6, 7);
        const part1 = string.slice(7, 9);
        value = { part1, part2, part3, part4 };
      }
      plateNumberValues[e.name] = value;
    });
    textAreaElements.forEach((e) => {
      textAreaValues[e.name] = citizenValues[e.name] || "";
    });
    setTextValues(textValues);
    setSelectValues(selectValues);
    setMultiSelectValues(multiSelectValues);
    setDateValues(dateValues);
    setPlateNumberValues(plateNumberValues);
    setTextAreaValues(textAreaValues);
  };

  useEffect(() => {
    getOptions();
    // getCitizenValues();
  }, []);

  // format the data according to mutliselect package
  const formatToMultiSelect = (arr) => {
    return arr && !arr.some((a) => a.label)
      ? arr.map((o) => {
          return {
            label: o.name,
            value: o.id,
          };
        })
      : arr;
  };

  const jallaliToGregorian = (jallali) => {
    const gregorain = JalaliDate.jalaliToGregorian(
      jallali.year,
      jallali.month,
      jallali.day
    );
    const date = new Date(
      gregorain[0],
      gregorain[1] - 1,
      gregorain[2]
    ).toISOString();
    return date;
  };

  // format edit request payload
  const editCitizenRequest = () => {
    let payload = {};
    Object.keys(dateValues).forEach((k) => {
      payload[k] = jallaliToGregorian(dateValues[k]);
    });
    Object.keys(multiSelectValues).forEach((k) => {
      payload[k] = multiSelectValues[k]
        ? multiSelectValues[k].map((m) => {
            return {
              id: m.id,
              name: m.name,
            };
          })
        : [];
    });
    Object.keys(selectValues).forEach((k) => {
      const id = selectValues[k].id;
      const name = selectValues[k].name;
      payload[k] = {
        id,
        name,
      };
    });
    Object.keys(textValues).forEach((k) => {
      payload[k] = textValues[k];
    });
    Object.keys(plateNumberValues).forEach((k) => {
      payload[k] =
        plateNumberValues[k].part4 +
        "-" +
        plateNumberValues[k].part3 +
        plateNumberValues[k].part2 +
        plateNumberValues[k].part1;
    });
    Object.keys(textAreaValues).forEach((k) => {
      payload[k] = textAreaValues[k];
    });

    const prefix = "[JSON]";
    payload = { comments: prefix + JSON.stringify(payload) };
    setPayload(payload);
    setEditRequest(true);
  };

  const [, loading] = useMakeRequest(
    ReportsAPI.updateCitizenRequest,
    200,
    editRequest,
    payload,
    (res) => {
      setEditRequest(false);
      if (res && res.status === 200) {
      } else if (serverError(res)) return;
      else if (unKnownError(res)) return;
    },
    data?.id
  );

  return (
    <>
      <div className="w90 mxa fcc">
        {data?.category?.formElements.map((formElement) => {
          if (formElement.formElementType === 2) {
            return (
              <SelectBox
                key={formElement.id}
                name={formElement.name}
                value={selectValues[formElement.name]}
                label={formElement.title}
                options={
                  options[formElement.name] ? options[formElement.name] : []
                }
                staticData={true}
                handle={["name"]}
                labelStyle={{ textAlign: "right" }}
                selectStyle={{ flex: 5 }}
                disabled={formElement.isEditable}
                handleChange={(name) => (e) => {
                  const selected = options[formElement.name].find(
                    (a) => a.id === parseInt(e.target.value)
                  );
                  setSelectValues({
                    ...selectValues,
                    [name]: {
                      id: e.target.value,
                      name: selected?.name,
                    },
                  });
                }}
              />
            );
          }
          if (formElement.formElementType === 3) {
            return (
              <MultiSelectBox
                key={formElement.id}
                name={formElement.name}
                label={formElement.title}
                data={formatToMultiSelect(options[formElement.name])}
                isStatic={true}
                labelStyle={{ textAlign: "right", flex: 1 }}
                className="flex-5 selectbox"
                selecteds={formatToMultiSelect(
                  multiSelectValues[formElement.name]
                )}
                setSelected={(e) =>
                  setMultiSelectValues({
                    ...multiSelectValues,
                    [formElement.name]: e.map((s) => {
                      return { id: s.value, name: s.label };
                    }),
                  })
                }
              />
            );
          }
          if (formElement.formElementType === 1) {
            return (
              <TextInput
                key={formElement.id}
                name={formElement.name}
                title={formElement.title}
                value={
                  textValues[formElement.name]
                    ? textValues[formElement.name]
                    : ""
                }
                onChange={(name) => (e) =>
                  setTextValues({
                    ...textValues,
                    [formElement.name]: e.target.value,
                  })}
                required={false}
              />
            );
          }
          if (formElement.formElementType === 5) {
            return (
              <div key={formElement.id} className="px1 py1 w90 fcs relative">
                <label
                  className={"text-primary f15 ml1 flex-1 w100 text-right"}
                >
                  {formElement.title}
                </label>
                <div className="flex-5 frc">
                  <TextInput
                    name={formElement.name}
                    onChange={(name) => (e) =>
                      setPlateNumberValues({
                        ...plateNumberValues,
                        [formElement.name]: {
                          part1: plateNumberValues[formElement.name]?.part1,
                          part2: plateNumberValues[formElement.name]?.part2,
                          part3: plateNumberValues[formElement.name]?.part3,
                          part4: e.target.value,
                        },
                      })}
                    value={
                      plateNumberValues[formElement.name]
                        ? plateNumberValues[formElement.name]?.part4
                        : ""
                    }
                    wrapperClassName="flex-1"
                  />
                  <TextInput
                    name={formElement.name}
                    onChange={(name) => (e) =>
                      setPlateNumberValues({
                        ...plateNumberValues,
                        [formElement.name]: {
                          part1: plateNumberValues[formElement.name]?.part1,
                          part2: plateNumberValues[formElement.name]?.part2,
                          part3: e.target.value,
                          part4: plateNumberValues[formElement.name]?.part4,
                        },
                      })}
                    value={
                      plateNumberValues[formElement.name]
                        ? plateNumberValues[formElement.name]?.part3
                        : ""
                    }
                    wrapperClassName="flex-1"
                  />
                  <TextInput
                    name={formElement.name}
                    onChange={(name) => (e) =>
                      setPlateNumberValues({
                        ...plateNumberValues,
                        [formElement.name]: {
                          part1: plateNumberValues[formElement.name]?.part1,
                          part2: e.target.value,
                          part3: plateNumberValues[formElement.name]?.part3,
                          part4: plateNumberValues[formElement.name]?.part4,
                        },
                      })}
                    value={
                      plateNumberValues[formElement.name]
                        ? plateNumberValues[formElement.name]?.part2
                        : ""
                    }
                    wrapperClassName="flex-1"
                  />
                  <TextInput
                    name={formElement.name}
                    onChange={(name) => (e) =>
                      setPlateNumberValues({
                        ...plateNumberValues,
                        [formElement.name]: {
                          part1: e.target.value,
                          part2: plateNumberValues[formElement.name]?.part2,
                          part3: plateNumberValues[formElement.name]?.part3,
                          part4: plateNumberValues[formElement.name]?.part4,
                        },
                      })}
                    value={
                      plateNumberValues[formElement.name]
                        ? plateNumberValues[formElement.name]?.part1
                        : ""
                    }
                    wrapperClassName="flex-1"
                  />
                </div>
              </div>
            );
          }
          if (
            formElement.formElementType === 4 &&
            dateValues[formElement.name]
          ) {
            return (
              <DatePickerConatiner
                key={formElement.id}
                title={formElement.title}
                name={formElement.name}
                wrapperClassName="w100 mxa relative fcc"
                inputClassName="w100 mxa relative fcc"
                date={dateValues[formElement.name]}
                onSelect={(value, name) => {
                  const newValues = dateValues;
                  newValues[name] = value;
                  setDateValues(newValues);
                }}
              />
            );
          }
          if (formElement.formElementType === 6) {
            return (
              <Textarea
                key={formElement.id}
                title={formElement.title}
                name={formElement.name}
                handleChange={(name) => (e) =>
                  setTextAreaValues({
                    ...textAreaValues,
                    [formElement.name]: e.target.value,
                  })}
                value={
                  textAreaValues[formElement.name]
                    ? textAreaValues[formElement.name]
                    : ""
                }
              />
            );
          }
        })}
      </div>
      <div className="w90 mxa fcc">
        <Button
          className="relative w90 frc mxa my2 py1"
          style={{ height: 70 }}
          onClick={editCitizenRequest}
        >
          {loading ? (
            <span
              className="loader text-white my1 f1"
              style={{ width: 1, height: 1 }}
            ></span>
          ) : (
            <span>به روز‌رسانی</span>
          )}
        </Button>
      </div>
    </>
  );
};

export default CategoryForm;
