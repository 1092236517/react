import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { homeStore } from 'ADMIN_STORE';
import { Button, Col, Form, Row, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { convertCentToThousandth } from 'web-react-base-utils';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import SearchForm from './accountSearchForm';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

const FormItem = Form.Item;

@tabWrap({
    tabName: '到账明细',
    stores: ['agencyAccountStore']
})

@inject('agencyAccountStore')

@observer
export default class AgencyAccountDetailList extends React.Component {
    componentDidMount() {
        if (!this.props.agencyAccountStore.view.isDirty) {
            let url = window.location.href;
            let idCode = url.lastIndexOf("=");
            let id = url.substring(idCode + 1);
            this.props.agencyAccountStore.getDetailId(id);
            this.getAgentDetail();
            let record = this.props.agencyAccountStore.record;
            if (!record) {
                homeStore.handleTabOperate('close');
            } else {
                let view = this.props.agencyAccountStore.view.agencyInfo;
                view.SrceSpFullName = record.SrceSpFullName;
                view.SrceSpShortName = record.SrceSpShortName;
                view.CtctName = record.CtctName;
                view.CtctMobile = record.CtctMobile;
                view.AgentAmt = record.AgentAmt;
            }
        }
    }
    getAgentDetail = this.props.agencyAccountStore.getAgentDetail;

    // 导出
    export = () => {
        let Data = this.props.agencyAccountStore.exportAgentDetail();
        window._czc.push(['_trackEvent', '中介费到账记录明细', '导出', '中介费到账记录明细_N非结算']);
        Data.then((res) => {
            if (res) {
                window.open(res.FileUrl);
            }
        });
    }

    render() {
        const { view, handleDetailFormValuesChange, handleDetailFormReset, getAgentDetail, resetdetailPageCurrent, setdetailPagination } = this.props.agencyAccountStore;
        const { detailValue, DetailRecordList, FormListStatus, detailpagination, totalNum, TypeList, AgentAllAmt, agencyInfo } = view;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 }
        };
        const ChangeformItemLayout = {
            wrapperCol: { span: 18, offset: 0 }
        };
        let columns = [
            {
                title: '交易时间',
                dataIndex: 'DealTm',
                align: 'center',
                width: '26%',
                render: tableDateTimeRender
            },
            { title: '所属对账单批次号', dataIndex: 'BillBatchId', align: 'center', width: '26%' },
            {
                title: '服务费（元）',
                dataIndex: 'DealAmt',
                align: 'center',
                width: '26%',
                render: convertCentToThousandth
            },
            {
                title: '查看',
                dataIndex: 'primaryIndex',
                align: 'center',
                width: '22%',
                render: (text, record, index) => <Link onClick={() => { window._czc.push(['_trackEvent', '中介费到账记录明细', '查看', '中介费到账记录明细_N非结算']); }} to={"/weeklyWageManager/bill/" + record.BillBatchId + "/agentSee"}>查看</Link>
            }
        ];

        return (
            <div>
                {authority(resId.agencyAccountList.exportDetail)(<Button className="mb-20" type="primary" onClick={this.export}>导出</Button>)}
                <SearchForm
                    {...{
                        detailValue,
                        TypeList,
                        handleFormReset: handleDetailFormReset,
                        onValuesChange: handleDetailFormValuesChange,
                        handleFormSubmit: getAgentDetail,
                        resetdetailPageCurrent
                    }}
                />
                <Form>
                    <Row className="dashedBorder">
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="中介全称" className="detailMargin" style={{ fontWeight: "700" }}>
                                <span style={{ fontWeight: "700" }}>{agencyInfo.SrceSpFullName}</span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="累计服务费" className="detailMargin">
                                <span style={{ fontWeight: "700" }}>{convertCentToThousandth(agencyInfo.AgentAmt)}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="中介名称" className="detailMargin">
                                <span>{agencyInfo.SrceSpShortName}</span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="联系人" className="detailMargin">
                                <span>{agencyInfo.CtctName}</span>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="联系电话" className="detailMargin">
                                <span>{agencyInfo.CtctMobile.replace(agencyInfo.CtctMobile.slice(3, 7), '****')}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="dashedBorder">
                        <Col span={24}>
                            <FormItem {...ChangeformItemLayout}>
                                <span style={{ fontWeight: "700", fontSize: "18px" }}>当前筛选条件下，累计变动金额为{convertCentToThousandth(AgentAllAmt)}元</span>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table
                    rowKey={'primaryIndex'}
                    bordered={true}
                    dataSource={DetailRecordList.slice()}
                    loading={FormListStatus === "pending"}
                    columns={columns}
                    scroll={{ y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        pageSize: detailpagination.pageSize,
                        current: detailpagination.current,
                        total: totalNum.total,
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

