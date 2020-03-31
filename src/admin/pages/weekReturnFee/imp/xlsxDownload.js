import React, { Component } from "react";
import ReactExport from "react-data-export";

const { ExcelFile } = ReactExport;
const { ExcelSheet } = ExcelFile;

const createDataSet = (data) => {
    let fixedData = [];
    data.forEach((row) => {
        fixedData.push([
            { value: row['UserName'] },
            { value: row['IDCardNum'] },
            { value: row['EmployeeNo'] },
            { value: row['EntryDate'] },
            { value: row['WorkStateOriginText'] },
            { value: row['LeaveDate'] },
            { value: row['Remark'] },
            { value: row['EnterpriseName'], style: { fill: { fgColor: { rgb: "FFCCEEFF" } } } },
            { value: row['LaborName'], style: { fill: { fgColor: { rgb: "FFCCEEFF" } } } },
            { value: row['AgentName'], style: { fill: { fgColor: { rgb: "FFCCEEFF" } } } },
            { value: row['PreCheckInfo'], style: { fill: { fgColor: { rgb: "FFCCEEFF" } } } },
            { value: row['Join'] == 1 ? '是' : '否', style: { fill: { fgColor: { rgb: "FFCCEEFF" } } } }
        ]);
    });
    const multiDataSet = [
        {
            columns: [
                { title: "姓名", width: { wpx: 100 } },
                { title: "身份证号码", width: { wpx: 180 } },
                { title: "工号", width: { wpx: 100 } },
                { title: "入职日期", width: { wpx: 100 } },
                { title: "在职状态", width: { wpx: 100 } },
                { title: "离职/转正/自离日期", width: { wpx: 100 } },
                { title: "备注", width: { wpx: 100 } },
                { title: "企业", width: { wpx: 100 } },
                { title: "劳务", width: { wpx: 100 } },
                { title: "中介", width: { wpx: 100 } },
                { title: "预检测结果", width: { wpx: 180 } },
                { title: "加入对账单", width: { wpx: 100 } }
            ],
            data: fixedData
        }
    ];
    return multiDataSet;
};

class Download extends Component {
    render() {
        const { excelData } = this.props;
        return (
            <ExcelFile hideElement filename='格式错误数据'>
                <ExcelSheet dataSet={createDataSet(excelData)} name="sheet1">
                </ExcelSheet>
            </ExcelFile>
        );
    }
}

export default Download;