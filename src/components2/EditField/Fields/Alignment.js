import useFields from "../../../assets2/hooks/useFields";
import RadioGroup from "../../Radio/RadioGroup";
import styles from "../styles.module.css";

const options = [
  {
    id: "align-left",
    title: "چپ",
    value: "flex-end",
  },
  {
    id: "align-center",
    title: "وسط",
    value: "center",
  },
  {
    id: "align-right",
    title: "راست",
    value: "flex-start",
  },
];

const Alignment = ({ props = {} }) => {
  // hooks
  const { addChange, store } = useFields();

  const handleChange = (value) => {
    addChange({
      style: {
        ...store.edit?.field?.props?.style,
        ...{
          alignItems: value.value,
        },
      },
    });
  };
  return (
    <>
      <section className={styles.group}>
        <span className={styles.label}>مکان</span>
        <RadioGroup
          options={options}
          defaultValue={
            props.style.alignItems
              ? { value: props.style.alignItems }
              : options[2]
          }
          onChange={handleChange}
        />
      </section>
    </>
  );
};

export default Alignment;
