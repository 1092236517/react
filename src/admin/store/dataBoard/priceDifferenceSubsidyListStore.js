import { GetSubsidyList, ExportSubsidyList, GetTaskResult } from 'ADMIN_SERVICE/ZXX_SettlementManager';
import { message } from 'antd';
import { action, observable } from 'mobx';
import moment from 'moment';
import { BaseView, BaseViewStore } from '../BaseViewStore';

export class View extends BaseView {
  @observable searchValue = {
    OrderBeginDt: moment(),
    OrderEndDt: moment(),
    DiffPriceIssueDt: undefined,
    IssueDayBegin: undefined,
    IssueDayEnd: undefined,
    SettlementTyp: undefined
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
      searchValue: { OrderBeginDt, OrderEndDt, DiffPriceIssueDt, IssueDayBegin, IssueDayEnd, SettlementTyp },
      pagination: { current, pageSize }
    } = view;
    view.tableInfo.loading = true;

    let reqParam = {
      OrderEndDt: OrderEndDt ? OrderEndDt.format('YYYY-MM-DD') : '',
      OrderBeginDt: OrderBeginDt ? OrderBeginDt.format('YYYY-MM-DD') : '',
      DiffPriceIssueDt: DiffPriceIssueDt ? parseInt(DiffPriceIssueDt, 10) : -9999,
      IssueDayBegin: IssueDayBegin ? IssueDayBegin.format('YYYY-MM-DD') : '',
      IssueDayEnd: IssueDayEnd ? IssueDayEnd.format('YYYY-MM-DD') : '',
      SettlementTyp: SettlementTyp ? parseInt(SettlementTyp, 10) : -9999,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    };
    try {
      let resData = await GetSubsidyList(reqParam);
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
  exportSubsidyList = async () => {
    const view = this.view;
    const {
      searchValue: { OrderBeginDt, OrderEndDt, DiffPriceIssueDt, IssueDayBegin, IssueDayEnd, SettlementTyp }
    } = view;

    let reqParam = {
      OrderEndDt: OrderEndDt ? OrderEndDt.format('YYYY-MM-DD') : '',
      OrderBeginDt: OrderBeginDt ? OrderBeginDt.format('YYYY-MM-DD') : '',
      DiffPriceIssueDt: DiffPriceIssueDt ? parseInt(DiffPriceIssueDt, 10) : -9999,
      IssueDayBegin: IssueDayBegin ? IssueDayBegin.format('YYYY-MM-DD') : '',
      IssueDayEnd: IssueDayEnd ? IssueDayEnd.format('YYYY-MM-DD') : '',
      SettlementTyp: SettlementTyp ? parseInt(SettlementTyp, 10) : -999
    };
    try {
      let resData = await ExportSubsidyList(reqParam);
      if (resData.Data.BizID) {
        view.BizID = resData.Data.BizID;
        this.getTaskResult();
      }
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };

  @action
  getTaskResult = async () => {
    const view = this.view;
    const { BizID } = view;

    let reqParam = {
      BizID
    };
    try {
      let resData = await GetTaskResult(reqParam);
      if (resData.Data.State === 0) {
        setTimeout(() => {
          this.getTaskResult();
        }, 2000);
      } else {
        window.open(resData.Data.FileUrl);
      }
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };

  // 设置弹窗的显示和隐藏
  @action
  setVisible = (visible, flag) => {
    this.view[visible] = flag;
  };
}
