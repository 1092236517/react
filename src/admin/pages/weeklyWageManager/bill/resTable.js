import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table, message } from 'antd';
import { Link } from 'react-router-dom';
import { exportWeeklyWageBillDetailList } from 'ADMIN_SERVICE/ZXX_WeekBill';
import { tableDateRender, tableSrcRender, tableDateTimeRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOptForQy } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    showAuditModal = (batchID) => {
        const { setSelectRowKeys, showAuditModal } = this.props;
        setSelectRowKeys([batchID]);
        showAuditModal();
    }

    exportDetail = (batchID) => {
        exportWeeklyWageBillDetailList({
            BillSrce: -9999,
            IdCardNo: "",
            RealName: "",
            WorkSts: -9999,
            BillWeeklyBatchId: batchID
        }).then((resData) => {
            window.open(resData.Data.FileUrl);
        }).catch((err) => {
            message.error(err.message);
            console.log(err);
        });
    }

    render() {
        const { confirmX, seeDetailX, exportDetailX } = resId.weeklyWageManager.bill;

        const columnsMap = [
            ['BillWeeklyBatchId', '批次号', undefined, 100],
            ['BeginDt', '开始时间', tableDateRender, 100],
            ['EndDt', '结束时间', tableDateRender, 100],
            ['CreatedTm', '账单生成时间', tableDateTimeRender, 150],
            ['CreatedByName', '操作人', undefined, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['TotUserCnt', '总人数', undefined, 80],
            ['TotPayCnt', '总笔数', undefined, 80],
            ['TotAdvancePayAmt', '总周薪(元)', tableMoneyRender, 100],
            ['TotAgentAmt', '总服务费(元)', tableMoneyRender, 100],
            ['TotPlatformSrvcAmt', '平台费(元)', tableMoneyRender],
            ['BillSrce', '账单类型', tableSrcRender, 80],
            ['BillAudit', '账单审核', (text, record) => {
                if (text != 1) {
                    return { 2: '通过', 3: '不通过' }[text];
                }
                return authority(confirmX)(<a href='javascript:;' onClick={() => { this.showAuditModal(record.BillWeeklyBatchId); window._czc.push(['_trackEvent', '周薪账单', '待审核', '周薪账单_Y结算']); }
                }> 待审核</a >);
            }, 80],
            ['SeeBillDetail', '账单详情', (text, record) => authority(seeDetailX)(<Link onClick={() => { window._czc.push(['_trackEvent', '周薪账单', '查看', '周薪账单_Y结算']); }} to={`/weeklyWageManager/bill/${record.BillWeeklyBatchId}`}>查看</Link>), 80, 'right'],
            ['ExportData', '导出', (text, record) => authority(exportDetailX)(<a href='javascript:;' onClick={() => { this.exportDetail(record.BillWeeklyBatchId); window._czc.push(['_trackEvent', '周薪账单', '导出', '周薪账单_Y结算']); }}>导出</a>), 80, 'right']
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
                    rowKey='BillWeeklyBatchId'
                    scroll={{ x: width, y: 550 }}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectRowKeys,
                        getCheckboxProps: (record) => ({ disabled: record.BillAudit !== 1 })
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