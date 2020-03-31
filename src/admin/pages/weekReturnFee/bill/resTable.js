import React, { Component } from 'react';
import { Table, message } from 'antd';
import { Link } from 'react-router-dom';
import { expBillDetail } from 'ADMIN_SERVICE/ZXX_WeekReturnFee';
import { tableDateRender, tableSrcRender, tableDateTimeRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt, generateColInfo } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

class ResTable extends Component {
    showAuditModal = (batchID) => {
        const { setSelectRowKeys, showAuditModal } = this.props;
        setSelectRowKeys([batchID]);
        showAuditModal();
    }

    exportDetail = (batchID) => {
        window._czc.push(['_trackEvent', '返费周薪账单', '导出', '返费周薪账单_N非结算']);
        expBillDetail({
            IdCardNum: "",
            RealName: "",
            WorkSts: -9999,
            BillWeeklyBatchIdList: [batchID]
        }).then((resData) => {
            window.open(resData.Data.FileUrl);
        }).catch((err) => {
            message.error(err.message);
            console.log(err);
        });
    }

    render() {
        const { seeDetailX, exportDetailX } = resId.weekReturnFee.bill;

        const columnsMap = [
            ['BillWeeklyBatchId', '批次号', undefined, 100],
            ['BeginDt', '结算开始日期', tableDateRender],
            ['EndDt', '结算结束日期', tableDateRender],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['TotUserCnt', '总人数', undefined, 80],
            ['TotPayCnt', '总笔数', undefined, 80],
            ['TotAmountBeforeTax', '税前总周薪(元)', tableMoneyRender],
            ['TaxRate', '税率'],
            ['TotTaxAmount', '扣税金额(元)', tableMoneyRender, 100],
            ['TotAdvancePayAmt', '税后总周薪(元)', tableMoneyRender],
            ['TotAgentAmt', '总服务费(元)', tableMoneyRender, 100],
            ['TotPlatformSrvcAmt', '总平台费(元)', tableMoneyRender],
            ['BillSrce', '账单类型', tableSrcRender, 80],
            ['BillAudit', '审核状态', (text, record) => ({ 1: '待审核', 2: '通过', 3: '不通过' }[text]), 80],
            ['CreatedTm', '账单生成时间', tableDateTimeRender, 150],
            ['CreatedByName', '操作人', undefined, 100],
            ['SeeBillDetail', '账单详情', (text, record) => authority(seeDetailX)(<Link onClick={()=>{window._czc.push(['_trackEvent', '返费周薪账单', '查看', '返费周薪账单_N非结算']);}} to={`/weekReturnFee/billDetail/${record.BillWeeklyBatchId}`}>查看</Link>), 80, 'right'],
            ['ExportData', '导出', (text, record) => authority(exportDetailX)(<a href='javascript:;' onClick={this.exportDetail.bind(this, record.BillWeeklyBatchId)}>导出</a>), 80, 'right']
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
                        ...tablePageDefaultOpt,
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