import React, { Component } from 'react';
import { Table, Popconfirm, message, Button } from 'antd';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { generateColInfo } from 'ADMIN_UTILS';
import { hasAuthority } from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tableDateRender } from 'ADMIN_UTILS/tableItemRender';
@observer
class ResTable extends Component {

    confirm = (record) => {
        window._czc.push(['_trackEvent', '企业对应劳务', '修改发放方式', '企业对应劳务_Y结算']);
        const { modifyPayType } = this.props;
        modifyPayType(record);
    };
    render() {
        const columnsMap = [
            ['EnterName', '企业'],
            ['LaborName', '劳务', undefined, 220],
            ['MonthSalaryPayer', '月薪是否劳务发放', (text, record) => ({
                2: hasAuthority(resId.baseCompanyList.payTypeEdit) ? <div>
                    <Popconfirm
                        title="确定要修改发放方式吗？"
                        onConfirm={() => this.confirm(record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a href="#">是</a>
                    </Popconfirm>
                </div> : '是', 1: hasAuthority(resId.baseCompanyList.payTypeEdit) ? <div>
                    <Popconfirm
                        title="确定要修改发放方式吗？"
                        onConfirm={() => this.confirm(record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a href="#">否</a>
                    </Popconfirm>
                </div> : '否'
            }[text])],
            ['OPUserName', '操作人'],
            ['OPTime', '操作时间', tableDateRender, 100]
        ];

        const {
            tableInfo: {
                dataList, loading, total, selectedRowKeys
            },
            pagination: {
                current,
                pageSize
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