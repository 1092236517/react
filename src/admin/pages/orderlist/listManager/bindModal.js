import React from 'react';
import {Modal, Table, Spin, Row, Col, DatePicker} from 'antd';
import {observer, inject} from 'mobx-react';
import {toJS} from 'mobx';
import 'ADMIN_ASSETS/less/pages/listManager.less';
import { tableDateRender } from 'ADMIN_UTILS/tableItemRender';
@inject('listStore')
@observer
class BindModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: null,
            record: ''
        };
    }

    onRowClick = (record, index) => {
        this.setState({selectIndex: index, record: record});
    }

    // onChange = (date, dateString) => {
    //     const {view, getOrderList} = this.props.listStore;
    //     const {selectedRows} = view;
    //     getOrderList({
    //         EntId: selectedRows[0].EntId,
    //         OrderDt: moment(selectedRows[0].IntvDt),
    //         SrceSpId: selectedRows[0].SrceSpId,
    //         TrgtSpId: selectedRows[0].TrgtSpId
    //     });
    //     this.setState({selectIndex: null, record: ''});
    // }

    render() {
        const {view, setVisible, bind} = this.props.listStore;
        const {bindVisible, modalLoading, orderList, selectedRows} = view;
        const {selectIndex, record} = this.state;
        const columns = [
            {
                title: '创建时间',
                dataIndex: 'CreateTm',
                width: "10%",
                align: 'center',
                render: tableDateRender
            }, {
                title: '企业',
                dataIndex: 'EntShortName',
                align: 'center',
                width: "15%"
            }, {
                title: '劳务',
                width: "15%",
                align: 'center',
                dataIndex: 'TrgtSpName'
            }, {
                title: '中介',
                dataIndex: 'SrceSpName',
                width: "15%",
                align: 'center',
                render: (text, record, index) => record.SrceSpId === 0 ? '全部中介' : text
            }, {
                title: '订单详情',
                width: "45%",
                align: 'center',
                dataIndex: 'OrderDetail'
            }
        ];
        return(
            <Modal
                title="绑定订单"
                visible={bindVisible}
                width={'80%'}
                onCancel={() => setVisible('bindVisible', false)}
                onOk={() => bind(record)}
                confirmLoading={modalLoading}
            >
                <Spin spinning={modalLoading} className="bind-modal">
                    <Row>
                        <Col style={{lineHeight: '32px'}} span={6}>报价日期：{selectedRows[0].IntvDt}</Col>
                        <Col style={{lineHeight: '32px'}} span={6}>企业：{selectedRows[0].EntShortName}</Col>
                        <Col style={{lineHeight: '32px'}} span={6}>劳务：{selectedRows[0].TrgtSpName}</Col>
                        <Col style={{lineHeight: '32px'}} span={6}>中介：{selectedRows[0].SrceSpName}</Col>
                    </Row>
                    <Table
                        bordered
                        rowKey="RcrtOrderId"
                        className="mt-20 table"
                        columns={columns}
                        dataSource={toJS(orderList)}
                        pagination={false}
                        rowClassName={(record, index) => index === selectIndex ? 'bg-blue' : ''}
                        onRow={(record, index) => {
                            return {
                                onClick: () => this.onRowClick(record, index)
                            };
                        }}
                    />
                </Spin>
            </Modal>
        );
    }
}

export default BindModal;