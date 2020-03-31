import React from 'react';
import { Table, Button, Spin, Modal } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { tabWrap } from 'ADMIN_PAGES';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import 'ADMIN_ASSETS/less/pages/orderManager.less';
import SearchFormComp from './searchForm';
import AddForm from './addModal';
import SynchOrderModal from './synchOrderModal';
import BatchSynchOrderModal from './batchSynchOrderModal';

import { bindType, isValidType } from 'ADMIN_CONFIG/enum/ListOrder';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';

@tabWrap({
    tabName: '订单管理',
    stores: ['orderStore']
})
@inject('orderStore', 'globalStore')
@observer
class OrderMgComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: '',
            Standard: '', // c端借支标准
            cX: '', // c端薪资说明
            AgentFee: '', // 中介费用
            PlatFee: '', // 平台费用
            // remark: '', // 备注
            SalaryExplain: [],
            DateInterval: [],
            visible: false,
            detailRemark: '',
            OrderReturnFee: [], // 返费详情
            OrderSubsidyFee: '',
            OrderDiffFee: ''
        };
        this.columns = [
            {
                title: '报价日期',
                dataIndex: 'OrderDt',
                render: tableDateRender,
                align: 'center',
                width: 130
            }, {
                title: '企业',
                dataIndex: 'EntName',
                width: 150,
                align: 'center'
            }, {
                title: '劳务',
                dataIndex: 'TrgtSpName',
                width: 150,
                align: 'center'
            }, {
                title: '中介',
                dataIndex: 'SrceSpName',
                width: 150,
                align: 'center',
                render: (text, record, index) => record.SrceSpId === 0 ? '全部中介' : text
            }, {
                title: '结算模式',
                dataIndex: 'SettlementType',
                align: 'center',
                width: 90,
                render: settleTypeRender
            }, {
                title: '用工模式',
                dataIndex: 'EmploymentType',
                align: 'center',
                width: 150,
                render: (text) => ({ 1: '劳务用工', 2: '灵活用工爱员工' }[text])
            },
            {
                title: '订单详情',
                dataIndex: 'OrderDetail',
                render: (text, record, index) => authority(resId.orderList.details)(<a className="details" onClick={() => this.setDetails(text, record)}>{text}</a>),
                width: 200,
                align: 'center'
            },
            {
                title: '是否绑定',
                dataIndex: 'IsBindName',
                render: (text, record, index) => bindType[text].value,
                align: 'center',
                width: 100
            }, {
                title: '是否作废',
                dataIndex: 'IsValid',
                render: (text, record, index) => isValidType[text].value,
                align: 'center',
                width: 100
            }, {
                title: '创建人',
                dataIndex: 'CreateName',
                align: 'center',
                width: 90
            }, {
                title: '内部备注',
                dataIndex: 'InsideRemark',
                align: 'center',
                width: 200,
                render: (text) => (<a onClick={() => this.setRemark(text)} className='details'>{text}</a>)
            }
        ];
        this.scroll_x = 0;
        this.columns.map(item => (this.scroll_x = item.width + this.scroll_x));
    }

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/orderlist/orderManager']);
        if (!this.props.orderStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    setDetails = (text, record) => {
        let OrderDetail2 = record.OrderDetail2;
        let orderResult = record.OrderReturnFee ? record.OrderReturnFee.split(',') : [];

        let OrderSubsidyFee = record.OrderSubsidyFee ? JSON.stringify(record.OrderSubsidyFee).replace(/\\n/g, "<br/>").replace(/\"/g, "") : '';
        let OrderDiffFee = record.OrderDiffFee ? JSON.stringify(record.OrderDiffFee).replace(/\\n/g, "<br/>").replace(/\"/g, "") : '';
        this.setState({
            record: record.OrderDetail,
            Standard: OrderDetail2.Standard,
            SalaryExplain: OrderDetail2.SalaryExplain,
            AgentFee: OrderDetail2.AgentFee,
            PlatFee: OrderDetail2.PlatFee,
            OrderReturnFee: orderResult,
            OrderSubsidyFee: OrderSubsidyFee,
            OrderDiffFee: OrderDiffFee
        });
        this.props.orderStore.setVisible('orderDetailsVisible', true);
    }

    setRemark = (text) => {
        this.setState({
            detailRemark: text
        });
        this.props.orderStore.setVisible('orderRemarkVisible', true);
    }

    showDetail = (flag) => {
        if (flag) {
            this.setState({
                visible: false
            });
        } else {
            this.setState({
                visible: !this.state.visible
            });
        }

    }

    onChange = (page, pageSize) => {
        this.props.orderStore.getList({ RecordIndex: page, RecordSize: pageSize });
    }

    render() {
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { view, onSelectChange, getList, handleFormValuesChange, handleFormReset, setVisible, orderInvalid, line, importList } = this.props.orderStore;
        const { selectedRowKeys, page, RecordCount, searchValue, loading, dataSource } = view;
        const { orderInvalidVisible, modalLoading, importVisible, addVisible, orderDetailsVisible, orderRemarkVisible } = view;
        const rowSelection = {
            selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: record => ({
                disabled: record.IsBindName === 1
            })
        };
        return (
            <div className="order">
                {authority(resId.orderList.syncOrder)(<Button onClick={() => { setVisible('synchOrderVisible', true); window._czc.push(['_trackEvent', '订单管理', '同步订单', '订单管理_Y结算']); }} className="mr-20 mb-10" type="primary">同步订单</Button>)}
                {authority(resId.orderList.batchSyncOrder)(<Button onClick={() => { setVisible('batchSynchOrderVisible', true); window._czc.push(['_trackEvent', '订单管理', '批量同步订单', '订单管理_Y结算']); }} className="mr-20 mb-10" type="primary">批量同步订单</Button>)}
                {/* {authority(resId.orderList.add)(<Button onClick={() => setVisible('addVisible', true)} className="mr-20 mb-10" type="primary">新增</Button>)} */}
                {/* {authority(resId.orderList.cancel)(<Button onClick={() => line('orderInvalidVisible')} className="mr-20 mb-10" type="primary">订单作废</Button>)} */}
                {authority(resId.orderList.export)(<Button disabled={dataSource.length === 0} onClick={() => { line('importVisible'); window._czc.push(['_trackEvent', '订单管理', '导出', '订单管理_Y结算']); }} className="mr-20 mb-10" type="primary">导出</Button>)}
                <SearchFormComp
                    searchValue={searchValue}
                    handleFormReset={handleFormReset}
                    onValuesChange={handleFormValuesChange}
                    handleSubmit={getList}
                    loading={loading}
                    {...{
                        agentList,
                        companyList,
                        laborList
                    }}
                />
                <Table
                    rowKey="RcrtOrderId"
                    bordered
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={toJS(dataSource)}
                    scroll={{ x: this.scroll_x + 63, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        current: page.RecordIndex,
                        pageSize: page.RecordSize,
                        total: RecordCount,
                        onChange: (page, pageSize) => this.onChange(page, pageSize),
                        onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize)
                    }}
                    loading={loading}
                />
                {addVisible && <AddForm />}
                <SynchOrderModal />
                <BatchSynchOrderModal />
                <Modal
                    title="作废确认"
                    visible={orderInvalidVisible}
                    onCancel={() => setVisible('orderInvalidVisible', false)}
                    onOk={()=>{orderInvalid();window._czc.push(['_trackEvent', '订单管理', '作废确认', '订单管理_Y结算']);}}
                    confirmLoading={modalLoading}
                >
                    您确定要作废这些订单吗？
                </Modal>
                <Modal
                    title="导出确认"
                    visible={importVisible}
                    onCancel={() => setVisible('importVisible', false)}
                    onOk={()=>{importList();window._czc.push(['_trackEvent', '订单管理', '导出确认', '订单管理_Y结算']);}}
                    confirmLoading={modalLoading}
                >
                    您确定要导出这些数据吗？
                </Modal>
                <Modal
                    title="详情"
                    onCancel={() => {
                        this.showDetail(true);
                        ;window._czc.push(['_trackEvent', '订单管理', '关闭详情', '订单管理_Y结算']);
                        setVisible('orderDetailsVisible', false);
                    }
                    }
                    footer={null}
                    visible={orderDetailsVisible}
                >
                    <Spin spinning={modalLoading}>
                        <p className="more" onClick={() => this.showDetail()} >
                            <span className="line">__</span>
                            <span className="line">__</span>
                            <span className="line">__</span>
                            <span className="line">__</span>
                        </p>
                        {this.state.visible ? <p className="detail">{this.state.record}</p> : ''}
                        {!this.state.visible ? <table bordered="1">
                            <tbody>
                                <tr className="trStyle">
                                    <td className="tdTitle">C端借支标准：</td>
                                    <td className="tdContent">{this.state.Standard}</td>
                                </tr>
                                <tr className="trStyle">
                                    <td className="tdTitle">C端薪资说明：</td>
                                    {
                                        this.state.SalaryExplain.map((item, index) => {
                                            return (
                                                <td key={index} className="tdContent" style={{ "display": "block", "width": '100%' }}>{item.DateInterval}<br />{item.SalaryExplainDetail}<br /></td>
                                            );
                                        })
                                    }
                                </tr>
                                <tr className="trStyle">
                                    <td className="tdTitle">服务费用：</td>
                                    <td className="tdContent">{this.state.AgentFee}</td>
                                </tr>
                                <tr className="trStyle">
                                    <td className="tdTitle">平台费用：</td>
                                    <td className="tdContent">{this.state.PlatFee}</td>
                                </tr>
                                {this.state.OrderReturnFee.length > 0 ?
                                    <tr className="trStyle">
                                        <td className="tdTitle">返费详情：</td>
                                        {
                                            this.state.OrderReturnFee.map((item, index) => {
                                                return <tr key={index} className="tdContent">{item}</tr>;
                                            })
                                        }
                                    </tr> : ''
                                }
                                <tr className="trStyle">
                                    <td className="tdTitle">差价补发：</td>
                                    <td className="tdContent"><span dangerouslySetInnerHTML={{ __html: this.state.OrderDiffFee ? this.state.OrderDiffFee : '无' }}></span></td>
                                </tr>
                                <tr className="trStyle">
                                    <td className="tdTitle">额外补贴：</td>
                                    <td className="tdContent" ><span dangerouslySetInnerHTML={{ __html: this.state.OrderSubsidyFee ? this.state.OrderSubsidyFee : '无' }}></span></td>
                                </tr>
                            </tbody>
                        </table>
                            : ''
                        }
                    </Spin>

                </Modal>

                <Modal
                    title="内部备注"
                    onCancel={() => {
                        this.showDetail(true);
                        ;window._czc.push(['_trackEvent', '订单管理', '关闭内部备注', '订单管理_Y结算']);
                        setVisible('orderRemarkVisible', false);
                    }
                    }
                    footer={null}
                    visible={orderRemarkVisible}
                >
                    <Spin spinning={modalLoading}>
                        {this.state.detailRemark}
                    </Spin>

                </Modal>
            </div>
        );
    }
}

export default OrderMgComp;