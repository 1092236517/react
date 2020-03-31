import React, { Component } from 'react';
import { Table } from 'antd';
import { observer } from "mobx-react";
import { tableDateRender, tableWorkStateRender, tableMoneyRender, tableShowTotal, tableMonthTypeRender, tableDateMonthRender } from 'ADMIN_UTILS/tableItemRender';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import moment from 'moment';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    componentDidMount() {
        let jumpParms = sessionStorage.getItem('TEMP_JUMP_PARAMS');
        if (jumpParms) {
            sessionStorage.removeItem('TEMP_JUMP_PARAMS');
            jumpParms = JSON.parse(jumpParms);

            const { EntryDate, LeaveDate, WorkState } = jumpParms;
            this.props.startAdd(null, {
                ...jumpParms,
                EntryDate: EntryDate ? moment(EntryDate) : undefined,
                LeaveDate: LeaveDate ? moment(LeaveDate) : undefined
            });
        }
    }

    startEdit = (recordID) => {
        const { tableInfo: { dataList }, startEdit: startEdit2 } = this.props;
        let recordInfo = dataList.find((value) => {
            return value.RecordID == recordID;
        });
        startEdit2(recordInfo);
    }

    delRecord = (recordID) => {
        const { delRecord } = this.props;
        delRecord(recordID);
    }

    render() {
        const {
            tableVisible,
            tableInfo: {
                dataList, loading
            },
            SalaryType
        } = this.props;
        const { editTableDataX, deleteTableDataX } = resId.monthlyWageManager.reissue;
        const columnsMap = [
            ['IDCardNum', '身份证号码', undefined, 160],
            ['UserName', '姓名'],
            ['EmployeeNo', '工号'],
            ['Amount2', '实发工资(元)'],
            ['TotalSalary', '应发总工资(元)', (text, record) => (record.SalaryType == 6 ? '/' : tableMoneyRender(text))],
            ['PayedWeekAmout', '已支生活费(元)', (text, record) => (record.SalaryType == 6 ? '/' : tableMoneyRender(text))],
            ['PayedMonthAmout', '已发工资(元)', (text, record) => (record.SalaryType == 6 ? '/' : tableMoneyRender(text))],
            ['IdealLeftMonthAmount', '理论剩余工资(元)', (text, record) => (record.SalaryType == 6 ? '/' : tableMoneyRender(text))],
            ['LeftMonthAmout', '实际剩余工资(元)', tableMoneyRender],
            ['RemainingAgentAmount', '服务费(元)', tableMoneyRender, 100],
            ['SalaryType', '月薪类型', tableMonthTypeRender],
            ['CloseMonth', '发生月份', tableDateMonthRender],
            ['EntryDate', '入职日期', tableDateRender],
            ['WorkState', '是否在职', tableWorkStateRender],
            ['LeaveDate', '离职/转正/自离日期', tableDateRender, 180],
            ['Remark', '备注'],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['Join', '加入对账单', (text) => ({ 1: '是', 2: '否' }[text])],
            ['WorkHours', '出勤小时数', (value) => ((value == -1 || value == undefined) ? '' : value)],
            ['Operate', '操作', (text, record) => {
                return (
                    <div>
                        {authority(editTableDataX)(<a href='javascript:;' onClick={this.startEdit.bind(this, record.RecordID)}>修改</a>)}
                        <span className='ml-8 mr-8'>|</span>
                        {authority(deleteTableDataX)(<a href='javascript:;' onClick={this.delRecord.bind(this, record.RecordID)}>删除</a>)}
                    </div>
                );
            }]
        ];
        const [columns, width] = generateColInfo(columnsMap);

        return tableVisible &&
            <div>

                <Table
                    columns={columns}
                    bordered={true}
                    rowKey='RecordID'
                    scroll={{ x: width, y: 550 }}
                    dataSource={dataList.slice()}
                    pagination={{
                        ...tableShowTotal
                    }}
                    loading={loading} >
                </Table>


            </div>;
    }
}

export default ResTable;