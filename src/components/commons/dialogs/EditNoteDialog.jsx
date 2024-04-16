import React, { useState } from "react";
import Textarea from "../../helpers/Textarea";
import Button from "../../helpers/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putReportNote } from "../../../api/StaffApi";
import { toast } from "react-toastify";

const modalRoot = document && document.getElementById("modal-root");

export default function EditNoteDialog({ noteData }) {
  const [note, setNote] = useState(noteData.text);
  const queryClient = useQueryClient();

  const putNoteMutation = useMutation({
    mutationKey: ["putNote"],
    mutationFn: putReportNote,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      modalRoot.classList.remove("modal-root");
    },
    onError: (err) => {},
  });

  return (
    <>
      <Textarea
        value={note}
        title="یادداشت"
        wrapperClassName="mxa"
        resize={false}
        inputClassName=" h-44 of-x-hidden px-1"
        handleChange={(name) => (e) => setNote(e.target.value)}
      />
      <div className="w100 mxa fre py1 px2 border-t-light mt1">
        <Button
          title={"ویرایش"}
          className="py1 br05 bg-primary"
          onClick={() =>
            putNoteMutation.mutate({
              payload: { text: note },
              noteId: noteData.id,
            })
          }
          //   loading={loading}
        />
      </div>
    </>
  );
}
