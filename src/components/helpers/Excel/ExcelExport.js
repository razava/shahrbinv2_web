import React from "react";
import styles from "./styles.module.css";
import * as FileSaver from "file-saver";
// import XLSX from "sheetjs-style";
import * as XLSX from "xlsx";
import { Tooltip } from "react-tooltip";

const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8;";
const fileExtension = ".xlsx";

const ExcelExport = ({ data }) => {
  // functions
  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(formatToExcelData(data));
    const wb = {
      Sheets: { data: ws },
      SheetNames: ["data"],
      Workbook: { Views: [{ RTL: true }] },
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: fileType });
    const fileName = data[0].chartTitle;
    FileSaver.saveAs(fileData, fileName + fileExtension);
  };

  const formatToExcelData = (data) => {
    console.log(data[0].chartTitle);
    // return data[0].series.map((s) => {
    //   console.log(s);
    //   let col = {
    //     [data[0].chartTitle]: s.title,
    //   };
    //   s.values.forEach((v) => {
    //     col[v.title] = String(v.displayValue).split(" ")[1];
    //     col[`درصد ${v.title}`] = String(v.displayValue).split(" ")[0];
    //   });
    //   return col;
    // });
    return data[0].series[0].values.map((v, i) => {
      console.log(v);
      let col = {
        [data[0].chartTitle]: v.title,
      };
      data[0].series.forEach((s) => {
        console.log(String(s.values[i].displayValue).split(" ")[1]);
        col[s.title] = String(s.values[i].displayValue).split(" ")[1];
        col[`درصد ${s.title}`] = String(s.values[i].displayValue).split(" ")[0];
      });
      return col;
    });
  };
  return (
    <>
      <span
        data-tooltip-id="excel"
        className={styles.action}
        onClick={exportToExcel}
      >
        {/* <span className={styles.actionTitle}>اکسل</span> */}
        <span className={styles.actionIcon}>
          <i className="far fa-file-excel text-4xl"></i>
        </span>
      </span>
      <Tooltip style={{fontSize:"10px"}} id="excel" place="bottom" content="خروجی excel" />
    </>
  );
};

export default ExcelExport;
