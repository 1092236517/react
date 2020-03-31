import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Table, message, Modal } from 'antd';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt, generateColInfo } from 'ADMIN_UTILS';
import { historyInvoice } from 'ADMIN_SERVICE/ZXX_BaseData';

@observer
class History extends Component {
    state = {
        dataList: [],
        total: 0,
        loading: false,
        current: 1,
        pageSize: 10
    }

    componentDidMount() {
        this.startQuery();
    }

    setPagination = (current, pageSize) => {
        this.setState({
            current,
            pageSize
        }, () => {
            this.startQuery();
        });
    }

    startQuery = async () => {
        const { current, pageSize } = this.state;
        const { EntId, TrgtSpId } = this.props;

        let reqParam = {
            EntId,
            TrgtSpId,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            this.setState({ loading: true });
            let resData = await historyInvoice(reqParam);
            const { RecordList, RecordCount } = resData.Data;
            this.setState({
                dataList: RecordList || [],
                total: RecordCount
            });
        } catch (err) {
            message.error(err.message);
            console.log(err);
        } finally {
            this.setState({ loading: false });
        }
    }

    render() {
        const { closeHistory, TrgtSpShortName, EntShortName } = this.props;
        const { loading, dataList, current, pageSize, total } = this.state;

        const columnsMap = [
            ['InvoiceTyp', '开票类型', (val) => ({ 1: '普票', 2: '专票' }[val] || '')],
            ['TrgtCn', '劳务名称'],
            ['TrgtCnShort', '劳务简称'],
            ['EntCn', '企业名称'],
            ['EntCnShort', '企业简称'],
            ['TaxpayerId', '纳税人识别号'],
            ['AccntBank', '开户行'],
            ['AccntNum', '开户账号'],
            ['Address', '地址'],
            ['TelPhone', '联系电话'],
            ['OperatTyp', '操作类型', (val) => ({ 1: '审核通过', 2: '审核不通过', 3: '新增', 4: '编辑' }[val] || '')],
            ['Operator', '操作人'],
            ['OperatTm', '操作时间', tableDateTimeRender, 160]
        ];

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <Modal
                visible={true}
                width='80%'
                title='查看历史'
                onCancel={closeHistory}
                footer={null}>
                <Fragment>
                    <div className='mb-16 color-danger'>
                        劳务：{TrgtSpShortName}，企业：{EntShortName}                        
                    </div>
                    <Table
                        columns={columns}
                        bordered={true}
                        dataSource={dataList}
                        rowKey='DataId'
                        scroll={{ x: width, y: 550 }}
                        pagination={{
                            ...tablePageDefaultOpt,
                            current,
                            pageSize,
                            total,
                            onShowSizeChange: (current, size) => {
                                this.setPagination(current, size);
                            },
                            onChange: (page, pageSize) => {
                                this.setPagination(page, pageSize);
                            }
                        }}
                        loading={loading} >
                    </Table>
                </Fragment>
            </Modal>
        );
    }
}

export default History;