import React, { useContext } from "react";
import { AppStore } from "../../../formStore/store";
import { has } from "../../../utils/functions";
import Alignment from "../Fields/Alignment";
import BackgroundColor from "../Fields/BackgroundColor";
import Color from "../Fields/Color";
import FontSize from "../Fields/FontSize";
import Rows from "../Fields/Rows";

const StyleTab = ({ tab }) => {
  //   store
  const [store] = useContext(AppStore);

  // variables
  const { edit = {} } = store;
  const { field } = edit;
  return (
    <>
      {has("background-color", tab.fields[field.elementType]) && (
        <BackgroundColor {...field} />
      )}
      {has("color", tab.fields[field.elementType]) && <Color {...field} />}
      {has("font-size", tab.fields[field.elementType]) && (
        <FontSize {...field} />
      )}
      {has("rows", tab.fields[field.elementType]) && <Rows {...field} />}
      {has("alignment", tab.fields[field.elementType]) && (
        <Alignment {...field} />
      )}
    </>
  );
};

export default StyleTab;
