import React, { useEffect, useState } from "react";
import Textarea from "../../helpers/Textarea";
import Button from "../../helpers/Button";
import {
  deleteReportNote,
  getReportNotes,
  postReportNote,
  putReportNote,
} from "../../../api/StaffApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { convertserverTimeToDateString } from "../../../helperFuncs";
import { toast } from "react-toastify";

export default function Notes({ data }) {
  const [note, setNote] = useState();
  const [values, setValues] = useState();
  const queryClient = useQueryClient();
  //Queries
  const noteMutation = useMutation({
    mutationKey: ["postNote"],
    mutationFn: postReportNote,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getReportNotes"] });
      toast("یادداشت با موفقیت ثبت شد.", { type: "success" });
      setNote("");
    },
    onError: (err) => {},
  });

  const putNoteMutation = useMutation({
    mutationKey: ["putNote"],
    mutationFn: putReportNote,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getReportNotes"] });
      toast("یادداشت با موفقیت ویرایش شد.", { type: "success" });
    },
    onError: (err) => {},
  });

  const deleteNoteMutation = useMutation({
    mutationKey: ["deleteNote"],
    mutationFn: deleteReportNote,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getReportNotes"] });
      toast("یادداشت با موفقیت حذف شد.", { type: "success" });
    },
    onError: (err) => {},
  });

  const {
    data: Notes,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["getReportNotes"],
    queryFn: () => getReportNotes(data.id),
  });

  console.log(Notes);
  const handelPostNote = () => {
    if (note) {
      noteMutation.mutate({
        payload: {
          text: note,
        },
        ReportId: data.id,
      });
    }
  };

  const handelChange = (name) => (e) => {
    const value = e.target.value;
    setValues({ ...values, [name]: { text: value, readOnly: false } });
  };
  useEffect(() => {
    console.log(Notes);
    console.log("2222222");
    if (Notes) {
      let obj = {};
      Notes.map((item, index) => {
        obj[index] = { text: item.text, readOnly: true };
      });
      console.log(obj);
      setValues(obj);
    }
  }, [Notes]);

  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <div className=" flex flex-col h-full">
      <div
        // style={{ height: "calc(100% - 150px)" }}
        className=" h-2/3 overflow-y-auto"
      >
        <p className=" text-xl mt-4 font-bold mr-14 mb-5">یادداشت ها</p>
        {Notes?.length == 0 && (
          <p className=" mt-2 mr-14">هیج یادداشتی وجود ندارد.</p>
        )}
        {}
        {Notes?.map((item, index) => {
          return (
            <>
              {/* <p className=" text-center">
                {convertserverTimeToDateString(item.created)}
              </p> */}
              <h3 class="flex items-center w-full my-2">
                <span class="flex-grow bg-gray-300 !h-2"></span>
                <span class="mx-3 text-lg font-medium">
                  {convertserverTimeToDateString(item.created)}
                </span>
                <span class="flex-grow bg-gray-300 !h-2"></span>
              </h3>
              <div className=" relative flex items-center w-full px-2 justify-between">
                {/* <p className=" text-2xl self-start mt-3">{index + 1}</p> */}
                <Textarea
                  value={values && values[index]?.text}
                  title="یادداشت"
                  wrapperClassName=" w-full"
                  name={index}
                  resize={false}
                  readOnly={values && values[index]?.readOnly}
                  inputClassName=" h-44 of-x-hidden text-right px-1 "
                  handleChange={handelChange}
                />
                <div
                  className={`${
                    values && values[index]?.readOnly == false
                      ? "hidden"
                      : "flex"
                  } rounded-md flex flex-col justify-center items-center gap-5 ml-1`}
                >
                  <div
                    onClick={() =>
                      setValues({
                        ...values,
                        [index]: {
                          readOnly: false,
                          text: item.text,
                        },
                      })
                    }
                  >
                    <i
                      className="fas fa-edit cursor-pointer hover:scale-125 transition"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <div onClick={() => deleteNoteMutation.mutate(item.id)}>
                    <i
                      className="fas fa-trash  cursor-pointer mr-1 hover:scale-125 transition"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                </div>
                <div
                  className={`${
                    values && values[index]?.readOnly && "hidden"
                  } rounded-md flex flex-col justify-center items-center gap-5 ml-1`}
                >
                  <div
                    onClick={() =>
                      setValues({
                        ...values,
                        [index]: {
                          readOnly: true,
                          text: item.text,
                        },
                      })
                    }
                  >
                    <i
                      className="fas fa-times cursor-pointer hover:scale-125 transition"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <div
                    onClick={() => {
                      setValues({
                        ...values,
                        [index]: {
                          readOnly: true,
                          text: item.text,
                        },
                      });
                      putNoteMutation.mutate({
                        noteId: item.id,
                        payload: { text: values[index].text },
                      });
                    }}
                  >
                    <i
                      className="fas fa-check  cursor-pointer mr-1 hover:scale-125 transition"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <div className="w-full mxa fre py1 px2 border-t-light mt1  flex !flex-col justify-center z-100 h-1/3">
        {" "}
        <Textarea
          value={note}
          title="یادداشت"
          wrapperClassName="mxa w-full"
          resize={false}
          inputClassName=" h-44 of-x-hidden text-right px-1"
          handleChange={(name) => (e) => setNote(e.target.value)}
        />
        <Button
          title="افزودن"
          className="py1 br05 bg-primary self-end ml-5 mt-2"
          onClick={handelPostNote}
          //   loading={createLoading}
        />
      </div>
    </div>
  );
}
