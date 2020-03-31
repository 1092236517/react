import React, { Component } from 'react';
import { Table } from 'antd';
import { tableDateRender, tableDateMonthRender, tableMoneyRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { generateColInfo } from 'ADMIN_UTILS';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
const auditRender = (value) => ({ 1: '未审核', 2: '审核通过', 3: '审核不通过' }[value]);
const xTypeRender = (value) => ({ 1: '工资', 2: '社保', 3: '管理费', 4: '招聘费', 5: '自离工资', 6: '其他' }[value]);

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['EnterName', '企业'],
            ['LaborName', '劳务', undefined, 220],
            ['Month', '月份', tableDateMonthRender, 100],
            ['IDCardNum', '身份证号码', undefined, 150],
            ['WorkStateText', '在离职状态'],
            ['RealName', '姓名', undefined, 100],
            ['XType', 'X类型', xTypeRender, 80],
            ['XAmount', 'X', tableMoneyRender, 100],
            ['WorkCardNo', '工号'],
            ['PreCheckInfo', '预检测结果', (value, record) => (record.IsOK == 1 ? value : <span className='color-danger'>{value}</span>), 220],
            ['CreateTime', '导入日期', tableDateRender, 100],
            ['AuditStatus', '审核状态', auditRender, 100],
            ['AuditRemark', '备注'],
            ['SettlementTyp', '结算模式', settleTypeRender, 100],
            ['OPUserName', '操作人', undefined, 100],
            ['OPTime', '操作时间', tableDateTimeRender, 150],
            ['AuditUserName', '审核人', undefined, 100],
            ['AuditTime', '审核时间', tableDateTimeRender, 150]
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
                    rowKey='RecordID'
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
                        }
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;