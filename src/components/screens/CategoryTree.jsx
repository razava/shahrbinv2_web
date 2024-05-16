import React from "react";
// import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
// import { IoMdArrowDropright } from "react-icons/io";
import cx from "classnames";

import TreeView, { flattenTree } from "react-accessible-treeview";
import { Tree } from "react-arborist";

function CategoryTree({ Data }) {
  console.log(Data.categories);
  const data = Data.categories?.[0].categories;

  function stringifyIds(tree) {
    // Base case: if the tree is empty, return an empty array
    if (!tree || tree.length === 0) {
      return [];
    }

    // Map over each node in the tree
    return tree.map((node) => {
      // Convert the id to a string
      const stringifiedNode = { ...node, id: String(node.id) };

      // If the node has children, recursively stringify their IDs
      if (node.categories && node.categories.length > 0) {
        stringifiedNode.categories = stringifyIds(node.categories);
      }

      return stringifiedNode;
    });
  }
  const newData = stringifyIds(Data.categories);
  console.log(newData);
  return (
    <Tree
      data={newData}
      openByDefault={false}
      width={600}
      // height={1000}
      indent={24}
      rowHeight={36}
      paddingTop={30}
      paddingBottom={10}
      padding={25 /* sets both */}
      /* An accessor can provide a string property name */
      // idAccessor="title"
      /* or a function with the data as the argument */
      // idAccessor="id"
      childrenAccessor={(d) => d.categories}
    >
      {Node}
    </Tree>
  );
}

export default CategoryTree;

function Node({ node, style, dragHandle }) {
  console.log("🚀 ~ Node ~ node:", node);
  console.log(style);
  /* This node instance can do many things. See the API reference. */
  return (
    <div
      onClick={() => node.toggle()}
      style={{ paddingRight: node.level * 24 }}
      className=" text-2xl"
      ref={dragHandle}
    >
      {/* {node.isLeaf ? <Folder /> : <File />} */}
      {node.data.title}
    </div>
  );
}
