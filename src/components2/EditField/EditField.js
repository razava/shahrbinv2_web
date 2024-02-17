import React, { useContext } from "react";
import useFields from "../../assets2/hooks/useFields";
import { AppStore } from "../../formStore/store";
import Dialog from "../Dialog/Dialog";
import Tabs from "../Tabs/Tabs";
import { editTabs } from "./constants";
import styles from "./styles.module.css";
import Button from "../Button/Button";
import GeneralTab from "./Tabs/GeneralTab";
import StyleTab from "./Tabs/StyleTab";

const EditField = () => {
  //   store
  const [store, dispatch] = useContext(AppStore);

  //   hooks
  const { closeEditDialog, updateField } = useFields();

  // variables
  const { edit = {} } = store;
  const { open, field } = edit;

  //   functions
  const saveFields = (e) => {
    e.preventDefault();

    updateField({
      id: field.id,
      props: { ...field.props, ...store.edit.changes },
    });
    closeEditDialog();
  };

  const renderEditFields = (editTab) => {
    if (editTab.value === "general") return <GeneralTab tab={editTab} />;
    else if (editTab.value === "style") return <StyleTab tab={editTab} />;
  };
  return (
    <>
      <Dialog
        visible={open}
        onClose={closeEditDialog}
        title={field.elementType}
        classNames={{
          container: styles.dialogContainer,
          header: styles.dialogHeader,
          closeButton: styles.dialogCloseButton,
        }}
        id="edit-field"
      >
        <Tabs
          classNames={{
            tabs: styles.editTabs,
            tab: styles.editTab,
            active: styles.activeEditTab,
            indicator: styles.editTabIndicator,
          }}
        >
          {editTabs.map((editTab) => (
            <div key={editTab.id} id={editTab.id} label={editTab.title}>
              <div className={styles.editFields}>
                {renderEditFields(editTab)}
              </div>
            </div>
          ))}
        </Tabs>

        <div className={styles.buttonGroup}>
          <Button onClick={saveFields}>ذخیره</Button>
        </div>
      </Dialog>
    </>
  );
};

export default EditField;
