import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { Button, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';
import { tableDateMonthRender } from 'ADMIN_UTILS/tableItemRender';
import ModifyModal from './ModifyModal';
import SearchForm from './searchForm';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
@tabWrap({
    tabName: 'X汇总表',
    stores: ['xCountStore']
})

@inject('xCountStore', 'globalStore')

@observer
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            record: {}
        };
    }
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/settleMgr/xCount']);
        if (!this.props.xCountStore.view.isDirty) {
            this.getXSummary();
            this.getAllCompanyInfo();
        }
    }
    getXSummary = this.props.xCountStore.getXSummary;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;

    // 导出
    export = () => {
        let Data = this.props.xCountStore.exportX();
        Data.then((res) => {
            window.open(res.FileUrl);
        });
    }

    // modal隐藏
    ModalHidden = () => {
        this.setState({
            visible: false
        });
    }

    // modal显示
    ModalShow = () => {
        this.setState({
            visible: true
        });
    }

    // 修改最终X
    modifyX = (record) => {
        this.ModalShow();
        window._czc.push(['_trackEvent', 'X汇总表', '查询', 'X汇总表_Y结算']);
        this.setState({
            record: {
                EndXmoney: record.EndXmoney,
                RelatedMo: record.RelatedMo,
                ModifyRemark: record.ModifyRemark,
                EntId: record.EntId,
                TrgtSpId: record.TrgtSpId

            }
        }, () => {
            console.log(this.state.record);
        });
    }

    render() {
        const { view, handleFormValuesChange, handleFormReset, getXSummary, resetPageCurrent, setPagination, onSelectChange, line, saveData } = this.props.xCountStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum, selectedRowKeys } = view;
        const { companyList, laborList } = this.props.globalStore;
        const ChangeformItemLayout = {
            wrapperCol: { span: 18, offset: 0 }
        };

        let columns = [
            { title: '企业', dataIndex: 'EntName', align: 'center', width: '10%' },
            { title: '劳务', dataIndex: 'TrgtSpName', align: 'center', width: '10%' },
            { title: '月份', dataIndex: 'RelatedMo', align: 'center', width: '10%', render: tableDateMonthRender },
            { title: '导入X', dataIndex: 'ImportXmoney', align: 'center', width: '10%', render: convertCentToThousandth },
            {
                title: '最终X', dataIndex: 'EndXmoney',
                align: 'center',
                width: '10%',
                render: (text, record) => (authority(resId.settleMgr.xCount.modifyX)(<a href='#' onClick={() => { this.modifyX(record); window._czc.push(['_trackEvent', 'X汇总表', '最终X', 'X汇总表_Y结算']); }}>{convertCentToThousandth(text)}</a>))

            },
            { title: '修改人', dataIndex: 'ModifyName', align: 'center', width: '10%' },
            { title: '修改说明', dataIndex: 'ModifyRemark', align: 'center', width: '14%' },
            {
                title: '审核状态', dataIndex: 'AuditSts',
                align: 'center',
                width: '10%',
                render: (text) => ({
                    1: <span style={{ color: "green" }}>未审核</span>,
                    2: <span>审核通过</span>,
                    3: <span style={{ color: "#e84e40" }}>审核未通过</span>,
                    4: <span></span>
                }[text])
            },
            { title: '审核人', dataIndex: 'AuditName', align: 'center', width: '5%' },
            {
                title: '审核时间', dataIndex: 'AuditTime', align: 'center', width: '8%', render: (text, record) =>
                    tableDateTimeRender(text)
            },
            {
                title: '修改时间', dataIndex: 'ModifyTime', align: 'center', width: '8%', render: (text, record) =>
                    tableDateTimeRender(text)
            }
        ];
        return (
            <div>
                {/* {authority(resId.settleMgr.xCount.exportX)(<Button onClick={this.export} className="ml-8" type = "primary" style = {{marginBottom: "20px"}}>导出</Button>)} */}
                {authority(resId.settleMgr.xCount.auditPassX)(<Button onClick={() => { line(2); window._czc.push(['_trackEvent', 'X汇总表', '审核通过', 'X汇总表_Y结算']); }} className="ml-8" type="primary" style={{ marginBottom: "20px" }}>审核通过</Button>)}
                {authority(resId.settleMgr.xCount.auditNotPassX)(<Button onClick={() => { line(3); window._czc.push(['_trackEvent', 'X汇总表', '审核不通过', 'X汇总表_Y结算']); }} className="ml-8" type="primary" style={{ marginBottom: "20px" }}>审核不通过</Button>)}
                <SearchForm
                    {...{
                        searchValue,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: getXSummary,
                        resetPageCurrent,
                        laborList,
                        companyList
                    }}
                />
                {/* <Form>
                    <Row>
                        <Col span = {24}>
                            <FormItem {...ChangeformItemLayout}>
                                <span style = {{fontWeight: "700", fontSize: "18px", color: '#e84e40'}}>导入X共n元；最终X共m元；差值（最终X-导入X）共r元</span>
                            </FormItem>
                        </Col>                      
                    </Row>
                </Form> */}
                <Table
                    rowKey={'RecordID'}
                    bordered={true}
                    dataSource={RecordList.slice()}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectChange,
                        getCheckboxProps: (record) => ({ disabled: (record.AuditSts === 2 || record.AuditSts === 3 || record.AuditSts === 4) })
                    }}

                    loading={FormListStatus === "pending"}
                    columns={columns}
                    scroll={{ y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        pageSize: pagination.pageSize,
                        current: pagination.current,
                        total: totalNum,
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        },
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        }
                    }}
                />
                <ModifyModal
                    {...{
                        visible: this.state.visible,
                        record: this.state.record,
                        saveData,
                        ModalHidden: this.ModalHidden,
                        ModalShow: this.ModalShow
                    }} />
            </div>

        );
    }
}

