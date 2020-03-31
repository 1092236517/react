import React from 'react';
import {observable, action} from "mobx";
import {message} from 'antd';
import {BaseView, BaseViewStore} from "../BaseViewStore";
import {companyQueryInfoLisit, syncCompanyInfo} from 'ADMIN_SERVICE/ZXX_BaseData';
import moment from 'moment';

export class View extends BaseView {
    @observable formValue = {
        // InfoIsCompleted: -9999
    };

    @observable pagination = {
        total: 0,
        pageSize: 10,
        current: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        size: 'small',
        showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
    };
    @observable tableRecordList = [];
    @observable tableLoading = false;
}

export default class extends BaseViewStore {

    @action.bound
    async companyQueryInfoLisit(values) {
        if (values) {
            this.view.formValue = values;
            this.view.pagination.current = 1;
        }
        const {current, pageSize} = this.view.pagination;
        let param = {
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        this.view.tableLoading = true;
        try {
            let res = await companyQueryInfoLisit({...param, ...this.obtainQueryParam(values)});
            this.view.tableRecordList = res.Data.RecordList || [];
            this.view.tableRecordList.forEach(item => {
                let tm = moment(item.CreateTm);
                item.CreateTmStr = tm._isValid ? tm.format('YYYY-MM-DD HH:mm:ss') : '';
            });
            this.view.pagination.total = res.Data.RecordCount;
        } catch (e) {
            this.view.tableRecordList = [];
            message.error(e.message);
        }
        this.view.tableLoading = false;
    }

    @action.bound
    async syncCompanyInfo() {
        try {
            let res = await syncCompanyInfo();
            message.success(res.Desc);
            this.resetViewProperty('formValue');
            this.companyQueryInfoLisit(this.view.formValue);
        } catch (e) {
            message.error(e.message);
        }
    }

    @action.bound
    handleTableChange(pagination, filters, sorter) {
        let change = {
            current: pagination.current < 1 ? 1 : pagination.current,
            pageSize: pagination.pageSize
        };
        this.view.pagination.current = change.current;
        this.view.pagination.pageSize = change.pageSize;
        this.companyQueryInfoLisit();
    }

    @action.bound
    resetViewProperty(field) {
        this.view.resetProperty(field);
    }

    // 合成查询参数
    obtainQueryParam(formValue = {}) {
        let numberQuery = ['InfoIsCompleted', 'EntId'];
        let query = Object.entries(formValue).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1];
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v || '';
            }
            return pre;
        }, {});
        if (query.Date && query.Date instanceof Array) {
            query.CreatedStartDate = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.CreatedEndDate = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
        }
        delete query.Date;
        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1]) || Number.isNaN(data[1])) delete query[data[0]];
        });
        return query;
    }

}