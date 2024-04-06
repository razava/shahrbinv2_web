import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export const cn = (...arg) => [...arg].join(" ");

export const createId = () => uuidv4();

export const has = (item, items = []) => items.includes(item);

export const stopPropagation = (e) => (fn) => {
  e.stopPropagation();
  fn();
};

export const getAllBranches = (tree, treeKey) => {
  const children = [];
  if (tree[treeKey]) {
    tree[treeKey].forEach((child) => {
      children.push(child);
      children.push(...getAllBranches(child, treeKey));
    });
  }
  return children;
};

export const formatLabel = (str, maxwidth) => {
  var sections = [];
  var words = str.split(" ");
  var temp = "";

  words.forEach(function (item, index) {
    if (temp.length > 0) {
      var concat = temp + " " + item;

      if (concat.length > maxwidth) {
        sections.push(temp);
        temp = "";
      } else {
        if (index == words.length - 1) {
          sections.push(concat);
          return;
        } else {
          temp = concat;
          return;
        }
      }
    }

    if (index == words.length - 1) {
      sections.push(item);
      return;
    }

    if (item.length < maxwidth) {
      temp = item;
    } else {
      sections.push(item);
    }
  });

  return sections;
};

export const findParent = (tree, treeKey, item) => {
  const allNodes = getAllBranches(tree, treeKey);
  let parent;
  for (let i = 0; i < allNodes.length; i++) {
    const node = allNodes[i];
    if (node[treeKey].some((n) => n.id === item.id)) {
      parent = node;
      break;
    }
  }
  return parent;
};

export const getExtension = (path) =>
  String(path).split(".")[String(path).split(".").length - 1];

export const isImage = (path) =>
  [
    "jpg",
    "jpeg",
    "jpe",
    "jif",
    "jfif",
    "jfi",
    "png",
    "gif",
    "tiff",
    "tif",
    "svg",
    "svgz",
  ].some((ext) => ext === getExtension(path).toLowerCase());

export const checkExtension = (path, allowedExtensions = []) => {
  const extension = getExtension(path);
  return allowedExtensions.indexOf(extension.toLowerCase()) !== -1;
};

export const checkOverlAllSize = (attachments, MAX_SIZE) => {
  const overallSize = attachments.reduce((t, a) => t + a.size, 0);
  console.log(overallSize, MAX_SIZE);
  if (overallSize > MAX_SIZE) {
    return false;
  } else return true;
};

export const showSizeError = (maxSize) => {
  toast(`حجم پیوست‌ها نمی‌تواند از ${maxSize} مگابایت بیشت باشد.`, {
    type: "error",
  });
};

export const showExtensionError = () => {
  toast("فرمت فایل انتخابی مجاز نیست.", { type: "error" });
};

export const findNodeAndDelete = (data, keys = {}, node) => {
  if (data[keys.tree]) {
    data[keys.tree].forEach((d) => {
      if (d[keys.value] === node[keys.value]) {
        data[keys.tree] = data[keys.tree].filter(
          (d) => d[keys.value] !== node[keys.value]
        );
        return data;
      } else {
        d = findNodeAndDelete(d, keys, node);
        return data;
      }
    });
    return data;
  }
};

export const findNodeAndClone = (data, keys = {}, node, newData = {}) => {
  // debugger;
  let isFound = false;
  if (data[keys.tree] && !isFound) {
    newData = { ...data };
    data[keys.tree].forEach((d) => {
      if (d[keys.value] === node[keys.value] && !isFound) {
        isFound = true;
        const index = data[keys.tree].findIndex(
          (field) => field[keys.value] === node[keys.value]
        );
        newData[keys.tree].splice(index, 0, {
          ...d,
          id: createId(),
          children: d?.children?.map((c) => ({ ...c, id: createId() })),
        });
        return newData;
      } else {
        d = findNodeAndClone(d, keys, node, newData);
        return newData;
      }
    });
    return newData;
  }
};


export function findNodeAndParents(tree, target, path = []) {
  for (const node of tree) {
    // Check if the current node matches the target
    if (node.id === target) {
      // Return both the node and its parents
      return [...path, node];
    }

    // If the current node has children, recursively search them
    if (node.categories && node.categories.length > 0) {
      const result = findNodeAndParents(node.categories, target, [
        ...path,
        node,
      ]);
      // If the target is found in the subtree, return the result
      if (result) {
        return result;
      }
    }
  }
  // If target is not found, return null
  return null;
}