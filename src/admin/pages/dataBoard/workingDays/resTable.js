import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender } from 'ADMIN_UTILS/tableItemRender';
import { Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['NameListId', '编号', undefined, 100],
            ['TrgtSpName', '劳务名称', undefined, 220],
            ['EntName', '企业名称'],
            ['RealName', '姓名', undefined, 100],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['WorkCardNo', '工号'],
            ['InWorkDays', '在职天数', undefined, 140],
            ['IntvDt', '面试日期', tableDateRender, 150],
            ['EntryDt', '入职日期', tableDateRender, 100],
            ['LeaveDt', '离职日期', tableDateRender, 100],
            ['RegularDt', '转正日期', tableDateRender, 100]
        ];

        const [columns, width] = generateColInfo(columnsMap);

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
        } = this.props.workingDaysStore;

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