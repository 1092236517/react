import { generateColInfo } from 'ADMIN_UTILS';
import { tableDateRender } from 'ADMIN_UTILS/tableItemRender';
import { Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
import moment from "moment";
@observer
class ResTable extends Component {

    generateColInfo = columnsMap => {
        let allWidth = 0;
        return [
            columnsMap.map(aColumn => {
                const [dataIndex, title, render, width = 130, filteredValue = null, onFilter = null, align = 'center'] = aColumn;
                allWidth += width;
                return { dataIndex, title, render, filteredValue, onFilter, align, width };
            }),
            allWidth
        ];
    };
    render() {
        const {
            tableInfo: { dataList, total, loading },
            setPagination,
            days
        } = this.props;
        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {}
            };
            if (index === total) {
                obj.props.colSpan = 0;
            }
            return obj;
        };

        const ColRenderContent = (text, row, index) => {
            if (index < total) {
                return <span>{text}</span>;
            }
            return {
                children: <span>汇总</span>,
                props: {
                    colSpan: 3
                }
            };
        };
        const columnsMap = [
            ['EntShortName', '企业', ColRenderContent, 220],
            ['TrgtSpShortName', '劳务', renderContent, 220],
            ['IntvDt', '面试日期', renderContent, 100],
            ['InterviewerPassNumber', '面试通过人数', undefined, 100],
            ['EntryNumber', '入职人数', undefined, 100],
            ['', '报到率/入职率', (val, record) => {
                return record.RegistrationRate;
            }, 100]
        ];


        (days || []).slice().forEach((day) => {
            columnsMap.push([`RetentionRate${day}`, `${day}天(面试留存率)`]);
        });
        const [columns, width] = this.generateColInfo(columnsMap);

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
