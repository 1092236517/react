import React, { Component } from 'react';
import { Table, message, Button } from 'antd';
import { expBillDetail } from 'ADMIN_SERVICE/ZXX_WeekReturnFee';
import { WorkStsStatus } from 'ADMIN_UTILS/tableItemRender';
import { generateColInfo } from 'ADMIN_UTILS';
import resId from 'ADMIN_CONFIG/resId';

class ResTable extends Component {
    showAuditModal = (batchID) => {
        const { setSelectRowKeys, showAuditModal } = this.props;
        setSelectRowKeys([batchID]);
        showAuditModal();
    }

    exportDetail = (batchID) => {
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
    commitImport = () => {

    }
    render() {
        const { seeDetailX, exportDetailX } = resId.weekReturnFee.bill;

        const columnsMap = [
            ['RealName', '姓名', undefined, 100],
            ['IdCardNum', '身份证号码'],
            ['TrgtSpShortName', '劳务'],
            ['EntShortName', '企业'],
            ['WorkCardNo', '工号'],
            ['WorkSts', '在职状态', WorkStsStatus]
        ];

        const {
            memberInfo: {
                receiveMemberList, total, loading, selectedRowKeys
            },
            setPagination,
            setSelectRowKeys,
            commitImport
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div style={{ marginTop: '2rem' }}>
                <div><span style={{ color: 'red' }}>表格必填字段：姓名、身份证号码、劳务、企业</span></div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={receiveMemberList.slice()}
                    rowKey='BillWeeklyBatchId'

                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
                        }
                    }}
                    pagination={false}
                    // pagination={{
                    //     ...tablePageDefaultOpt,
                    //     current,
                    //     pageSize,
                    //     total,
                    //     onShowSizeChange: (current, size) => {
                    //         setPagination(current, size);
                    //     },
                    //     onChange: (page, pageSize) => {
                    //         setPagination(page, pageSize);
                    //     }
                    // }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;