import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { Radio, Button } from 'antd';
import ResTable from './resTable';
import SearchForm from './searchForm';
import InfoModal from './infoModal';
import OperBtn from './operBtn';
import AddAndModifyInfo from './addAndModifyInfo';
import FilterCondit from './filterCondit';
import ConFIlterTable from './conFIlterTable';
@tabWrap({
    tabName: '公告推送管理',
    stores: ['pushManagementStore']
})
@inject('pushManagementStore', 'globalStore', 'fileAddStore')
@observer
class WeeklyWageBill extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/system/pushmant']);
        if (!this.props.pushManagementStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery } = this.props.pushManagementStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        startQuery();
    }
    onChange = e => {
        this.props.pushManagementStore.receiveMemberTypeOpt(e.target.value);
    };
    render() {
        const {
            addNoticeOpt,
            toMainPage,
            receiveMemberOpt,
            startQuery,
            resetPageCurrent,
            handleFormValuesChange,
            handleInfoFormValuesChange,
            handleFormFilterValuesChange,
            setSelectRowKeys,
            setPagination,
            resetForm,
            showAuditModal,
            closeMemberModal,
            receiveMembertModal,
            modifyNoticeOpt,
            receiveMemberTypeOpt,
            setPaginationForMember,
            saveImage,
            setImportFile,
            saveImportContent,
            startQueryFilterTable,
            backToEditPage,
            resetMemberForm,
            view: {
                tableInfo, pagination, searchValue, receiveMemberVisible, pageStepOpt, memberInfo, paginationForMember, infoBean, radioButtonBean, ImageUrl, importFile, filterSearchValue
            }
        } = this.props.pushManagementStore;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { view: { formValue }, setStoreFile } = this.props.fileAddStore;
        const { mainPage, addPage, receiveMemberImport, receiveMemberFilter, receiveMemberAll } = pageStepOpt;
        return (
            <div>
                {mainPage && <div>
                    <OperBtn {...{ addNoticeOpt, startQuery }} />
                    <SearchForm {...{ searchValue, handleFormValuesChange, resetPageCurrent, startQuery, resetForm, agentList, companyList, laborList }} />
                    <ResTable {...{ setSelectRowKeys, pagination, tableInfo, startQuery, setPagination, receiveMembertModal, modifyNoticeOpt }} />
                    {
                        receiveMemberVisible &&
                        <InfoModal {...{ memberInfo, closeMemberModal, paginationForMember, setPaginationForMember }} />
                    }
                </div>}

                {addPage && <div>
                    <AddAndModifyInfo {...{ saveImage, toMainPage, receiveMemberOpt, setStoreFile, formValue, startQuery, handleInfoFormValuesChange, editMode: false, resetForm, infoBean, radioButtonBean, ImageUrl }} />
                </div>}

                {receiveMemberImport && <div>
                    <FilterCondit {...{ paginationForMember, memberInfo, radioButtonBean, backToEditPage, startQuery, importFile, setImportFile, saveImportContent, setPagination, showAuditModal, companyList, laborList, setStoreFile, formValue, handleFormValuesChange, resetForm, infoBean, receiveMemberTypeOpt, setSelectRowKeys }} />
                </div>}
                {receiveMemberFilter && <div>
                    <ConFIlterTable {...{ memberInfo, paginationForMember, radioButtonBean, backToEditPage, saveImportContent, startQueryFilterTable, infoBean, receiveMemberTypeOpt, handleFormFilterValuesChange, resetPageCurrent, startQuery, resetMemberForm, agentList, companyList, laborList, filterSearchValue, setPaginationForMember, setSelectRowKeys }}></ConFIlterTable>
                </div>}
                {receiveMemberAll && <div>
                    <div className='optItemGroup'>
                        <div className='optItem'>
                            <Radio.Group onChange={this.onChange} value={radioButtonBean.Typ}>
                                <Radio value={1}>表格导入</Radio>
                                <Radio value={2}>条件筛选</Radio>
                                <Radio value={3}>全部在职会员</Radio>
                            </Radio.Group>
                        </div>
                        <div className='optItem'> <Button onClick={backToEditPage}>返回</Button><Button type="primary" onClick={saveImportContent}>提交</Button></div>
                    </div>
                </div>}
            </div>
        );
    }
}

export default WeeklyWageBill;