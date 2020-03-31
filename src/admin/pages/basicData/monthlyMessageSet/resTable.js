import React, { Component } from 'react';
import { Table } from 'antd';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { generateColInfo } from 'ADMIN_UTILS';
import { tableDateRender } from 'ADMIN_UTILS/tableItemRender';
@observer
class ResTable extends Component {
    render() {
        const {
            tableInfo: {
                dataList, loading, total
            },
            pagination: {
                current,
                pageSize
            },
            setPagination, setModalShow
        } = this.props;

        const columnsMap = [
            ['RealName', '姓名'],
            ['Mobile', '手机号码', undefined, 220],
            ['IsValid', '生效状态', (text) => ({ 1: '是', 2: '否' }[text])],
            ['OPUserName', '操作人'],
            ['OPTime', '操作时间', tableDateRender, 100],
            ['', '编辑', (text, record) => (
                <a onClick={() => { setModalShow(record); window._czc.push(['_trackEvent', '月薪短信配置', '编辑', '月薪短信配置_Y结算']); }}>编辑</a>
            )]
        ];
        const [columns, width] = generateColInfo(columnsMap);
        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='Number'
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