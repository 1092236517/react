import React from 'react';
import { inject, observer } from "mobx-react";
import { toJS } from 'mobx';
import { Table, Button, Spin, Modal } from 'antd';
import { tabWrap } from 'ADMIN_PAGES';
import 'ADMIN_ASSETS/less/pages/listManager.less';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import SearchFormComp from './searchForm';
import SynchModal from './synchModal';
import BindModal from './bindModal';
import SynchOrderModal from './synchOrderModal';
import { InterviewType, bindType, leaveType, isValidType, orderStatusType, generType } from 'ADMIN_CONFIG/enum/ListOrder';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender, tableDateTimeRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
@tabWrap({
    tabName: '名单管理',
    stores: ['listStore']
})
@inject('listStore', 'globalStore')
@observer
class ListMgComp extends React.Component {
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
            OrderReturnFee: '', // 返费详情
            OrderSubsidyFee: '',
            OrderDiffFee: ''
        };
        this.columns = [
            {
                title: '面试日期',
                dataIndex: 'IntvDt',
                render: tableDateRender,
                align: 'center',
                width: 100
            }, {
                title: '企业',
                dataIndex: 'EntShortName',
                align: 'center',
                width: 150
            }, {
                title: '劳务',
                dataIndex: 'TrgtSpName',
                align: 'center',
                width: 220
            }, {
                title: '中介',
                dataIndex: 'SrceSpName',
                align: 'center',
                width: 220,
                render: (text, record, index) => record.SrceSpId === 0 ? '' : text
            }, {
                title: '工种',
                dataIndex: 'WorkName',
                align: 'center',
                width: 120
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
            }, {
                title: '身份证号码',
                dataIndex: 'IdCardNum',
                align: 'center',
                width: 150
            }, {
                title: '姓名',
                dataIndex: 'Realname',
                align: 'center',
                width: 100
            }, {
                title: '性别',
                dataIndex: 'Gender',
                align: 'center',
                width: 80,
                render: (text, record, index) => generType[text].value
            }, {
                title: '工号',
                dataIndex: 'WorkCardNo',
                align: 'center',
                width: 90
            }, {
                title: '手机号码',
                dataIndex: 'Mobile',
                align: 'center',
                width: 120
            }, {
                title: '面试状态',
                dataIndex: 'IntvSts',
                render: (text, record, index) => InterviewType[text] ? InterviewType[text].value : '',
                align: 'center',
                width: 80
            }, {
                title: '订单详情',
                dataIndex: 'OrderDetail',
                render: (text, record, index) => record.RcrtOrderId !== 0 ? (text !== '' ? authority(resId.nameList.details)(<a className="details" style={{ WebkitBoxOrient: 'vertical' }} onClick={() => this.setDetails(text, record)}>{text}</a>) : <span style={{ color: "red" }}>订单尚未同步</span>) : '',
                width: 200,
                align: 'center'
            }, {
                title: '是否绑定订单',
                dataIndex: 'IsBindOrder',
                render: (text, record, index) => bindType[text].value,
                align: 'center',
                width: 110

            }, {
                title: '订单情况',
                dataIndex: 'OrderStatus',
                render: (text, record, index) => orderStatusType[text].value,
                align: 'center',
                width: 80
            }, {
                title: '入职时间',
                dataIndex: 'EntryDt',
                render: tableDateTimeRender,
                align: 'center',
                width: 150
            }, {
                title: '在职状态',
                dataIndex: 'WorkSts',
                render: (text, record, index) => leaveType[text].value,
                align: 'center',
                width: 80
            }, {
                title: '预计转正日期',
                dataIndex: 'PositiveDate',
                align: 'center',
                width: 100
            }, {
                title: '离职时间',
                dataIndex: 'LeaveDt',
                render: tableDateRender,
                align: 'center',
                width: 100
            },
            {
                title: '创建时间',
                dataIndex: 'CreateTm',
                render: tableDateTimeRender,
                align: 'center',
                width: 150
            }, {
                title: '更新时间',
                dataIndex: 'UpdateTm',
                render: tableDateTimeRender,
                align: 'center',
                width: 150
            }, {
                title: '是否作废',
                dataIndex: 'IsValid',
                render: (text, record, index) => isValidType[text].value,
                align: 'center',
                width: 80
            }
        ];
        this.scroll_x = 0;
        this.columns.map(item => (this.scroll_x = item.width + this.scroll_x));
    }

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/orderlist/listManager']);
        if (!this.props.listStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    onChange = (page, pageSize) => {
        this.props.listStore.getList({ RecordIndex: page, RecordSize: pageSize });
    }

    setDetails = (text, record) => {
        this.setState({ record });
        this.props.listStore.setVisible('orderDetailsVisible', true);
        let OrderDetail2 = record.OrderDetail2;
        let orderResult = record.OrderReturnFee ? record.OrderReturnFee.split(',') : [];
        let OrderSubsidyFee = record.OrderSubsidyFee ? JSON.stringify(record.OrderSubsidyFee).replace(/\\n/g, "<br />").replace(/\"/g, "") : '';
        let OrderDiffFee = record.OrderDiffFee ? JSON.stringify(record.OrderDiffFee).replace(/\\n/g, "<br />").replace(/\"/g, "") : '';
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
        this.props.listStore.setVisible('orderDetailsVisible', true);
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

    render() {
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { view, handleFormReset, handleFormValuesChange, getList, onSelectChange, setVisible, line,
            listInvalid, cancelInvalid, importList } = this.props.listStore;
        const { searchValue, selectedRowKeys, page, RecordCount, loading, dataSource } = view;
        const { bindVisible, modalLoading, listInvalidVisible, cancelInvalidVisible, importVisible, orderDetailsVisible, listRecoveryVisible } = view;
        const rowSelection = {
            selectedRowKeys,
            onChange: onSelectChange
        };
        return (
            <div className="list-manager">
                {authority(resId.nameList.sync)(<Button onClick={() => { setVisible('synchVisible', true); window._czc.push(['_trackEvent', '名单管理', '同步名单', '名单管理_Y结算']); }} className="mr-20 mb-10" type="primary">同步名单</Button>)}
                {authority(resId.nameList.syncOrder)(<Button onClick={() => { setVisible('synchOrderVisible', true); window._czc.push(['_trackEvent', '名单管理', '同步订单', '名单管理_Y结算']); }} className="mr-20 mb-10" type="primary">同步订单</Button>)}
                {/* {authority(resId.nameList.bing)(<Button onClick={() => line('bindVisible', true)} className="mr-20 mb-10" type="primary">绑定订单</Button>)} */}
                {authority(resId.nameList.cancel)(<Button onClick={() => { line('listInvalidVisible'); window._czc.push(['_trackEvent', '名单管理', '名单作废', '名单管理_Y结算']); }} className="mr-20 mb-10" type="primary">名单作废</Button>)}
                {authority(resId.nameList.export)(<Button disabled={dataSource.length === 0} onClick={() => { line('importVisible', true); window._czc.push(['_trackEvent', '名单管理', '导出', '名单管理_Y结算']); }} className="mr-20 mb-10" type="primary">导出</Button>)}
                {authority(resId.nameList.recovery)(<Button onClick={() => { line('recoveryList'); window._czc.push(['_trackEvent', '名单管理', '恢复名单', '名单管理_Y结算']); }} className="mr-20 mb-10" type="primary">恢复名单</Button>)}
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
                    rowKey="NameIstId"
                    bordered
                    scroll={{ x: this.scroll_x + 63, y: 550 }}
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={toJS(dataSource)}
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
                <SynchModal />
                <SynchOrderModal />
                {
                    bindVisible && <BindModal />
                }
                <Modal
                    title="作废确认"
                    visible={listInvalidVisible}
                    onCancel={() => setVisible('listInvalidVisible', false)}
                    onOk={() => { listInvalid(); window._czc.push(['_trackEvent', '名单管理', '作废确认', '名单管理_Y结算']); }}
                    confirmLoading={modalLoading}
                >
                    您确定要作废这些名单吗？
                </Modal>
                <Modal
                    visible={cancelInvalidVisible}
                    onCancel={() => setVisible('cancelInvalidVisible', false)}
                    onOk={() => { cancelInvalid(); window._czc.push(['_trackEvent', '名单管理', '取消作废确认', '名单管理_Y结算']); }}
                    confirmLoading={modalLoading}
                >
                    取消作废
                </Modal>
                <Modal
                    title="恢复作废"
                    visible={listRecoveryVisible}
                    onCancel={() => setVisible('listRecoveryVisible', false)}
                    onOk={() => { listInvalid(); window._czc.push(['_trackEvent', '名单管理', '恢复作废确认', '名单管理_Y结算']); }}
                    confirmLoading={modalLoading}
                >
                    您确定要恢复这些名单吗？
                </Modal>
                <Modal
                    title="导出确认"
                    visible={importVisible}
                    onCancel={() => setVisible('importVisible', false)}
                    onOk={() => { importList(); window._czc.push(['_trackEvent', '名单管理', '导出确认', '名单管理_Y结算']); }}
                    confirmLoading={modalLoading}
                >
                    您确定要导出这些数据吗？
                </Modal>
                <Modal
                    title="订单详情"
                    onCancel={() => setVisible('orderDetailsVisible', false)}
                    footer={null}
                    visible={orderDetailsVisible}
                >
                    <Spin spinning={modalLoading}>
                        {/* {this.state.record} */}
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
                                                <td key={index} className="tdContent" style={{ "display": "block", "width": '100%' }}>{item.DateInterval}<br />{item.SalaryExplainDetail}</td>
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
            </div>
        );
    }
}

export default ListMgComp;