import React from 'react';
import {message} from 'antd';
import {observable, action} from "mobx";
import {BaseView, BaseViewStore} from "../BaseViewStore";
import {editCompanyInfo} from 'ADMIN_SERVICE/ZXX_BaseData';

export class View extends BaseView {
    @observable EntId = 0;
    @observable EntFullName = '';
    @observable edit = false;
    @observable Location = [];
    @observable EntShortName = '';
    @observable CtctName = '';
    @observable CtctMobile = '';
    @observable SettleBeginDy = 0;
    @observable SettleEndDy = 0;
    @observable PayDy = 0;
    @observable disableEditSettleDy = false;

    @observable SettleBeginDyError = '';
    @observable PayDyError = '';
    @observable LocationError = '';
}

export default class extends BaseViewStore {

    @action
    setRecord() {
        let view = this.view;
        let record = this.record;
        view.EntId = record.EntId;
        view.EntFullName = record.EntFullName || '';
        view.EntShortName = record.EntShortName || '';
        view.CtctName = record.CtctName || '';
        view.CtctMobile = record.CtctMobile || '';
        view.SettleBeginDy = record.SettleBeginDy;
        view.SettleEndDy = record.SettleEndDy;
        view.PayDy = record.PayDy;
        view.Location = record.Location || [];
        if (record.SettleBeginDy || record.SettleEndDy) {
            view.disableEditSettleDy = true;
        }
        this.record = null;
    }

    @action.bound
    setPoi(poi) {
        let longlat = poi.longlat.split(',');
        this.view.Location.push({
            ClockRange: poi.clockRadius,
            Longitude: longlat[0],
            Latitude: longlat[1]
        });
    }

    @action
    editCompanyInfo = async (param, callback) => {
        this.view.edit = true;
        try {
            let res = await editCompanyInfo(param);
            message.success(res.Desc);
            callback && callback(res);
        } catch (e) {
            message.error(e.message);
            this.view.edit = false;
        }
    };

    @action
    handleDateInputBlur = (name, value) => {
        if (value) {
            let v = parseInt(value, 10);
            if (isNaN(v) || v < 1 || v > 31) {
                this.view[name + 'Error'] = {
                    validateStatus: "error",
                    help: "请输入1-31数字"
                };
            } else {
                if (v < 10) {
                    this.view[name] = '0' + v;
                }
                if (name === 'SettleBeginDy') {
                    this.view.SettleEndDy = v === 1 ? 30 : v < 11 ? '0' + (v - 1) : v - 1;

                }
                this.view[name + 'Error'] = '';
            }
        }
    };
}