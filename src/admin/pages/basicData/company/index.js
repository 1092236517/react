import React, {Fragment} from 'react';
import {tabWrap} from 'ADMIN_PAGES';
import {observer, inject} from "mobx-react";
import {toJS} from "mobx";
import {Modal, Table, Button} from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import SearchForm from './searchForm';
import history from 'ADMIN_ROUTES/history';

@tabWrap({
    tabName: '企业基础数据',
    stores: ['companyStore']
})
@inject('companyStore', 'companyEditStore', 'globalStore')
@observer
class StandardEnt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }
    companyQueryInfoLisit = this.props.companyStore.companyQueryInfoLisit;
    handleTabRowClick = this.props.companyStore.handleTabRowClick;
    formRef = React.createRef();

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/basicData/company']);
        if (!this.props.companyStore.view.isDirty) {
            this.companyQueryInfoLisit();
        }
        this.props.globalStore.getAllCompanyInfo();
    }

    handleTableRow = {
        onRow: record => ({
            // 点击表格行
            onClick: event => {
                if (event.target.name === 'edit') {
                    this.props.companyEditStore.record = record;
                    window._czc.push(['_trackEvent', '企业基础数据', '单条数据修改', '企业基础数据_N非结算']);
                    history.push(`/basicData/company/edit/${record.EntId}`);
                }
            },
            // 鼠标移入行
            onMouseEnter: event => {
            }
        }),

        onHeaderRow: column => ({
            // 点击表头行
            onClick: () => {
            }
        })
    };

    handleSync = () => {
        window._czc.push(['_trackEvent', '企业基础数据', '同步', '企业基础数据_N非结算']);
        this.props.companyStore.syncCompanyInfo();
        this.setState({visible: false});
    };

    setVisible = (flag) => {
        this.setState({visible: flag});
    }


    handleFormReset = () => {
        this.formRef.current.resetFields();
        this.props.companyStore.resetViewProperty('formValue');
        this.formRef.current.setFieldsValue(toJS(this.props.companyStore.view.formValue));
    };

    columns = [ // 如果表格固定，不需要改变，例如表头筛选可以写在this(好处是只需要计算一遍tableWidth)，否则需要写在render前
        {title: '企业全称', dataIndex: 'EntFullName', width: 220, align: 'center'},
        {title: '企业简称', dataIndex: 'EntShortName', width: 180, align: 'center'},
        {title: '联系人', dataIndex: 'CtctName', width: 100, align: 'center'},
        {title: '电话', dataIndex: 'CtctMobile', width: 120, align: 'center', render: (text, record, index) => text && text.replace(text.slice(3, 7), '****')},
        {
            title: '发薪周期', dataIndex: 'SettleBegin', width: 100, align: 'center',
            render: (text, record) => `${record.SettleBeginDy}-${record.SettleEndDy}`
        },
        {title: '发薪日', dataIndex: 'PayDy', width: 80, align: 'center'},
        {title: '白名单', dataIndex: 'WhiteLocationNum', width: 80, align: 'center'},
        {title: '操作时间', dataIndex: 'CreateTmStr', width: 150, align: 'center'},
        {title: '操作人', dataIndex: 'CreateBy', width: 100, align: 'center'},
        {
            title: '编辑', dataIndex: 'xxx', width: 100, align: 'center',
            render: (text, record) => authority(resId.baseCompanyList.edit)(<a name="edit">修改</a>)
        }
    ];

    tableWidth = this.columns.reduce((pre, cur) => pre + cur.width, 0);

    render() {
        const {view, handleTableChange} = this.props.companyStore;
        const {companyList} = this.props.globalStore;
        const {formValue, pagination, tableRecordList, tableLoading} = view;
        return (
            <Fragment>
                {authority(resId.baseCompanyList.sync)(<Button style={{marginBottom: 10}} type="primary" onClick={() => this.setVisible(true)}>同步</Button>)}
                <SearchForm
                    ref={this.formRef}
                    formValue={formValue}
                    companyList={companyList}
                    handleSubmit={this.companyQueryInfoLisit}
                    handleFormReset={this.handleFormReset}
                />
                <Table
                    rowKey='EntId' bordered={true} scroll={{x: this.tableWidth, y: 550}}
                    {...this.handleTableRow}
                    pagination={{
                        ...pagination,
                        pageSizeOptions: ['10', '20', '30', '50', '100', '200']
                    }}
                    dataSource={tableRecordList.toJS()}
                    loading={tableLoading}
                    onChange={handleTableChange}
                    columns={this.columns}/>
                <Modal
                    title="同步确认"
                    visible={this.state.visible}
                    onCancel={() => this.setVisible(false)}
                    onOk={this.handleSync}
                >
                    是否同步？
                </Modal>
            </Fragment>
        );
    }
}

export default StandardEnt;