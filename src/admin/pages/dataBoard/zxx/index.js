import React from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import 'ADMIN_ASSETS/less/pages/dataBoard.less';
import ResTable from './resTable';
import SearchForm from './searchForm';
import ResChart from './resChart';
import Tip from './tip';

@tabWrap({
    tabName: '周薪统计',
    stores: ['dataBoardZXXStore']
})
@inject('dataBoardZXXStore')
@observer
export default class extends React.Component {
    componentDidMount() {
        this.startQuery();
    }

    componentDidMount() {
        window._czc.push(['_trackPageview', location.pathname, window.location.href]);
        const { dataBoardZXXStore } = this.props;
        if (!dataBoardZXXStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { startQuery } = this.props.dataBoardZXXStore;
        startQuery();
    }

    render() {
        const {
            view: {
                searchValue,
                chartData,
                showMode,
                originTableData,
                tableSourceType,
                tableLoading
            },
            handleFormValuesChange,
            startQuery,
            changeShowMode,
            changeDataSource,
            exportRec
        } = this.props.dataBoardZXXStore;

        return (
            <div className='databoard-wrapper'>
                <SearchForm {...{ searchValue, handleFormValuesChange, startQuery }} />

                <Tip {...{ changeShowMode, showMode, exportRec }} />

                {
                    showMode == 'chart' &&
                    <ResChart chartData={chartData.slice()} CycleTyp={searchValue.CycleTyp} />
                }

                {
                    showMode == 'table' &&
                    <ResTable {...{ originTableData, changeDataSource, tableSourceType, tableLoading }} />
                }
            </div>
        );
    }
}