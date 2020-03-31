import React, { Component } from 'react';
import { Table, message } from 'antd';
import { tableDateMonthRender, tableSrcRender, tableMoneyRender, tableDateTimeRender, tableMonthTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOptForQy } from 'ADMIN_UTILS';
import { exportMonthlyWageBillDetailList } from 'ADMIN_SERVICE/ZXX_MonthBill';
import { Link } from 'react-router-dom';
import { observer } from "mobx-react";
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    showAuditModal = (batchID) => {
        const { setSelectRowKeys, showAuditModal } = this.props;
        setSelectRowKeys([batchID]);
        showAuditModal();
        window._czc.push(['_trackEvent', '月薪账单', '待审核', '月薪账单_Y结算']);
    }

    exportDetail = (e) => {
        window._czc.push(['_trackEvent', '月薪账单', '导出', '月薪账单_Y结算']);
        const batchid = e.target.dataset.batchid * 1;
        exportMonthlyWageBillDetailList({
            BillMonthlyBatchId: batchid
        }).then((resData) => {
            window.open(resData.Data.FileUrl);
        }).catch((err) => {
            message.error(err.message);
            console.log(err);
        });
    }

    render() {
        const { confirmX, seeDetailX, exportDetailX } = resId.monthlyWageManager.bill;

        const columnsMap = [
            ['BillMonthlyBatchId', '批次号', undefined, 100],
            ['BillRelatedMo', '归属月份', tableDateMonthRender, 100],
            ['CreatedTm', '账单生成时间', tableDateTimeRender, 150],
            ['UpdatedName', '操作人', undefined, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpName', '中介', undefined, 220],
            ['TotUserCnt', '总人数', undefined, 80],
            ['TotCount', '总笔数', undefined, 80],
            ['TotMonthlySalary', '总月薪(元)', (text, record) => (record.SalaryTyp == 6 ? '/' : tableMoneyRender(text)), 100],
            ['PlatformSrvcAmt', '平台费(元)', tableMoneyRender],
            ['RemainingAgentAmt', '总服务费(元)', tableMoneyRender, 100],
            ['TotOkTrgtSpMonthlyPaidSalary', '实发工资(元)', (text) => (text == -1 ? '' : tableMoneyRender(text)), 100],
            ['TotOkWeeklyPaidAmt', '已支生活费(元)', (text) => (text == -1 ? '' : tableMoneyRender(text)), 140],
            ['TotOkRemainingSalary', '实际剩余工资(元)', (text) => (text == -1 ? '' : tableMoneyRender(text)), 160],
            ['SalaryTyp', '月薪类型', tableMonthTypeRender, 80],
            ['BillSrce', '账单类型', tableSrcRender, 80],
            ['TrgtSpAuditSts', '账单审核', (text, record) => {
                if (text != 1) {
                    return { 2: '通过', 3: '不通过' }[text];
                }
                return authority(confirmX)(<a href='javascript:;' onClick={this.showAuditModal.bind(this, record.BillMonthlyBatchId)}>待审核</a>);
            }, 80],
            ['SalaryPayer', '是否劳务发放', (text) => ({ 2: '是', 1: '否' }[text])],
            ['BillDetail', '账单详情', (text, record) => authority(seeDetailX)(<Link onClick={()=>{window._czc.push(['_trackEvent', '月薪账单', '查看', '月薪账单_Y结算']);}} to={`/monthlyWageManager/bill/${record.BillMonthlyBatchId}`}>查看</Link>), 80, 'right'],
            ['ExportRecord', '导出', (text, record) => authority(exportDetailX)(<a href='javascript:;' data-batchid={record.BillMonthlyBatchId} onClick={this.exportDetail}>导出</a>), 80, 'right']
        ];

        const {
            tableInfo: {
                dataList, total, loading, selectedRowKeys
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            setSelectRowKeys
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='BillMonthlyBatchId'
                    scroll={{ x: width, y: 550 }}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectRowKeys,
                        getCheckboxProps: (record) => ({ disabled: record.TrgtSpAuditSts !== 1 })
                    }}
                    pagination={{
                        ...tablePageDefaultOptForQy,
                        current,
                        pageSize,
                        total,
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        },
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        }
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;