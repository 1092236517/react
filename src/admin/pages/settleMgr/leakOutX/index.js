import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { Button, Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { tableDateMonthRender } from 'ADMIN_UTILS/tableItemRender';
import ModifyModal from './ModifyModal';
import SearchForm from './searchForm';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
@tabWrap({
    tabName: 'X查漏-X项',
    stores: ['leakOutXStore']
})

@inject('leakOutXStore', 'globalStore')

@observer
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            record: {

            }
        };
    }
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/settleMgr/leakOutX']);
        if (!this.props.leakOutXStore.view.isDirty) {
            this.getStatics();
            this.getAllCompanyInfo();
        }
    }
    getStatics = this.props.leakOutXStore.getStatics;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;

    // 导出
    export = () => {
        let Data = this.props.leakOutXStore.exportStatics();
        Data.then((res) => {
            window.open(res.FileUrl);
        });
        window._czc.push(['_trackEvent', 'X查漏-X项', '导出', 'X查漏-X项_Y结算']);
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
    modifyLack = (record, type, XType) => {
        const { EnterpriseName, LaborName, RecordID, Remark, Month } = record;
        this.ModalShow();
        this.setState({
            record: {
                XType: XType,
                type: type,
                EnterpriseName: EnterpriseName,
                LaborName: LaborName,
                RecordID: RecordID,
                Remark: Remark,
                Month: Month
            }
        }, () => {
            console.log(this.state.record);
        });
    }

    render() {
        const { view, handleFormValuesChange, handleFormReset, getStatics, resetPageCurrent, setPagination, saveData } = this.props.leakOutXStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum } = view;
        const { companyList, laborList } = this.props.globalStore;

        let columns = [
            { title: '企业', dataIndex: 'EnterpriseName', align: 'center', width: '10%' },
            { title: '劳务', dataIndex: 'LaborName', align: 'center', width: '10%' },
            { title: '月份', dataIndex: 'Month', align: 'center', width: '8%', render: tableDateMonthRender },
            {
                title: 'X-工资', dataIndex: 'XSalaryState', align: 'center', width: '6%',
                render: (text, record) => ({
                    0: '/',
                    1: <span>&radic;</span>,
                    2: (authority(resId.settleMgr.leakOutX.modifyLack)(<span style={{ color: "#e84e40", cursor: "pointer" }} onClick={() => { this.modifyLack(record, 'X-工资', 1); }}>缺</span>)),
                    3: <span style={{ color: "#e84e40" }}>&radic;</span>
                }[text])
            },
            {
                title: 'X-社保', dataIndex: 'XSocialSecurityState', align: 'center', width: '7%',
                render: (text, record) => ({
                    0: '/',
                    1: <span>&radic;</span>,
                    2: (authority(resId.settleMgr.leakOutX.modifyLack)(<span style={{ color: "#e84e40", cursor: "pointer" }} onClick={() => { this.modifyLack(record, 'X-社保', 2); }}>缺</span>)),
                    3: <span style={{ color: "#e84e40" }}>&radic;</span>
                }[text])
            },
            {
                title: 'X-管理费', dataIndex: 'XManageFeeState', align: 'center', width: '7%',
                render: (text, record) => ({
                    0: '/',
                    1: <span>&radic;</span>,
                    2: (authority(resId.settleMgr.leakOutX.modifyLack)(<span style={{ color: "#e84e40", cursor: "pointer" }} onClick={() => { this.modifyLack(record, 'X-管理费', 3); }}>缺</span>)),
                    3: <span style={{ color: "#e84e40" }}>&radic;</span>
                }[text])
            },
            {
                title: 'X-招聘费', dataIndex: 'XRecruitmentFeeState', align: 'center', width: '7%',
                render: (text, record) => ({
                    0: '/',
                    1: <span>&radic;</span>,
                    2: (authority(resId.settleMgr.leakOutX.modifyLack)(<span style={{ color: "#e84e40", cursor: "pointer" }} onClick={() => { this.modifyLack(record, 'X-招聘费', 4); }}>缺</span>)),
                    3: <span style={{ color: "#e84e40" }}>&radic;</span>
                }[text])
            },
            {
                title: 'X-自离工资', dataIndex: 'XLeaveSalaryState', align: 'center', width: '7%',
                render: (text, record) => ({
                    0: '/',
                    1: <span>&radic;</span>,
                    2: (authority(resId.settleMgr.leakOutX.modifyLack)(<span style={{ color: "#e84e40", cursor: "pointer" }} onClick={() => { this.modifyLack(record, 'X-自离工资', 5); }}>缺</span>)),
                    3: <span style={{ color: "#e84e40" }}>&radic;</span>
                }[text])
            },
            {
                title: 'X-其他', dataIndex: 'XOtherState', align: 'center', width: '7%',
                render: (text, record) => ({
                    0: '/',
                    1: <span>&radic;</span>,
                    2: (authority(resId.settleMgr.leakOutX.modifyLack)(<span style={{ color: "#e84e40", cursor: "pointer" }} onClick={() => { this.modifyLack(record, 'X-其他', 6); }}>缺</span>)),
                    3: <span style={{ color: "#e84e40" }}>&radic;</span>
                }[text])
            },
            { title: '修改说明', dataIndex: 'ModifyRemark', align: 'center', width: '14%' },
            { title: '操作人', dataIndex: 'ModifyUserName' },
            {
                title: '操作时间', dataIndex: 'ModifyTime', render: (text, record) =>
                    tableDateTimeRender(text)
            }
        ];
        return (
            <div>
                {authority(resId.settleMgr.leakOutX.export)(<Button onClick={this.export} className="ml-8" type="primary" style={{ marginBottom: "20px" }}>导出</Button>)},
                <SearchForm
                    {...{
                        searchValue,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: getStatics,
                        resetPageCurrent,
                        laborList,
                        companyList
                    }}
                />
                <Table
                    rowKey={'RecordID'}
                    bordered={true}
                    dataSource={RecordList.slice()}
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
                        ModalHidden: this.ModalHidden,
                        ModalShow: this.ModalShow,
                        saveData
                    }} />
            </div>

        );
    }
}

