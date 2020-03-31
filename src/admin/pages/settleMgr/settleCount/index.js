import { tabWrap } from 'ADMIN_PAGES';
import { Table, Button, Form } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';
import { tableDateMonthRender } from 'ADMIN_UTILS/tableItemRender';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';

@tabWrap({
    tabName: 'ZX结算汇总',
    stores: ['settleCountStore']
})

@inject('settleCountStore', 'globalStore')

@observer
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            record: {
                x: null,
                id: null,
                remark: ''
            }
        };
    }
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/settleMgr/xCount']);
        if (!this.props.settleCountStore.view.isDirty) {
            this.settleGetSummary();
            this.getAllCompanyInfo();
        }
    }
    settleGetSummary = this.props.settleCountStore.settleGetSummary;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;

    // 导出
    export = () => {
        let Data = this.props.settleCountStore.exportX();
        Data.then((res) => {
            window.open(res.FileUrl);
        });
    }

    render() {
        const { view, handleFormValuesChange, handleFormReset, settleGetSummary, resetPageCurrent, setPagination, onSelectChange, line, transData } = this.props.settleCountStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum, selectedRowKeys } = view;
        const { companyList, laborList } = this.props.globalStore;
        const ChangeformItemLayout = {
            wrapperCol: { span: 18, offset: 0 }
        };

        let columns = [
            { title: '企业', dataIndex: 'EntName', align: 'center', width: '10%' },
            { title: '劳务', dataIndex: 'TrgtSpName', align: 'center', width: '10%' },
            { title: '月份', dataIndex: 'RelatedMo', align: 'center', width: '10%', render: tableDateMonthRender },
            { title: '在职天数', dataIndex: 'InWorkDays', align: 'center', width: '10%' },
            {
                title: '1.0((x-y)/2)', dataIndex: 'OneMoney', align: 'center', width: '10%', render: (text, record) => {
                    return (convertCentToThousandth(text) + "/" + convertCentToThousandth(record.AverageOneMoney));
                }
            },
            {
                title: 'Z', dataIndex: 'AgentMoney', align: 'center', width: '10%', render: (text, record) => {
                    return (convertCentToThousandth(text) + "/" + convertCentToThousandth(record.AverageAgentMoney));
                }
            },
            { title: '差值((x-y)/2 - Z)', dataIndex: 'DifferenceValue', align: 'center', width: '10%', render: convertCentToThousandth },
            {
                title: '处理状态', dataIndex: 'DealSts',
                align: 'center',
                width: '10%',
                render: (text, record) => ({
                    1: <span>未处理</span>,
                    2: <span>已处理</span>
                }[text])
            },
            { title: '操作人', dataIndex: 'DealUserName', align: 'center', width: '5%' },
            {
                title: '操作时间', dataIndex: 'DealTm', align: 'center', width: '8%', render: (text, record) =>
                    tableDateTimeRender(text)
            }
        ];
        return (
            <div>
                {/* {authority(resId.settleMgr.settleCount.exportX)(<Button onClick={this.export} className="ml-8" type = "primary" style = {{marginBottom: "20px"}}>导出</Button>)} */}
                {authority(resId.settleMgr.settleCount.moreHandle)(<Button onClick={() => { line(); window._czc.push(['_trackEvent', 'ZX结算汇总', '批量处理', 'ZX结算汇总_Y结算']); }} className="ml-8" type="primary" style={{ marginBottom: "20px" }}>批量处理</Button>)}
                <SearchForm
                    {...{
                        searchValue,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: settleGetSummary,
                        resetPageCurrent,
                        laborList,
                        companyList
                    }}
                />
                {/* <Form>
                    <Row>
                        <Col span = {24}>
                            <FormItem {...ChangeformItemLayout}>
                                <p style = {{fontWeight: "700", fontSize: "18px", color: '#e84e40', marginBottom: '0px'}}>还有n家未处理</p>
                                <p style = {{fontWeight: "700", fontSize: "18px", color: '#e84e40', marginBottom: '0px'}}>(x-y)/2共m元；配置中介费(a)共r元，差值共q元</p>
                            </FormItem>
                        </Col>                      
                    </Row>
                </Form> */}
                <Table
                    rowKey={'RowIndex'}
                    bordered={true}
                    dataSource={RecordList.slice()}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectChange,
                        getCheckboxProps: (record) => ({ disabled: record.DealSts === 2 })
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
            </div>

        );
    }
}

