import React, { Component } from 'react';
import { Button } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

@tabWrap({
    tabName: '审核账单作废',
    stores: ['approvedBillVoidedStore']
})
@inject('approvedBillVoidedStore', 'globalStore')
@observer
class WeeklyWageList extends Component {

    render() {
        const {
            deleteBills,
            addCondition,
            deleteCondition,
            handleFormValuesChange,
            view: { searchValue, Condition }
        } = this.props.approvedBillVoidedStore;
        // const { agentList, companyList, laborList } = this.props.globalStore;
        const { deleteX } = resId.approvedBillVoided.deleteBill;

        return (
            <div>
                <div className='mb-16'>
                    {authority(deleteX)(<Button type='primary' onClick={() => { deleteBills(); }}>作废</Button>)}
                </div>

                <SearchForm {...{ Condition, addCondition, deleteCondition, searchValue, handleFormValuesChange}} />

            </div>
        );
    }
}

export default WeeklyWageList;
