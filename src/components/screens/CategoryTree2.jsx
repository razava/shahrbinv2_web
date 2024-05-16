import React, { useState } from "react";
// import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
// import { IoMdArrowDropright } from "react-icons/io";
import cx from "classnames";
import { IoMdArrowDropright } from "react-icons/io";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";

import TreeView, { flattenTree } from "react-accessible-treeview";
import { Tooltip } from "react-tooltip";
import Button from "../helpers/Button";
const folder = {
  name: "",
  children: [
    {
      name: "Fruits",
      children: [
        { name: "Avocados" },
        { name: "Bananas" },
        { name: "Berries" },
        { name: "Oranges" },
        { name: "Pears" },
      ],
    },
    {
      name: "Drinks",
      children: [
        { name: "Apple Juice" },
        { name: "Chocolate" },
        { name: "Coffee" },
        {
          name: "Tea",
          children: [
            { name: "Black Tea" },
            { name: "Green Tea" },
            { name: "Red Tea" },
            { name: "Matcha" },
          ],
        },
      ],
    },
    {
      name: "Vegetables",
      children: [
        { name: "Beets" },
        { name: "Carrots" },
        { name: "Celery" },
        { name: "Lettuce" },
        { name: "Onions" },
      ],
    },
  ],
};

const data = flattenTree(folder);
console.log(data);
function CategoryTree2({ Data, editCategory, changeCategoryState }) {
  const [expandedIds, setExpandedIds] = useState();

  function stringifyIds(tree) {
    // Base case: if the tree is empty, return an empty array
    if (!tree || tree.length === 0) {
      return [];
    }

    // Map over each node in the tree
    return tree.map((node) => {
      // Convert the id to a string
      //   console.log(node);
      const stringifiedNode = {
        ...node,
        children: node?.categories ? node.categories : [],
      };
      //   console.log(stringifiedNode);
      // If the node has children, recursively stringify their IDs
      if (node.categories && node.categories.length > 0) {
        stringifiedNode.categories = stringifyIds(node.categories);
      }

      return stringifiedNode;
    });
  }

  function convertCategoriesToChildren(categories) {
    return categories.map((category) => {
      const newNode = {
        name: category.title,
        metadata: { category: category },
        ...category,
      };
      if (category.categories) {
        newNode.children = convertCategoriesToChildren(category.categories);
      }
      return newNode;
    });
  }

  Data.children = convertCategoriesToChildren(Data.categories);
  console.log(Data);
  //   const newData = stringifyIds(Data);
  //   console.log(newData);
  return (
    <div className=" bg-white min-h-full">
      <div className=" pt-5 px-2 -mb-5">
        <Button
          title="بستن همه"
          outline={true}
          className="!border-none"
          onClick={() => setExpandedIds([])}
          //   loading={createLoading}
        />
      </div>
      <div className="checkbox">
        <TreeView
          data={flattenTree(Data)}
          aria-label="Checkbox tree"
          multiSelect
          propagateSelect
          propagateSelectUpwards
          defaultDisabledIds={[1, 5]}
          expandedIds={expandedIds}
          togglableSelect
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            isSelected,
            isDisabled,
            isHalfSelected,
            getNodeProps,
            level,
            handleSelect,
            handleExpand,
            dispatch,
          }) => {
            return (
              <>
                <div
                  {...getNodeProps({ onClick: handleExpand })}
                  style={{
                    marginRight: 40 * (level - 1),
                    opacity: element.metadata.category.isDeleted ? 0.5 : 1,
                    // minWidth:"30px"
                  }}
                >
                  {isBranch && <ArrowIcon isOpen={isExpanded} />}
                  {/* <CheckBoxIcon
                    className="checkbox-icon"
                    onClick={(e) => {
                      handleSelect(e);
                      e.stopPropagation();
                    }}
                    variant={
                      isHalfSelected ? "some" : isSelected ? "all" : "none"
                    }
                  /> */}
                  {console.log(element)}
                  <span className="name">{element.name}</span>
                </div>
                <button
                  onClick={() => editCategory(element.metadata.category)}
                  className="bg-gray-200"
                  //   onClick={() =>
                  //     dispatch({
                  //       type: isDisabled ? "ENABLE" : "DISABLE",
                  //       id: element.id,
                  //     })
                  //   }
                >
                  <i
                    style={{ fontSize: "large" }}
                    className="fas fa-edit text-primary mr-3"
                    data-tooltip-id={element.id + "edit"}
                  ></i>
                  <Tooltip
                    style={{ fontSize: "10px", zIndex: 100 }}
                    id={element.id + "edit"}
                    place="bottom"
                    content={"ویرایش"}
                  />
                </button>
                <button
                  onClick={() => changeCategoryState(element.metadata.category)}
                  className=" mr-2"
                >
                  {element.metadata.category.isDeleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-recycle text-primary -mb-1"
                      data-tooltip-id={element.id + "recycle"}
                    >
                      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                      <path d="m14 16-3 3 3 3" />
                      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
                      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
                      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-x text-primary -mb-1"
                      data-tooltip-id={element.id + "x"}
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  )}
                  <Tooltip
                    style={{ fontSize: "10px", zIndex: 100 }}
                    id={element.id + "recycle"}
                    place="bottom"
                    content={"فعال کردن"}
                  />
                  <Tooltip
                    style={{ fontSize: "10px", zIndex: 100 }}
                    id={element.id + "x"}
                    place="bottom"
                    content={"غیر‌فعال کردن"}
                  />
                  {/* {isDisabled ? "Enable" : "Disable"} */}
                </button>
              </>
            );
          }}
        />
      </div>
    </div>
  );
}

const ArrowIcon = ({ isOpen }) =>
  isOpen ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-down text-gray-500 -mb-2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-left text-gray-500 -mb-1"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );

// const CheckBoxIcon = ({ variant, ...rest }) => {
//   switch (variant) {
//     case "all":
//       return <FaCheckSquare {...rest} />;
//     case "none":
//       return <FaSquare {...rest} />;
//     case "some":
//       return <FaMinusSquare {...rest} />;
//     default:
//       return null;
//   }
// };

export default CategoryTree2;
