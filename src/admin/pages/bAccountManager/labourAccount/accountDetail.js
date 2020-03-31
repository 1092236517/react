import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import { tabWrap } from 'ADMIN_PAGES';
import { Button, Col, Form, Row, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { convertCentToThousandth } from 'web-react-base-utils';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import SearchForm from './accountSearchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
const FormItem = Form.Item;

@tabWrap({
    tabName: '劳务账户明细',
    stores: ['labourAccountStore']
})

@inject('labourAccountStore')

@observer
export default class LabourAccountDetailList extends React.Component {
    componentDidMount() {
        if (!this.props.labourAccountStore.view.isDirty) {
            let url = window.location.href;
            let idCode = url.lastIndexOf("=");
            let id = url.substring(idCode + 1);
            this.props.labourAccountStore.getDetailId(id);
            this.getSpAccountFlow(id);
        }
    }

    getSpAccountFlow = this.props.labourAccountStore.getSpAccountFlow;

    // 导出
    export = () => {
        let Data = this.props.labourAccountStore.exportSpAccountFlow();
        Data.then((res) => {
            window.open(res.FileUrl);
        });
        window._czc.push(['_trackEvent', '劳务账户', '导出', '劳务账户_N非结算']);
    }

    detailFun = (text) => {
        this.props.labourAccountStore.getTradId(text);
    }

    render() {
        const { view, handleDetailFormValuesChange, handleDetailFormReset, getSpAccountFlow, resetdetailPageCurrent, setdetailPagination } = this.props.labourAccountStore;
        const { detailValue, DetailRecordList, FormListStatus, detailpagination, detailtotalNum, TypeList, labourInfo } = view;

        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const ChangeformItemLayout = {
            wrapperCol: { span: 18, offset: 0 }
        };
        let columns = [
            {
                title: '时间',
                dataIndex: 'CreatedTm',
                align: 'center',
                width: '25%',
                render: tableDateTimeRender
            },


            {
                title: '交易类型',
                dataIndex: 'TradeTyp',
                align: 'center',
                width: '18%',
                render: (text, record, index) => {
                    return ({ 1: '账户充值', 2: '账户提现', 3: '押金充值', 4: '押金提现', 5: '周薪账单', 6: '月薪账单' }[record.TradeTyp]);
                }
            },
            { title: '所属对账单批次号', dataIndex: 'BillBatchId', align: 'center', width: '25%' },
            {
                title: '变动金额（元）',
                dataIndex: 'DealAmt',
                align: 'center',
                width: '18%',
                render: (text, record) => record.AccntDirection === 1 ? <span>+{convertCentToThousandth(text)}</span> : <span>-{convertCentToThousandth(text)}</span>
            },
            {
                title: '查看', dataIndex: 'TradeId',
                align: 'center',
                width: '14%',
                render: (text, record, index) => {
                    return (
                        {
                            1: <Link onClick={() => this.detailFun(text)} to={"/bAccountManager/labourAccount/spAccountBillDetail?id=" + text}>查看</Link>,
                            2: <Link to={"/bAccountManager/labourAccount/spAccountBillDetail?id=" + text}>查看</Link>,
                            3: <Link to={"/bAccountManager/labourAccount/spAccountBillDetail?id=" + text}>查看</Link>,
                            4: <Link to={"/bAccountManager/labourAccount/spAccountBillDetail?id=" + text}>查看</Link>,
                            5: <Link to={"/weeklyWageManager/bill/" + record.BillBatchId + "/agentSee"}>查看</Link>,
                            6: <Link to={"/monthlyWageManager/bill/" + record.BillBatchId}>查看</Link>
                        }[record.TradeTyp]
                    );
                }
            }
        ];
        return (
            <div>
                {authority(resId.labourAccountList.exportDetail)(<Button className="mb-20" type="primary" onClick={this.export}>导出</Button>)}
                <SearchForm
                    {...{
                        detailValue,
                        TypeList,
                        handleFormReset: handleDetailFormReset,
                        onValuesChange: handleDetailFormValuesChange,
                        handleFormSubmit: getSpAccountFlow,
                        resetdetailPageCurrent
                    }}
                />
                <Form>
                    <Row className="dashedBorder">
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="劳务全称  " className="detailMargin">
                                <span>{labourInfo.SpFullName}</span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="劳务简称  " className="detailMargin">
                                <span>{labourInfo.SpShortName}</span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="劳务联系人 " className="detailMargin">
                                <span>{labourInfo.CtctName}</span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="联系电话  " className="detailMargin">
                                <span>{labourInfo.CtctMobile.replace(labourInfo.CtctMobile.slice(3, 7), '****')}</span>
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="业务账户余额" className="detailMargin">
                                <span style={{ fontWeight: "700" }}>{convertCentToThousandth(labourInfo.AccntBalance)}</span>
                            </FormItem>
                        </Col>

                        <Col span={6}>
                            <FormItem {...formItemLayout} label="业务账户充值" className="detailMargin">
                                <span>{convertCentToThousandth(labourInfo.TotInAmt)}</span>
                            </FormItem>
                        </Col>

                        <Col span={6}>
                            <FormItem {...formItemLayout} label="业务账户支出" className="detailMargin">
                                <span>{convertCentToThousandth(labourInfo.TotOutAmt)}</span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="业务账户提现" className="detailMargin">
                                <span>{convertCentToThousandth(labourInfo.TotForCash)}</span>
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="押金账户余额" className="detailMargin">
                                <span style={{ fontWeight: "700" }}>{convertCentToThousandth(labourInfo.DepositAccntBalance)}</span>
                            </FormItem>
                        </Col>

                        <Col span={6}>
                            <FormItem {...formItemLayout} label="押金账户充值" className="detailMargin">
                                <span>{convertCentToThousandth(labourInfo.TotInAmtY)}</span>
                            </FormItem>
                        </Col>

                        <Col span={6}>
                            <FormItem {...formItemLayout} label="押金账户提现" className="detailMargin">
                                <span>{convertCentToThousandth(labourInfo.TotForCashY)}</span>
                            </FormItem>
                        </Col>
                    </Row>

                    <Row className="dashedBorder">
                        <Col span={24}>
                            <FormItem {...ChangeformItemLayout}>
                                <span style={{ fontWeight: "700", fontSize: "18px" }}>当前筛选条件下，累计变动金额为{convertCentToThousandth(labourInfo.TotalChangeAmount)}元</span>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table
                    rowKey={'TradeId'}
                    bordered={true}
                    dataSource={DetailRecordList.slice()}
                    loading={FormListStatus === "pending"}
                    columns={columns}
                    scroll={{ y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        pageSize: detailpagination.pageSize,
                        current: detailpagination.current,
                        total: detailtotalNum,
                        onChange: (page, pageSize) => {
                            setdetailPagination(page, pageSize);
                        },
                        onShowSizeChange: (current, size) => {
                            setdetailPagination(current, size);
                        }
                    }}
                />
            </div>

        );
    }
}


