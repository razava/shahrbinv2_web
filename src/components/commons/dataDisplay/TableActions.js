import React from "react";
import DropdownWrapper from "../../helpers/DropdownWrapper";

const Threshold = 4;

const TableActions = ({
  actions = [],
  total = 0,
  perPage = 10,
  rowData = {},
  index,
}) => {
  const iconDisplay = (
    <section className="frc">
      {actions
        .filter((a) => !a.hide)
        .map((action, i) => (
          <span
            key={action.id + new Date().getTime()}
            title={
              typeof action.icon === "function"
                ? action.title(rowData)
                : action.title
            }
            onClick={() => action.onClick(rowData)}
            className="text-primary f2 pointer ml1"
          >
            <i
              className={
                typeof action.icon === "function"
                  ? action.icon(rowData)
                  : action.icon
              }
            ></i>
          </span>
        ))}
    </section>
  );

  const dropdownDisplay = (
    <DropdownWrapper
      toggleElement={
        <button
          type="button"
          className="bg-transparent text-color border-none pointer"
        >
          <i className="fas fa-ellipsis-v"></i>
        </button>
      }
      position="right"
      theme={{ background: "var(--white)", color: "var(--dark)" }}
      index={index}
      total={total > perPage ? perPage : total}
    >
      <>
        {actions.map((action, i) => (
          <div
            key={action.id}
            onClick={() => action.onClick(rowData)}
            className="border-none pointer bg-transparent w100 py1 text-dark bg-white hv-light"
          >
            <span>
              {typeof action.icon === "function"
                ? action.title(rowData)
                : action.title}
            </span>
          </div>
        ))}
      </>
    </DropdownWrapper>
  );

  const renderActions = () =>
    actions.length > Threshold ? dropdownDisplay : iconDisplay;
  return (
    <>
      <section>{renderActions()}</section>
    </>
  );
};

export default TableActions;
