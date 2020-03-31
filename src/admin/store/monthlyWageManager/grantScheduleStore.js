import { GetMonthSalarySchedule, ExportMonthSalarySchedule } from 'ADMIN_SERVICE/ZXX_SettlementManager';
import { message } from 'antd';
import { action, observable } from 'mobx';
import moment from 'moment';
import { BaseView, BaseViewStore } from '../BaseViewStore';

export class View extends BaseView {
  @observable searchValue = {
    EntId: undefined,
    MonthSalaryPayer: -9999,
    PayDy: undefined,
    TrgtSpId: undefined,
    BeginMo: null,
    EndMo: null
  };

  @observable pagination = {
    current: 1,
    pageSize: 10
  };

  @observable tableInfo = {
    dataList: [],
    loading: false,
    total: 0
  };

  @observable BizID = '';
}

export default class extends BaseViewStore {
  @action
  handleFormValuesChange = values => {
    this.view.searchValue = values;
  };

  @action
  startQuery = async () => {
    const view = this.view;
    const {
      searchValue,
      pagination: { current, pageSize }
    } = view;
    view.tableInfo.loading = true;
    let reqParam = {
      EntId: searchValue.EntId ? searchValue.EntId : -9999,
      MonthSalaryPayer: searchValue.MonthSalaryPayer ? searchValue.MonthSalaryPayer : -9999,
      PayDy: searchValue.PayDy ? searchValue.PayDy : -9999,
      TrgtSpId: searchValue.TrgtSpId ? searchValue.TrgtSpId : -9999,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize,
      BeginMo: searchValue.BeginMo ? searchValue.BeginMo.format('YYYY-MM-DD').substring(0, 8) + '01' : '',
      EndMo: searchValue.EndMo ? searchValue.EndMo.format('YYYY-MM-DD').substring(0, 8) + '01' : ''
    };
    try {
      let resData = await GetMonthSalarySchedule(reqParam);
      view.tableInfo = {
        dataList: resData.Data.RecordList || [],
        loading: false,
        total: resData.Data.RecordCount
      };
    } catch (err) {
      view.tableInfo.loading = false;
      message.error(err.message);
      console.log(err);
    }
  };

  //  设置分页
  @action
  setPagination = (current, pageSize) => {
    let view = this.view;
    view.pagination = {
      current,
      pageSize
    };
    this.startQuery();
  };

  @action
  resetPageCurrent = () => {
    let view = this.view;
    view.pagination = {
      ...view.pagination,
      current: 1
    };
  };

  @action
  exportMonthSalarySchedule = async () => {
    const view = this.view;
    const { searchValue } = view;

    let reqParam = {
      EntId: searchValue.EntId ? searchValue.EntId : -9999,
      MonthSalaryPayer: searchValue.MonthSalaryPayer ? searchValue.MonthSalaryPayer : -9999,
      PayDy: searchValue.PayDy ? searchValue.PayDy : -9999,
      TrgtSpId: searchValue.TrgtSpId ? searchValue.TrgtSpId : -9999,
      BeginMo: searchValue.BeginMo ? searchValue.BeginMo.format('YYYY-MM-DD').substring(0, 8) + '01' : '',
      EndMo: searchValue.EndMo ? searchValue.EndMo.format('YYYY-MM-DD').substring(0, 8) + '01' : ''
    };
    try {
      let resData = await ExportMonthSalarySchedule(reqParam);
      if (resData.Data) {
        window.open(resData.Data);
      }
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };
}
