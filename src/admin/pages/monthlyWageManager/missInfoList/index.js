import { tabWrap } from 'ADMIN_PAGES';
import { Button, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import SearchForm from './searchForm';
import AddId from './addId';
import AddBank from './addBank';
import AddWork from './addWork';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableMonthTypeRender } from 'ADMIN_UTILS/tableItemRender';
@tabWrap({
    tabName: '应发未发列表',
    stores: ['missInfoListStore']
})

@inject('missInfoListStore', 'globalStore')

@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/monthlyWageManager/missInfo']);
        if (!this.props.missInfoListStore.view.isDirty) {
            this.NotPaySelect();
            this.getAllCompanyInfo();
            this.getBankList();
        }
    }

    NotPaySelect = this.props.missInfoListStore.NotPaySelect;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;
    getBankList = this.props.globalStore.getBankList;

    // 添加身份证
    addIdCard = (record) => {
        this.props.missInfoListStore.getVisible(record);
    }

    // 添加银行卡
    addBankCard = (record) => {
        this.props.missInfoListStore.getBankCardVisible(record);
    }

    // 添加工牌
    addWorkCard = (record) => {
        this.props.missInfoListStore.getWorkCardVisible(record);
    }

    //  跳转至补发页面
    jumpToReissue = (record) => {
        let year = record.BeginDt.substr(0, 4) * 1;
        let month = record.BeginDt.substr(5, 2) * 1;
        let day = record.BeginDt.substr(8) * 1;
        let date = "";
        console.log(day, month, year);
        if (day >= 16) {
            if (month <= 8) {
                month = "0" + (month + 1).toString();
                date = year.toString() + "-" + month;
            } else if (month === 12) {
                date = (year + 1).toString() + "-" + "01";
            } else {
                date = year.toString() + "-" + (month + 1).toString();
            }
        } else {
            if (month <= 9) {
                month = "0" + month.toString();
                date = year.toString() + "-" + month;
            } else {
                date = year.toString() + "-" + month.toString();
            }
        }
        const { history } = this.props;
        window._czc.push(['_trackEvent', '应发未发列表', '补发', '应发未发列表_Y结算']);
        let params = {
            UserName: record.RealName,
            IDCardNum: record.IdCardNum,
            EmployeeNo: record.WorkCardNo,
            Remark: record.Remark,
            SalaryType: record.SalaryTyp,
            Month: date,
            Amount: null,
            EnterpriseID: record.EntId,
            LaborID: record.TrgtSpId,
            WorkState: record.WorkSts,
            EntryDate: record.EntryDt,
            LeaveDate: record.LeaveDt
        };
        console.log("params:", params);
        //  通过push携带state存在bug，必须发薪tab页存在时才有效，可能是封装的框架组件造成的
        sessionStorage.setItem('TEMP_JUMP_PARAMS', JSON.stringify(params));
        history.push('/monthlyWageManager/reissue');
    }

    render() {
        const { view, handleFormValuesChange, handleFormReset, NotPaySelect, resetPageCurrent, setPagination, getVisible, AddOneIdCardRecord,
            IdCardReset, IdCardValueChange, getBankCardVisible, AddOneBankCardRecord, BankCardReset, BankCardValueChange, AddOneWorkCardRecord,
            WorkCardReset, WorkCardValueChange, getWorkCardVisible, NotPayExport } = this.props.missInfoListStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum, IdCardInfo, IdCardvisible, BankCardInfo, BankCardvisible,
            WorkCardInfo, WorkCardvisible } = view;
        const { laborList, companyList, bankList } = this.props.globalStore;

        let columns = [
            { title: '劳务名称', dataIndex: 'TrgtSpShortName', align: 'center', width: '220px' },
            { title: '工厂名称', dataIndex: 'EntShortName', align: 'center', width: '160px' },
            { title: '月薪开始日期', dataIndex: 'BeginDt', align: 'center', width: '100px' },
            { title: '月薪结束日期', dataIndex: 'EntDt', align: 'center', width: '100px' },
            {
                title: '身份证号码', dataIndex: 'IdCardNum', align: 'center', width: '150px',
                render: (text, record, index) => text && text.substr(0, 12) + "******"
            },
            { title: '姓名', dataIndex: 'RealName', align: 'center', width: '100px' },
            { title: '工号', dataIndex: 'WorkCardNo', align: 'center', width: '100px' },
            {
                title: '薪资类型', dataIndex: 'SalaryTyp', align: 'center', width: '80px',
                render: tableMonthTypeRender
            },
            { title: '预检测结果', dataIndex: 'PreChekInfo', align: 'center', width: '150px' },
            { title: '备注', dataIndex: 'Remark', align: 'center', width: '120px' },
            { title: 'excel实发', dataIndex: 'ExcelTrgtSpMonthlyPaidSalary', align: 'center', width: '120px'},
            {
                title: '身份证状态', dataIndex: 'IdCardAuditSts', align: 'center', width: '100px',
                render: (text, record) => { return ({ 1: <a onClick={() => { this.addIdCard(record); }}>没有</a>, 2: "审核通过" }[text]); }
            },
            {
                title: '银行卡状态', dataIndex: 'BankCardAuditSts', align: 'center', width: '100px',
                render: (text, record) => { return ({ 1: <a onClick={() => { this.addBankCard(record); }}>没有</a>, 2: "审核通过" }[text]); }
            },
            {
                title: '工牌状态', dataIndex: 'WorkCardNoSts', align: 'center', width: '80px',
                render: (text, record) => { return ({ 1: <a onClick={() => { this.addWorkCard(record); }}>没有</a>, 2: "审核通过" }[text]); }
            },
            {
                title: '补发状态', dataIndex: 'ReissueSts', align: 'center', width: '100px',
                render: (text, record) => {
                    return ({
                        1: <span>未处理
                    {record.IdCardAuditSts === 2 && record.BankCardAuditSts === 2 && record.WorkCardNoSts === 2 && <a onClick={this.jumpToReissue.bind(this, record)}>补发</a>}
                        </span>,
                        2: "已补发"
                    }[text]);
                }

            },
            { title: '补发人', dataIndex: 'ReissueBy', align: 'center', width: '100px' },
            { title: '补发时间', dataIndex: 'ReissueTm', align: 'center', width: '100px', render: (text, record) => { return (record.ReissueSts === 1 ? '' : text); } }
        ];
        return (
            <div>
                <Button className="mb-20" type="primary" onClick={()=>{NotPayExport();window._czc.push(['_trackEvent', '应发未发列表', '导出', '应发未发列表_Y结算']);}}>导出</Button>
                <SearchForm
                    {...{
                        searchValue,
                        laborList,
                        companyList,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: NotPaySelect,
                        resetPageCurrent
                    }}
                />
                <Table
                    rowKey={'RecordId'}
                    bordered={true}
                    dataSource={RecordList.slice()}
                    loading={FormListStatus === "pending"}
                    columns={columns}
                    scroll={{ x: 1850, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        defaultCurrent: 1,
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
                <AddId
                    {...{
                        IdCardInfo,
                        transVisible: IdCardvisible,
                        getVisible,
                        AddOneIdCardRecord,
                        handleFormReset: IdCardReset,
                        onValuesChange: IdCardValueChange
                    }}
                />
                <AddBank
                    {...{
                        bankList,
                        BankCardInfo,
                        transVisible: BankCardvisible,
                        getVisible: getBankCardVisible,
                        AddOneBankCardRecord,
                        handleFormReset: BankCardReset,
                        onValuesChange: BankCardValueChange
                    }}
                />
                <AddWork
                    {...{
                        companyList,
                        WorkCardInfo,
                        transVisible: WorkCardvisible,
                        getVisible: getWorkCardVisible,
                        AddOneWorkCardRecord,
                        handleFormReset: WorkCardReset,
                        onValuesChange: WorkCardValueChange
                    }}
                />
            </div>

        );
    }
}

