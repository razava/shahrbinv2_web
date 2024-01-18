import React, { useContext, useEffect, useState } from "react";
import {
  ActorsAPI,
  CommonAPI,
  InfoAPI,
  ReportsAPI,
  UserInfoAPI,
} from "../../../apiCalls";
import {
  constants,
  defaultFilters,
  getDatePickerFormat,
  getFromLocalStorage,
  JalaliDate,
} from "../../../helperFuncs";
import { AppStore } from "../../../store/AppContext";
import Button from "../../helpers/Button";
import DatePickerConatiner from "../../helpers/Date/DatePicker";
import MultiSelect from "../../helpers/MultiSelect";
import TextInput from "../../helpers/TextInput";
import useMakeRequest from "../../hooks/useMakeRequest";
import DialogButtons from "./DialogButtons";
import TreeSystem from "./TreeSystem";

const FilterDialog = ({
  filterTypes = [],
  onFilter = (f) => f,
  dialog,
  excel = false,
}) => {
  const [store, dispatch] = useContext(AppStore);

  const [allOrgans, setAllOrgans] = useState([]);
  const [filterData, setFilterData] = useState({
    fromDate: getDatePickerFormat(store.filters.fromDate),
    toDate: getDatePickerFormat(store.filters.toDate),
    query: store.filters.query,
  });
  const [stages, setStages] = useState([]);
  const [regions, setRegions] = useState(store.filters.regions);
  const [statuses, setStatuses] = useState(store.filters.statuses);
  const [organs, setOrgans] = useState(store.filters.organs);
  const [priorities, setPriorities] = useState([]);
  const [categoryIds, setCategoryIds] = useState(
    store.filters.categoryIds || []
  );
  const [categoryTitles, setCategoryTitles] = useState([]);
  const [roles, setRoles] = useState(store.filters.roles || []);
  const [groupCategories, setGroupCategories] = useState(false);

  const [categoryDialog, setCategoryDialog] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  console.log(filterData);
  const { fromDate, toDate, query } = filterData;
  const lastStatuses = [
    {
      id: "ls-1",
      title: "در حال بررسی",
      value: 0,
    },
    {
      id: "ls-2",
      title: "پایان‌یافته",
      value: 1,
    },
    {
      id: "ls-3",
      title: "ارجاع به واحد بازرسی",
      value: 2,
    },
    {
      id: "ls-4",
      title: "تایید‌شده",
      value: 3,
    },
  ];

  const clearFilters = () => {
    onFilter(defaultFilters);
  };

  const handleChange = (name) => (e) => {
    setFilterData({ ...filterData, [name]: e.target.value });
  };

  const onDateChange = (date, name) => {
    setFilterData({ ...filterData, [name]: date });
  };

  const formatDate = (date) => {
    return date
      ? JalaliDate.jalaliToGregorian(date.year, date.month, date.day)
      : "";
  };

  const getDateFormat = (dateValues, type = "from") =>
    `${parseInt(dateValues[0])}-${parseInt(dateValues[1])}-${parseInt(
      dateValues[2]
    )}T${type === "from" ? "00:00:00.000" : "23:59:59.999"}Z`;

  const onQueryRequest = (e) => {
    e.preventDefault();
    const GregorianFrom = filterData.fromDate
      ? JalaliDate.jalaliToGregorian(
          filterData.fromDate.year,
          filterData.fromDate.month,
          filterData.fromDate.day
        )
      : "";
    const GregorianTo = filterData.toDate
      ? JalaliDate.jalaliToGregorian(
          filterData.toDate.year,
          filterData.toDate.month,
          filterData.toDate.day
        )
      : "";
    const fromDate = filterData.fromDate
      ? getDateFormat(GregorianFrom, "from")
      : "";
    const toDate = filterData.toDate ? getDateFormat(GregorianTo, "to") : "";
    const newStages = stages.map((s) => s.value);
    const newPriorities = priorities.map((s) => s.value);
    setStages(stages);
    setPriorities(priorities);
    onFilter({
      fromDate,
      toDate,
      query,
      categoryIds,
      stages: newStages,
      priorities: newPriorities,
      regions,
      organs,
      roles,
      groupCategories,
      statuses,
    });
  };

  const [] = useMakeRequest(
    InfoAPI.getExecutives,
    200,
    filterTypes.organs,
    null,
    (res) => {
      if (res.status === 200) {
        const allOrgans = res.data.map((o) => {
          return { label: o.title, value: o.id };
        });
        setAllOrgans(allOrgans);
      }
    }
  );

  const excelQueries = {
    fromDate: formatDate(filterData.fromDate),
    toDate: formatDate(filterData.toDate),
    query: filterData.query,
    categoryIds,
    regions,
    organs,
    statuses,
  };

  const getExcel = () => {
    setExcelLoading(true);
    const instanceId = getFromLocalStorage(
      constants.SHAHRBIN_MANAGEMENT_INSTANCE_ID
    );
    ReportsAPI.getExcel(excelQueries, instanceId).then((res) => {
      setExcelLoading(false);
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        const filename = new Date().getTime() + ".xlsx";
        link.setAttribute("download", filename);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
      }
    });
  };

  const onCategoriesSelected = (selecteds) => {
    const categoryIds = selecteds.map((s) => s.id);
    const categoryTitles = selecteds.map((s) => s.title);
    setCategoryIds(categoryIds);
    setCategoryTitles(categoryTitles);
  };

  // varibles
  const clearButton = {
    id: "clear-button",
    title: "پاک‌کردن",
    onClick: clearFilters,
    loading: false,
    style: {
      backgroundColor: "var(--glassPrimary)",
      color: "var(--primary)",
    },
    className: "rw1 w100 mx1",
  };
  return (
    <>
      {dialog && (
        <>
          <div className="w100 mx-a relative">
            <div className="w100 mxa row frc">
              {filterTypes.from && (
                <DatePickerConatiner
                  date={fromDate}
                  onSelect={onDateChange}
                  name="fromDate"
                  title="از تاریخ"
                  wrapperClassName="w100 px0"
                  containerClassName="col-md-12"
                  isInDialog={true}
                  id="fromDate"
                />
              )}
            </div>

            <div className="w100 mx-a relative frc">
              {filterTypes.to && (
                <DatePickerConatiner
                  date={toDate}
                  onSelect={onDateChange}
                  name="toDate"
                  title="تا تاریخ"
                  wrapperClassName="w100 px0"
                  containerClassName="col-md-12"
                  isInDialog={true}
                  id="toDate"
                />
              )}
            </div>

            <div className="w100 mxa row frc">
              {filterTypes.roles && (
                <MultiSelect
                  strings={{ label: "نقش‌ها" }}
                  caller={UserInfoAPI.getRoles}
                  defaultSelecteds={roles}
                  onChange={setRoles}
                  isStatic={false}
                  wrapperClassName="col-md-12"
                  nameKey="roleTitle"
                  valueKey="roleName"
                  maxHeight={300}
                  isInDialog={true}
                  id="roles-list"
                />
              )}
            </div>

            <div className="w100 mx-a relative frc">
              {filterTypes.category && (
                <TreeSystem
                  caller={CommonAPI.getSubjectGroups}
                  condition={categoryDialog}
                  setCondition={setCategoryDialog}
                  onChange={onCategoriesSelected}
                  onClose={() => setCategoryDialog(false)}
                  defaultSelecteds={categoryIds.map((c) => ({ id: c }))}
                  renderToggler={(selecteds, data) => {
                    return (
                      <TextInput
                        placeholder="انتخاب کنید."
                        title="گروه موضوعی"
                        readOnly={true}
                        onClick={() => setCategoryDialog(true)}
                        wrapperClassName="col-md-12"
                        inputClassName="pointer"
                        required={false}
                        value={selecteds
                          .map((s) => {
                            if (s.title) return s.title;
                            else {
                              const item = data.find((d) => d.id === s.id);
                              return item?.title;
                            }
                          })
                          .join(", ")}
                      />
                    );
                  }}
                ></TreeSystem>
              )}
            </div>

            <div className="w100 mxa row frc">
              {filterTypes.regions && (
                <MultiSelect
                  strings={{ label: "مناطق" }}
                  caller={ActorsAPI.getActorRegions}
                  onChange={setRegions}
                  isStatic={false}
                  wrapperClassName="col-md-12"
                  defaultSelecteds={regions}
                  isInDialog={true}
                  nameKey="regionName"
                  id="regions-list"
                />
              )}
            </div>

            <div className="w100 mxa row frc">
              {filterTypes.statuses && (
                <MultiSelect
                  strings={{ label: "وضعیت" }}
                  onChange={setStatuses}
                  isStatic={true}
                  staticData={lastStatuses}
                  wrapperClassName="col-md-12"
                  defaultSelecteds={statuses}
                  isInDialog={true}
                  id="statuses-list"
                  nameKey="title"
                  valueKey="value"
                />
              )}
            </div>

            <div className="w100 mxa row frc">
              {filterTypes.organs && allOrgans.length > 0 && (
                <MultiSelect
                  strings={{ label: "واحد های اجرایی" }}
                  selecteds={organs}
                  onChange={setOrgans}
                  isStatic={false}
                  caller={InfoAPI.getExecutives}
                  wrapperClassName="col-md-12"
                  nameKey="title"
                  valueKey="id"
                  defaultSelecteds={organs}
                  maxHeight={300}
                  id="organs-list"
                  isInDialog
                />
              )}
            </div>

            <div className="w100 mxa row frc">
              {filterTypes.query && (
                <form className="col-md-12" onSubmit={onQueryRequest}>
                  <TextInput
                    placeholder={"جستجو..."}
                    value={query}
                    title=" جستجو"
                    required={false}
                    onChange={handleChange}
                    name="query"
                    wrapperClassName="w100 px0"
                    focusonSelect={true}
                  />
                </form>
              )}
            </div>
          </div>
          <DialogButtons
            primaryTitle="اعمال"
            onPrimaryClick={onQueryRequest}
            secondaryTitle={excel ? "خروجی اکسل" : ""}
            onSecondaryClick={getExcel}
            secondaryLoading={excelLoading}
            secondaryStyle={{
              backgroundColor: "var(--glassSuccess)",
              margin: "0 10px",
              color: "var(--white)",
            }}
            otherButtons={[clearButton]}
          />
        </>
      )}
    </>
  );
};

export default FilterDialog;
