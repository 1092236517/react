import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { Button } from 'antd';
import InfoModal from './infoModal';

@tabWrap({
    tabName: '企业对应劳务',
    stores: ['laborEntMapStore']
})
@inject('laborEntMapStore', 'globalStore')
@observer
class Index extends Component {
    state = {
        isShowModal: false
    }

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/basicData/memberPayAccount']);
        if (!this.props.laborEntMapStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery } = this.props.laborEntMapStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        startQuery();
    }

    addEntLaborMap = () => {
        window._czc.push(['_trackEvent', '企业对应劳务', '添加', '企业对应劳务_Y结算']);
        this.setState({
            isShowModal: true
        });
    }

    closeShowModal = () => {
        this.setState({
            isShowModal: false
        });
    }

    render() {
        const {
            laborEntMapStore: {
                view: { searchValue, tableInfo, pagination },
                startQuery,
                handleFormValuesChange,
                resetForm,
                setPagination,
                setSelectRowKeys,
                resetPageCurrent,
                modifyPayType
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;
        const { isShowModal } = this.state;
        const { addX } = resId.basicData.laborEntMap;

        return (
            <div>
                <div className='mb-16'>
                    {authority(addX)(<Button type='primary' onClick={this.addEntLaborMap}>添加</Button>)}
                </div>

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, companyList, laborList, startQuery, resetPageCurrent }} />

                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys, modifyPayType }} />

                {
                    isShowModal &&
                    <InfoModal {...{ companyList, laborList, startQuery, closeModal: this.closeShowModal }} />
                }
            </div>
        );
    }
}

export default Index;


