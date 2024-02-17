import React, { useContext } from "react";
import useFields from "../../assets2/hooks/useFields";
import { AppStore } from "../../formStore/store";
import Controller from "../Controller/Controller";
import DragnDrop from "../DragnDrop/DragnDrop";
import TextInput from "../TextInput/TextInput";
import styles from "./styles.module.css";
import Optional from "./Elements/Optional";
import TextArea from "../TextArea/TextArea";
import RadioGroup from "../Radio/RadioGroup";
import CheckBoxGroup from "../CheckBox/CheckBoxGroup";
import Header from "../Header/Header";
import TreeSystem from "../Tree/TreeSystem";
import DropZone from "../FileDrop/DropZone";
import Signature from "../Signature/Signature";
import Message from "../Message/Message";
import Container from "../Container/Container";
import { appActions } from "../../utils/constants";

const FormEditor = () => {
  // store
  const [store, dispatch] = useContext(AppStore);

  // hooks
  const { addField } = useFields();

  // variables
  const { form = [], isDragging = {} } = store;

  // functions
  const handleDrop = (e, index, dropzoneId) => {
    const containerId =
      e.currentTarget.children[0].dataset.containerid || dropzoneId;
    if (isDragging.tool) addField(isDragging?.tool, index, containerId);
  };

  const onSort = (newList) => {
    dispatch({ type: appActions.UPDATE_LIST, payload: newList });
  };

  // renders
  const renderController = (field) => {
    if (field.elementCategory === "input" && field.items.length === 0)
      return renderInput(field);
    else if (field.elementCategory === "container") {
      if (field.elementType === "container") {
        return (
          <Controller key={field.id} field={field} containerId={field.id}>
            <Container
              {...field}
              renderInput={renderInput}
              handleDrop={handleDrop}
            />
          </Controller>
        );
      }
    }
  };

  const renderInput = (field) => {
    if (field.elementType === "text") {
      return (
        <Controller key={field.id} field={field}>
          <TextInput {...field.props} />
        </Controller>
      );
    } else if (field.elementType === "select") {
      return (
        <Controller key={field.id} field={field}>
          <Optional field={field} />
        </Controller>
      );
    } else if (field.elementType === "textarea") {
      return (
        <Controller key={field.id} field={field}>
          <TextArea {...field.props} />
        </Controller>
      );
    } else if (field.elementType === "radio") {
      return (
        <Controller key={field.id} field={field}>
          <RadioGroup {...field.props} />
        </Controller>
      );
    } else if (field.elementType === "checkbox") {
      return (
        <Controller key={field.id} field={field}>
          <CheckBoxGroup {...field.props} />
        </Controller>
      );
    } else if (field.elementType === "header") {
      return (
        <Controller key={field.id} field={field}>
          <Header {...field.props} />
        </Controller>
      );
    } else if (field.elementType === "tree") {
      return (
        <Controller key={field.id} field={field}>
          <TreeSystem {...field.props} />
        </Controller>
      );
    } else if (field.elementType === "dropzone") {
      return (
        <Controller key={field.id} field={field}>
          <DropZone {...field.props} />
        </Controller>
      );
    } else if (field.elementType === "signature") {
      return (
        <Controller key={field.id} field={field}>
          <Signature {...field.props} />
        </Controller>
      );
    } else if (field.elementType === "message") {
      return (
        <Controller key={field.id} field={field}>
          <Message {...field.props} />
        </Controller>
      );
    }
  };

  const dragndropData = [
    {
      id: "drag-group-1",
      items: form,
    },
  ];
  return (
    <>
      <section className={styles.formEditor}>
        <DragnDrop
          data={dragndropData}
          renderItem={renderController}
          onDrop={handleDrop}
          onSort={onSort}
        />
      </section>
    </>
  );
};

export default FormEditor;
