import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { convertCentToThousandth } from 'web-react-base-utils';
import 'ADMIN_ASSETS/less/pages/cover-antd.less';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['RealName', '姓名', undefined, 100, 'left'],
            ['BatchID', '关联批次号', undefined, 100],
            ['IDCardNum', '身份证号码', undefined, 150],
            ['BankName', '银行名称'],
            ['BankCardNo', '银行卡号', undefined, 180],
            ['Amount', '打款金额(元)', convertCentToThousandth, 100],
            ['TradeType', '打款类别', (text) => ({ 1: '周薪', 2: '月薪', 4: '返费', 5: '周返费' }[text]), 80],
            ['WithdrawRemark', '款项说明', undefined, 220],
            ['CreateTime', '退回时间', tableDateTimeRender, 150],
            ['IsUpdateBankInfo', '银行卡状态', (text) => ({ 1: '未更新', 2: '已更新' }[text]), 120],
            ['ReApplyUserName', '重发申请人', undefined, 100],
            ['ReApplyState', '重发申请状态', (text) => ({ 2: '已申请', 1: '待申请' }[text]), 120]
        ];

        const {
            view: {
                tableInfo: {
                    dataList, total, loading, selectedRowKeys
                },
                pagination: {
                    current, pageSize
                }
            },
            setPagination,
            setSelectRowKeys
        } = this.props.withdrawManagerBackStore;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='BankBackID'
                    scroll={{ x: width + 62, y: 550 }}
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
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
                        },
                        getCheckboxProps: (record) => ({ disabled: record.ReApplyState == 2 })
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;