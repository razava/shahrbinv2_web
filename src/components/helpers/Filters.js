import React, { useContext, useState } from "react";
import styles from "../../stylesheets/filters.module.css";
import DialogToggler from "./DialogToggler";
import FilterDialog from "../commons/dialogs/FilterDialog";
import { AppStore } from "../../store/AppContext";
import { Tooltip } from "react-tooltip";

const modalRoot = document && document.getElementById("modal-root");

const Filters = ({
  filterTypes = {
    query: true,
    from: true,
    to: true,
    category: true,
    regions: true,
    organs: true,
    roles: true,
    statuses: true,
  },
  filtersData = {},
  wrapperClassName = "",
  toggleClassName = "",
  open = false,
  excel = false,
}) => {
  // store
  const [store, dispatch] = useContext(AppStore);

  const [dialog, setDialog] = useState(open);

  const openFilterDialog = (e) => {
    modalRoot.classList.add("active");
    setDialog(true);
  };

  const onFilter = (payload) => {
    console.log(payload);
    setDialog(false);
    modalRoot.classList.remove("active");
    dispatch({ type: "setFilters", payload });
  };
  return (
    <>
      <div className={[styles.wrapper, wrapperClassName].join(" ")}>
        <div
          data-tooltip-id="filter"
          className={["", toggleClassName].join(" ")}
        >
          <div className={styles.filterToggle} onClick={openFilterDialog}>
            {/* <span className={styles.filterToggleTitle}>فیلتر</span> */}
            <span key={"filter-icon"} className={styles.filterToggleIcon}>
              <i className="fas fa-filter"></i>
            </span>
          </div>
        </div>
      </div>
      <Tooltip
        style={{ fontSize: "10px",zIndex:100 }}
        id="filter"
        place="bottom"
        content={"فیلتر"}
      />
      <DialogToggler
        condition={dialog}
        setCondition={setDialog}
        width={600}
        isUnique={false}
        outSideClick={true}
        id="filters"
      >
        <FilterDialog
          filterTypes={filterTypes}
          filtersData={filtersData}
          onFilter={onFilter}
          dialog={dialog}
          excel={excel}
        />
      </DialogToggler>
    </>
  );
};

export default Filters;
