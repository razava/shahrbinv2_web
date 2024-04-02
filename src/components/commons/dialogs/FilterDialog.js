import React, { lazy, useContext, useEffect, useState } from "react";
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
import { Modal } from "react-responsive-modal";
import DialogToggler from "../../helpers/DialogToggler";
const ScatterMap = lazy(() => import("../map/ScatterMap"));

const FilterDialog = ({
  filterTypes = [],
  onFilter = (f) => f,
  dialog,
  excel = false,
  filtersData = {},
}) => {
  const [store, dispatch] = useContext(AppStore);
  const [open, setOpen] = useState(false);
  const [mapDialog, setMapDialog] = useState(false);

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
  const [geometry, setGeometry] = useState(store.filters.geometry);
  const [reportsToInclude, setReportsToInclude] = useState(
    store.filters.reportsToInclude
  );
  const [satisfactionValues, setSatisfactionValues] = useState(
    store.filters.satisfactionValues
  );
  const [priorities, setPriorities] = useState(store.filters.priorities);
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
  console.log(store.filters);
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
    const newPriorities = priorities?.map((s) => s.value);
    setStages(stages);
    setPriorities(priorities);
    console.log(reportsToInclude);
    console.log(organs);
    onFilter({
      fromDate,
      toDate,
      query,
      categoryIds,
      stages: newStages,
      priorities: priorities,
      regions,
      organs,
      roles,
      groupCategories,
      statuses,
      satisfactionValues,
      reportsToInclude,
      geometry,
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
                  containerClassName="col-sm-12 col-md-6"
                  isInDialog={true}
                  id="fromDate"
                />
              )}{" "}
              {filterTypes.to && (
                <DatePickerConatiner
                  date={toDate}
                  onSelect={onDateChange}
                  name="toDate"
                  title="تا تاریخ"
                  wrapperClassName="w100 px0"
                  containerClassName="ccol-sm-12 col-md-6"
                  isInDialog={true}
                  id="toDate"
                />
              )}
            </div>
            <div className="w100 mx-a relative frc"></div>
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
              {filterTypes?.category && (
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
              {filterTypes?.regions && (
                <MultiSelect
                  strings={{ label: "مناطق" }}
                  // caller={ActorsAPI.getActorRegions}
                  onChange={setRegions}
                  defaultSelecteds={regions}
                  isStatic={true}
                  staticData={filtersData.regions}
                  wrapperClassName="col-md-12"
                  isInDialog={true}
                  nameKey="title"
                  valueKey="value"
                  id="regions-list"
                />
              )}
            </div>
            <div className="w100 mxa row frc">
              {filterTypes?.statuses && (
                <MultiSelect
                  strings={{ label: "وضعیت" }}
                  onChange={setStatuses}
                  isStatic={true}
                  staticData={filtersData?.states}
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
              {filterTypes?.reportsToInclude && (
                <MultiSelect
                  strings={{ label: "شامل درخواست های" }}
                  onChange={setReportsToInclude}
                  isStatic={true}
                  staticData={filtersData?.reportsToInclude}
                  wrapperClassName="col-md-12"
                  defaultSelecteds={reportsToInclude}
                  isInDialog={true}
                  id="reportsToInclude-list"
                  nameKey="title"
                  valueKey="value"
                  maxHeight={300}
                />
              )}
            </div>
            <div className="w100 mxa row frc">
              {filterTypes?.satisfactionValues && (
                <MultiSelect
                  strings={{ label: "میزان رضایت" }}
                  // selecteds={minSatisfaction}
                  onChange={setSatisfactionValues}
                  isStatic={true}
                  // caller={InfoAPI.getExecutives}
                  wrapperClassName="col-md-12"
                  nameKey="title"
                  valueKey="value"
                  staticData={filtersData?.satisfactionValues}
                  defaultSelecteds={satisfactionValues}
                  maxHeight={300}
                  id="minSatisfaction-list"
                  isInDialog
                />
              )}
            </div>
            <div className="w100 mxa row frc">
              {filterTypes?.priorities && (
                <MultiSelect
                  strings={{ label: "اولویت" }}
                  // selecteds={minSatisfaction}
                  onChange={setPriorities}
                  isStatic={true}
                  // caller={InfoAPI.getExecutives}
                  wrapperClassName="col-md-12"
                  nameKey="title"
                  valueKey="value"
                  staticData={filtersData?.priorities}
                  defaultSelecteds={priorities}
                  maxHeight={300}
                  id="minSatisfaction-list"
                  isInDialog
                />
              )}
            </div>
            <div className="w100 mxa row frc">
              {filterTypes.executives && (
                <MultiSelect
                  strings={{ label: "واحد های اجرایی" }}
                  selecteds={organs}
                  onChange={setOrgans}
                  isStatic={true}
                  staticData={filtersData.executives}
                  // caller={InfoAPI.getExecutives}
                  wrapperClassName="col-md-12 h-[50px]"
                  inputClassName=""
                  nameKey="title"
                  valueKey="value"
                  defaultSelecteds={organs}
                  maxHeight={200}
                  id="organs-list"
                  isInDialog
                />
              )}
            </div>
            {/* {filterTypes.Map && ( */}
            {/* <div className="mx-[15px] my-1">
              <Button
                title="نقشه"
                className="py1 br05 bg-primary w-full"
                onClick={() => setOpen(true)}
                // loading={createLoading}
              />
            </div> */}
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              center
              modalId="filter"
              styles={{ direction: "rtl" }}
              //   classNames={styles.customModal}
            >
              <h2 className="mt-10 font-bold text-2xl mb-5">انتخاب ناحیه</h2>
              {/* <ScatterMap
                className=" !w-full"
                height={300}
                mode="filter"
                locations={[]}
              /> */}
            </Modal>
            {/* {filterTypes.geometry && (
              <div className=" w-full px-2 py-1">
                <p className=" text-lg">انتخاب ناحیه</p>
                <ScatterMap className=" !w-full" height={300} mode="filter" locations={[]} />
              </div>
            )} */}
            {filterTypes?.geometry && (
              <div className="w100 mxa row frc">
                <TextInput
                  value={geometry}
                  name="address"
                  // onChange={handleChange}
                  required={false}
                  title="نقشه"
                  wrapperClassName="col-md-12"
                  inputClassName="pointer bg-white"
                  icon="fas fa-map-marker-alt"
                  iconClassName="f15 text-color"
                  onIconClick={() => setMapDialog(true)}
                  onClick={() => setMapDialog(true)}
                  readOnly={true}
                >
                  <DialogToggler
                    condition={mapDialog}
                    setCondition={setMapDialog}
                    // loading={mapLoading}
                    width={700}
                    isUnique={false}
                    outSideClickEvent={"mousedown"}
                    id="select-on-map-dialog"
                  >
                    <ScatterMap
                      // className=" !w-full"
                      width={650}
                      height={400}
                      mode="filter"
                      locations={[]}
                      handelDrawInteraction={(coordinates) => {
                        setGeometry(coordinates);
                        setMapDialog(false);
                      }}
                    />
                  </DialogToggler>
                </TextInput>
              </div>
            )}

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
