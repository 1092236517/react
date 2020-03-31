import 'ADMIN_ASSETS/less/pages/payrollImport.less';
import { tabWrap } from 'ADMIN_PAGES';
import { tableDateMonthRender, tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { Button, Input, message, Modal, Spin, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import SearchForm from './searchForm';
import { generateColInfo } from 'ADMIN_UTILS';

const { TextArea } = Input;
@tabWrap({
    tabName: '工资单查询',
    stores: ['payrollSelectStore']
})

@inject('payrollSelectStore', 'globalStore')

@observer
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            AuditRemark: '',
            record: ''
        };
    }
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/monthlyWageManager/payrollSelect']);
        if (!this.props.payrollSelectStore.view.isDirty) {
            this.selectSalary();
            this.getAllCompanyInfo();
        }
    }

    handleRemark = (e) => {
        this.setState({
            AuditRemark: e.target.value
        });
    }

    setModal = () => {
        const { selectedRowKeys } = this.props.payrollSelectStore.view;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }

        Modal.confirm({
            title: '审核备注',
            content: (
                <TextArea onChange={this.handleRemark} style={{ marginTop: 16 }} rows={3} maxLength={100} placeholder='审核备注' />
            ),
            onOk: () => {
                this.props.payrollSelectStore.line(3, this.state.AuditRemark);
                window._czc.push(['_trackEvent', '工资单查询', '审核通过', '工资单查询_Y结算']);
            }
        });
    }

    setDetails = (record) => {
        this.setState({ record });
        this.props.payrollSelectStore.setVisible(true);
        window._czc.push(['_trackEvent', '工资单查询', '查看详情', '工资单查询_Y结算']);
    }


    selectSalary = this.props.payrollSelectStore.selectSalary;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;

    render() {
        const { view, handleFormValuesChange, handleFormReset, selectSalary, resetPageCurrent, setPagination, onSelectChange, line, setVisible, destroyPayRoll } = this.props.payrollSelectStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum, selectedRowKeys, modalLoading, DetailsVisible } = view;
        const { companyList, laborList } = this.props.globalStore;

        const columnsMap = [
            ['BillBatchId', '月薪账单', (text) => text === 0 ? '' : text, 100],
            ['Month', '月份', tableDateMonthRender, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['RealName', '姓名', undefined, 100],
            ['IdCardNum', '身份证号码', undefined, 160],
            ['WorkCardNo', '工号', undefined, 100],
            ['Details', '详情', (text) => <a className="details" onClick={() => this.setDetails(text)}>{text}</a>, 200],
            ['AuditSts', '审核状态', (value) => ({ 1: '未审核', 2: '审核通过', 3: '审核不通过' }[value]), 90],
            ['AuditRemark', '审核备注'],
            ['AuditName', '审核人', undefined, 100],
            ['AuditTm', '审核时间', tableDateTimeRender, 150],
            ['IsValid', '作废状态', (value) => ({ 1: '未作废', 2: '已作废' }[value]), 80]
        ];
        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <div className='mb-16'>
                    <Button onClick={() => { line(2); window._czc.push(['_trackEvent', '工资单查询', '审核通过', '工资单查询_Y结算']); }} type="primary" >审核通过</Button>
                    <Button onClick={this.setModal} className="ml-8" type="primary" >审核不通过</Button>
                    <Button onClick={() => { destroyPayRoll(); window._czc.push(['_trackEvent', '工资单查询', '作废', '工资单查询_Y结算']); }} className="ml-8" type="primary" >作废</Button>
                </div>

                <SearchForm
                    {...{
                        searchValue,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: selectSalary,
                        resetPageCurrent,
                        laborList,
                        companyList
                    }}
                />

                <Table
                    rowKey={'PayrollId'}
                    bordered={true}
                    dataSource={RecordList.slice()}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectChange
                    }}

                    loading={FormListStatus === "pending"}
                    columns={columns}
                    scroll={{ x: width, y: 550 }}
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSize: pagination.pageSize,
                        current: pagination.current,
                        total: totalNum,
                        size: 'small',
                        pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
                        showTotal: (total, range) => (`第${range[0]}-${range[1]}条 共${total}条`),
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        },
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        }
                    }}
                />

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

