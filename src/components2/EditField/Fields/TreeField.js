import React, { useEffect, useState } from "react";
import useFields from "../../../assets2/hooks/useFields";
import { cn, getAllBranches } from "../../../utils/functions";
import Icon from "../../Icon/Icon";
import TreeSystem from "../../Tree/TreeSystem";
import styles from "../styles.module.css";

const TreeField = ({
  fieldName = "",
  fieldLabel = "",
  props = {},
  treeKey = "",
  dataKey = "",
}) => {
  // states
  const [flatData, setFlatData] = useState([]);
  const [data, setAllData] = useState(props[dataKey]);

  //   hooks
  const { addChange } = useFields();

  //   functions
  const handleChange = (data) => {
    setAllData(data);
    addChange({ [dataKey]: data });
  };

  // effects
  useEffect(() => {
    const flatItems = getAllBranches(props[dataKey], treeKey);
    setAllData(props[dataKey]);
    setFlatData(flatItems);
  }, [props[dataKey]]);
  return (
    <>
      <section className={cn(styles.group)}>
        <span className={styles.label}>گزینه ها</span>
        <TreeSystem
          defaultSelecteds={[]}
          data={data}
          edit
          onChange={handleChange}
          renderToggle={(setCondition) => (
            <Icon
              name="pen"
              classNames={{ icon: styles.icon }}
              onClick={() => setCondition(true)}
              data={props[dataKey]}
              edit
            />
          )}
        />
      </section>
    </>
  );
};

export default TreeField;
