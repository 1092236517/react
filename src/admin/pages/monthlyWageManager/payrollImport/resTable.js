import 'ADMIN_ASSETS/less/pages/payrollImport.less';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateMonthRender, tableWorkStateRender } from 'ADMIN_UTILS/tableItemRender';

import { Modal, Select, Spin, Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';

const { Option } = Select;

@observer
class ResTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: ''
        };
    }
    setDetails = (record) => {
        this.setState({ record });
        this.props.payrollImportStore.setVisible(true);
    }

    render() {
        const {
            view: {
                tableInfo: {
                    loading, dataListShow
                },
                tableVisible,
                selectedRowKeys,
                modalLoading, 
                DetailsVisible
            },
            onSelectChange,
            setVisible
        } = this.props.payrollImportStore;

        let columns = [
            { title: '月份', dataIndex: 'Month', align: 'center', width: '10%', render: (text, record, index) => tableDateMonthRender(text) },
            { title: '企业名称', dataIndex: 'EntShortName', align: 'center', width: '12%' },
            { title: '劳务名称', dataIndex: 'TrgtSpShortName', align: 'center', width: '12%' },
            { title: '姓名', dataIndex: 'RealName', align: 'center', width: '10%' },
            { title: '身份证', dataIndex: 'IdCardNum', align: 'center', width: '12%' },
            { title: '工号', dataIndex: 'WorkCardNo', align: 'center', width: '10%' },
            {
                title: '详情',
                dataIndex: 'Details',
                render: (text, record, index) => <a className="details" onClick={() => this.setDetails(text)}>{text}</a>,
                width: '20%',
                align: 'center'
            },
            { title: '在离职状态', dataIndex: 'WorkSts', align: 'center', width: '6%', render: tableWorkStateRender },
            {
                title: '预检测结果', dataIndex: 'PreResult',
                align: 'center',
                width: '8%',
                render: (text) => ({
                    1: <span>正常</span>,
                    2: <span>异常</span>
                }[text])
            }
        ];

        return !tableVisible
            ? null
            : (
                <div>
                    <Table
                        columns={columns}
                        bordered={true}
                        scroll={{ y: 550 }}
                        dataSource={dataListShow.slice()}
                        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            onChange: onSelectChange
                        }}
                        rowKey={'primaryIndex'}
                        pagination={{
                            ...tablePageDefaultOpt
                        }}
                        loading={loading} >
                    </Table>
                    <Modal
                        title="详情"
                        onCancel={() => setVisible(false)}
                        footer={null}
                        visible={DetailsVisible}
                    >
                        <Spin spinning={modalLoading}>
                            {this.state.record}
                        </Spin>
                    </Modal>
                </div>


            );
    }
}

export default ResTable;