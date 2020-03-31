import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { Table, Popconfirm, message } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
import { tableDateRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';

import authority, { AuthorityButton } from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { toJS } from 'mobx';
import moment from 'moment';
@observer
class ResTable extends Component {

    confirm = (record) => {
        this.props.updataRowRecord(record);
    };

    cancel = () => {

    }
    render() {
        let { searchValue: { Day } } = this.props;
        const renderOpt = (text, record) => {
            Day = Day || moment();
            let temple = '';
            if (moment().format('YYYY-MM-DD') !== Day.format('YYYY-MM-DD')) {
                //    if(IntvDtStart < moment()){
                //     temple= {1:'是',2:'否'}[text];
                //    }
                temple = { 1: '是', 2: '否' }[text];
            } else {

                if (Day.hour() < 16) {
                    temple = {
                        1: <Popconfirm
                            title="请仔细确定该企业劳务是否已经发了月薪，如果没有发过，请勿改修状态？"
                            onConfirm={() => this.confirm(record)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a href="#">是</a>
                        </Popconfirm>,
                        2: <Popconfirm
                            title="请仔细确定该企业劳务是否已经发了月薪，如果没有发过，请勿改修状态？"
                            onConfirm={() => this.confirm(record)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a href="#">否</a>
                        </Popconfirm>
                    }[text];
                } else {
                    temple = {
                        1: '是',
                        2: <Popconfirm
                            title="请仔细确定该企业劳务是否已经发了月薪，如果没有发过，请勿改修状态？"
                            onConfirm={() => this.confirm(record)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a href="#">否</a>
                        </Popconfirm>
                    }[text];
                }
            }
            return temple;
        };
        const columnsMap = [
            ['LaborName', '劳务'],
            ['EnterName', '企业'],
            ['IsComplete', '是否已发月薪', (text, record) => (renderOpt(text, record))],
            ['OPUserName', '操作人'],
            ['OPTime', '操作时间', tableDateRender, 100]
        ];

        const {
            pagination: {
                current, pageSize
            },
            tableInfo: { dataList, total, loading },
            setPagination
        } = this.props;
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