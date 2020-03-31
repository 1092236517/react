import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
@observer
class ResTable extends Component {
    render() {
        const { operDataX } = resId.weeklyWageManager.leak;

        const columnsMap = [
            ['EntShortName', '企业', (val, record) => {
                if (record.DataId === -9999) {
                    return {
                        children: '汇总',
                        props: {
                            colSpan: 3
                        }
                    };
                }
                return val;
            }],
            ['TrgtSpShortName', '劳务', (val, record) => {
                if (record.DataId === -9999) {
                    return {
                        children: '',
                        props: {
                            colSpan: 0
                        }
                    };
                }
                return val;
            }, 220],
            ['Date', '日期', (val, record) => {
                if (record.DataId === -9999) {
                    return {
                        children: '',
                        props: {
                            colSpan: 0
                        }
                    };
                }
                return tableDateRender(val);
            }, 100],
            ['NewIntvCount', '新增入职数', undefined, 100]
        ];

        const {
            tableInfo: { dataList, total, loading },
            setPagination,
            days
        } = this.props;
        (days || []).slice().forEach((day) => {
            columnsMap.push([`RetentionRate${day}`, `${day}天(率)`]);
        });
        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='DataId'
                    scroll={{ x: width, y: 550 }}
                    pagination={{
                        size: 'small',
                        showSizeChanger: false,
                        showQuickJumper: false,
                        pageSize: 130,
                        total
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;