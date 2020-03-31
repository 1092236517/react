import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import InfoModal from './infoModal';

@tabWrap({
    tabName: '劳务押金关系表',
    stores: ['laborDepoMapStore']
})
@inject('laborDepoMapStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/basicData/laborDepoMap']);
        if (!this.props.laborDepoMapStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery, view: { bossList }, getBossList } = this.props.laborDepoMapStore;

        !hasAllCompanyInfo && getAllCompanyInfo();
        bossList.length == 0 && getBossList();
        startQuery();
    }

    render() {
        const {
            laborDepoMapStore: {
                view: { searchValue, tableInfo, pagination, bossList, infoModal },
                startQuery,
                handleFormValuesChange,
                resetForm,
                setPagination,
                resetPageCurrent,
                setInfoModalShow,
                addLaborDepoMap,
                editRecord,
                deleteRecord
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        return (
            <div>
                <OperBtn setInfoModalShow={setInfoModalShow.bind(this, true)} />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, companyList, laborList, startQuery, resetPageCurrent, bossList }} />

                <ResTable {...{ tableInfo, pagination, setPagination, editRecord, deleteRecord }} />

                {infoModal.show ? <InfoModal {...{ infoModal, companyList, laborList, bossList, addLaborDepoMap, setInfoModalShow: setInfoModalShow.bind(this, false) }} /> : null}
            </div>
        );
    }
}

export default Index;


