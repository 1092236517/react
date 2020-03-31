import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateRender, tableDateTimeRender, tableMoneyRender, tableWorkStateRender, tableYesNoRender, idCardEncryption } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [

            ['EntName', '企业'],
            ['JffEntName', '工种'],
            ['RealName', '姓名', undefined, 100],
            ['WorkCardNo', '工号'],
            ['IdCardNum', '身份证号码', idCardEncryption, 150],
            ['IntvDt', '面试日期', tableDateRender, 100],
            ['EntryDt', '入职时间', tableDateRender, 100],
            ['LeaveDt', '离职时间', tableDateRender, 100],
            ['WorkSts', '在离职状态', tableWorkStateRender],
            ['PreCheckResult', '预检测结果', undefined, 180],
            ['GpsAbnormalTimes', '无Gps打卡次数', undefined, 180],
            ['LocationAbnormalTimes', '位置异常打卡次数', undefined, 180],
            ['PatchTimes', '补卡次数', undefined, 180],
            ['NormalTimes', '正常次数', undefined, 180],
            ['IsNewEntry', '是否新入职', (text) => ({ 1: '否', 2: '是' }[text]), 80]
        ];

        const {
            view: {
                tableInfo: {
                    dataList, total, loading
                },
                pagination: {
                    current, pageSize
                }
            },
            setPagination
        } = this.props.departurePredictStore;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='NameListId'
                    scroll={{ x: width, y: 550 }}
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