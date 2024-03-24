import React, { useContext, useState } from "react";
import { AppStore } from "../../../store/AppContext";
import TreeSystem from "./TreeSystem";
import TextInput from "../../helpers/TextInput";
import {
  getOperatorCategories,
  putOperatorCategories,
} from "../../../api/AdminApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "../../helpers/Button";
import { toast } from "react-toastify";

export default function OperatorCategories({ userId }) {
  const [store] = useContext(AppStore);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryTitle2, setCategoryTitle2] = useState([]);
  const [categoryId2, setCategoryId2] = useState();
  const [selectedCategories, setSelectedCategories] = useState();

  const {
    data: OperatorCategories,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["opCategories", userId],
    queryFn: () => getOperatorCategories(userId),
  });

  const onCategoriesSelected = (selecteds) => {
    // if (selecteds.length > 0) {
    if (selecteds.length > 0) {
      const selected = selecteds[0];
      setCategoryTitle2(selected.title);
      setCategoryId2(selected.id);
      setSelectedCategories(selecteds);
    }
    console.log(selecteds);
    // }
    // else {
    //   setCategoryTitle2("");
    //   setCategoryId2(null);
    // }
  };

  const all = OperatorCategories?.map((item) => {
    return { id: item };
  });

  const putCategoriesMutation = useMutation({
    mutationKey: ["putCategories"],
    mutationFn: putOperatorCategories,
    onSuccess: (res) => {
      refetch();
      // queryClient.invalidateQueries({ queryKey: ["getReportNotes"] });
      toast("دسته بندی ها با موفقیت به روزرسانی شد.", { type: "success" });
    },
    onError: (err) => {},
  });
  
  return (
    <div>
      {" "}
      <TreeSystem
        isStatic
        staticData={store.initials.categories}
        condition={categoryDialog}
        setCondition={setCategoryDialog}
        onChange={onCategoriesSelected}
        defaultSelecteds={all}
        singleSelect={false}
        onClose={() => setCategoryDialog(false)}
        mode="Add"
        renderToggler={(selected) => (
          <TextInput
            placeholder=" مشاهده دسته بندی ها"
            title="‌دسته بندی‌ها"
            readOnly={true}
            onClick={() => setCategoryDialog(true)}
            wrapperClassName="!w-[95%] mb-6"
            inputClassName="pointer"
            required={false}
            value={selected.length > 0 ? selected[0].title : "" ? "" : ""}
          />
        )}
      ></TreeSystem>
      <div className="w80 mxa fre py1 px2 border-t-light mt1 fixed b0 bg-white">
        <Button
          title="ذخیره تغییرات"
          className="py1 br05 bg-primary"
          onClick={() => {
            putCategoriesMutation.mutate({
              id: userId,
              payload: {
                categoryIds: selectedCategories.map((item) => item.id),
              },
            });
          }}
          loading={putCategoriesMutation.isLoading}
        />
      </div>
    </div>
  );
}
