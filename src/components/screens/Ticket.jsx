import React, { useEffect, useRef, useState } from "react";
import LayoutScrollable from "../helpers/Layout/LayoutScrollable";
import TableHeader from "../commons/dataDisplay/Table/TableHeader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getTicketById, replyTicket } from "../../api/StaffApi";
import { constants, convertserverTimeToDateString } from "../../helperFuncs";
import { Tooltip } from "react-tooltip";
import PHImage from "../../assets/Images/item_profilepic_placeholder.png";
import Textarea from "../helpers/Textarea";
import AttachmentToggle from "../commons/dataDisplay/Attachment/AttachmentToggle";
import { toast } from "react-toastify";
import DialogToggler from "../helpers/DialogToggler";
import CloseTicketDialog from "../commons/dialogs/CloseTicketDialog";

export default function Ticket() {
  const [values, setValues] = useState({
    messageContent: "",
  });
  const [attachments, setAttachments] = useState([]); // user attachments to be send to selected destination
  const [clearAttachments, setClearAttachments] = useState(false); //
  const [dialog, setDialog] = useState(false);

  const inpRef = useRef();
  const messagesEndRef = useRef();

  const { id } = useParams();
  console.log(id);
  //Queries
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id),
  });

  const replyTicketMutation = useMutation({
    mutationKey: ["replyTicket"],
    mutationFn: replyTicket,
    onSuccess: (res) => {
      refetch();
      setClearAttachments(true);
      setAttachments([]);
      setValues({ messageContent: "" });
      toast("پیام شما با موفقیت ارسال شد.", { type: "success" });
    },
    onError: (err) => {},
  });
  ///
  console.log(data);

  const handleChange =
    (name, options = {}) =>
    (e) => {
      let value = e?.target ? e.target.value : e;
      console.log(value);
      if (options?.onlyDigits) {
        value = String(value).replace(/\D/g, "");
      }
      setValues({ ...values, [name]: value });
    };

  const onAddAttachment = (attachs) => {
    console.log(attachs);
    setAttachments(attachs);
  };

  const replyTicketHandler = () => {
    const formData = new FormData();
    formData.append("MessageContent", values.messageContent);
    attachments.map((item) => {
      formData.append("Attachments", item.file);
    });
    formData.append(
      "UserName",
      localStorage.getItem(constants.SHAHRBIN_MANAGEMENT_USERNAME)
    );
    replyTicketMutation.mutate({ id: id, payload: formData });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [data]);
  const renderTableHeader = () => {
    return (
      <div className=" flex justify-between items-center w-full">
        {/* <TableHeaderAction
          title="تعریف دسته‌بندی (شکایات)"
          icon="fas fa-stream"
          onClick={() => setAddCategoryDialog(true)}
        /> */}
        <div className="">
          {data?.status == 1 && (
            <p className=" mr-4 text-lg text-red-600">این تیکت بسته شده است.</p>
          )}
        </div>
        {!data?.status && (
          <div
            data-tooltip-id="close"
            className=" flex items-center ml-4 cursor-pointer"
            onClick={() => setDialog(true)}
          >
            <i
              style={{ fontSize: "14px" }}
              className="fas fa-comment-alt-slash text-primary"
            ></i>
          </div>
        )}

        <Tooltip
          style={{ fontSize: "10px", zIndex: 100 }}
          id="close"
          place="bottom"
          content={"بستن تیکت"}
        />
      </div>
    );
  };

  useEffect(() => {
    inpRef.current?.focus();
  }, []);

  return (
    <>
      <TableHeader renderHeader={renderTableHeader} />
      {/* <LayoutScrollable
        clipped={(window.innerHeight * 3) / 48 + 10}
      ></LayoutScrollable> */}
      <DialogToggler
        condition={dialog}
        setCondition={setDialog}
        width={500}
        // height={800}
        isUnique={false}
        id="create-poll-dialog"
      >
        <CloseTicketDialog closedDialog={() => setDialog(false)} id={id} />
      </DialogToggler>
      <div className="  h-[80%] w-full overflow-y-auto scrollbar pl-2">
        <React.Fragment>
          <div className=" flex flex-col gap-4">
            {data?.messages.map((item) => {
              if (item.senderRole == 2) {
                return (
                  <div key={item.time} className="chat-message">
                    <div className="flex items-end">
                      <div className="flex flex-col space-y-2 max-w-max mx-1 order-2 items-start">
                        <div>
                          <div className=" font-bold">شما</div>
                          <span className="px-1 min-w-[200px]  min-h-[50px] pt-2 pb-8 min-h rounded-xl  rounded-br-none bg-primary text-white  flex flex-col relative justify-between text-sm ">
                            <div className="  justify-self-start text-start items-start text-xl text-white mb-2">
                              {item.content}
                            </div>

                            {item?.attachments.map((attachment, index) => {
                              return (
                                <a
                                  key={index}
                                  href={`${process.env.REACT_APP_TICKETING_URL}/uploads/${attachment.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-fit"
                                >
                                  <span className=" flex gap-2 text-lg text-primary bg-white w-fit items-center rounded-md p-2">
                                    <i class="fas fa-paperclip"></i>
                                    <span>پیوست {index + 1}</span>
                                  </span>
                                </a>
                              );
                            })}
                            <span className=" absolute bottom-0 left-2 text-base text-gray-300 flex gap-1 pl-1">
                              <p>{convertserverTimeToDateString(item.time)}</p>
                              {/* {item.seen && (
                              <IoCheckmarkDone className=" h-4 w-4" />
                            )} */}
                            </span>
                          </span>
                        </div>
                      </div>
                      <img
                        src={PHImage}
                        alt="My profile"
                        className="w-10 h-10 rounded-full order-1"
                      />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={item.time} className="chat-message">
                    <div className="flex  justify-end items-end">
                      <div className="flex flex-col space-y-2 max-w-max mx-1 order-1 items-end">
                        <div>
                          <div className=" text-left mb-[2px] font-bold">
                            پشتیبانی
                          </div>
                          <span className="px-1 min-w-[200px] min-h-[50px]  pt-2 pb-6 min-h rounded-xl  rounded-bl-none bg-white text-gray-600 flex flex-col relative justify-between text-sm ">
                            <div className=" justify-self-start text-start text-xl items-start">
                              {item.content}
                            </div>
                            {item?.attachments.map((attachment, index) => {
                              return (
                                <a
                                  key={index}
                                  href={`${process.env.REACT_APP_TICKETING_URL}/uploads/${attachment.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-fit"
                                >
                                  <span className=" flex gap-2 text-lg text-white bg-primary w-fit items-center rounded-md p-2">
                                    <i class="fas fa-paperclip"></i>
                                    <span>پیوست {index + 1}</span>
                                  </span>
                                </a>
                              );
                            })}
                            {/* {item?.attachments.map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className=" bg-gray-100 text-[#7C838A] w-full md:w-[30%] rounded-md h-12 p-2 flex justify-between gap-3 items-center"
                                >
                                  <a
                                    onClick={() =>
                                      openFileInNewTab(item.data, item.mimeType)
                                    }
                                    className="flex items-center gap-2 truncate cursor-pointer "
                                  >
                                    <File className="w-6 h-6 " />
                                    <p className=" max-w-[5rem] truncate">
                                      {item.title}
                                    </p>
                                  </a>
                                  <ArrowDownToLine
                                    className="cursor-pointer "
                                    onClick={() =>
                                      downloadFile(
                                        item.data,
                                        item.title,
                                        item.mimeType
                                      )
                                    }
                                  />
                                </div>
                              );
                            })} */}
                            <span className=" absolute bottom-0 right-2 text-base flex gap-1 pr-1">
                              <p>{convertserverTimeToDateString(item.time)}</p>
                            </span>
                          </span>
                        </div>
                      </div>
                      <img
                        src={PHImage}
                        alt="My profile"
                        className="w-10 h-10 rounded-full order-2"
                      />
                    </div>
                  </div>
                );
              }
            })}
            <div className="bg-red-300" ref={messagesEndRef} />
          </div>
        </React.Fragment>
      </div>

      <div className="  h-[11%] w-full flex items-end gap-5 px-1">
        {!data?.status && (
          <>
            {" "}
            <Textarea
              value={values.messageContent}
              //   title="متن تیکت"
              placeholder="متن پیام"
              ref={inpRef}
              resize={false}
              wrapperClassName=" flex-1 !mb-0 !pb-0 seld-end"
              inputClassName="h-[45px] text-start px-1 rounded-2xl"
              name="messageContent"
              handleChange={handleChange}
              required={true}
            />
            <div className="mb-2">
              <AttachmentToggle
                reset={clearAttachments}
                onAddAttachment={onAddAttachment}
              />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-send-horizontal rotate-180 text-primary cursor-pointer mb-4"
              onClick={replyTicketHandler}
              data-tooltip-id="send"
            >
              <path d="m3 3 3 9-3 9 19-9Z" />
              <path d="M6 12h16" />
            </svg>
            <Tooltip
              style={{ fontSize: "10px", zIndex: 100 }}
              id="send"
              place="bottom"
              content={"ارسال"}
            />
          </>
        )}
      </div>
    </>
  );
}
