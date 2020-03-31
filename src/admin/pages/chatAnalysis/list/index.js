import React, { Component } from 'react';
import { Button } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import OperBtn from './operBtn';
@tabWrap({
    tabName: '聊天记录查询',
    stores: ['chatAnalysisListStore']
})
@inject('chatAnalysisListStore', 'globalStore')
@observer
class WeeklyWageList extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/chatAnalysis/list']);
        const { chatAnalysisListStore } = this.props;
        const { startQuery } = this.props.chatAnalysisListStore;
        let extraParams = sessionStorage.getItem('TEMP_JUMP_PARAMS');
        if (extraParams) {
            chatAnalysisListStore.handleFormReset();
            sessionStorage.removeItem('TEMP_JUMP_PARAMS');
            chatAnalysisListStore.startQuery(JSON.parse(extraParams));
            return;
        }
        startQuery();

    }


    render() {
        const {
            handleFormValuesChange,
            startQuery,
            resetPageCurrent,
            setPagination,
            handleFormReset,
            view: { tableInfo, searchValue, pagination },
            exportRec
        } = this.props.chatAnalysisListStore;

        return (
            <div>
                <OperBtn {...{ exportRec }} />
                <SearchForm {...{ searchValue, handleFormValuesChange, startQuery, resetPageCurrent, handleFormReset }} />
                <ResTable {...{ tableInfo, pagination, startQuery, setPagination }} />
            </div>
        );
    }
}

export default WeeklyWageList;