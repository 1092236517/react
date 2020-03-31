import { observable, action, toJS } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message } from 'antd';
import moment from 'moment';
import { importClock, getClockList, repairClock, getMaxReissueCount, setMaxReissueCount, getEntByWorkCard, reissueClock } from 'ADMIN_SERVICE/ZXX_Clock';

export class View extends BaseView {
    @observable searchValue = {
        ClockStartDt: moment().subtract(14, 'days'),
        ClockEndDt: moment(),
        EntID: undefined,
        IDCardNum: '',
        IsRepaired: -9999,
        IsWeekly: -9999,
        Mobile: '',
        RealName: '',
        SrceSpId: undefined,
        TrgtSpId: undefined,
        WorkCardNo: ''
    };
    @observable page = {
        RecordIndex: 1,
        RecordSize: 10
    };
    @observable RecordCount = 0;
    // 打卡记录列表
    @observable dataSource = [];
    @observable recordDataSource = {
        EntID: '',
        IDCardNum: '',
        InterviewDt: null,
        Remark: '',
        RepairTm: null,
        RepairType: '',
        SrceSpID: '',
        TrgtSpID: '',
        WorkCardNo: ''
    }
    @observable loading = false;
    @observable importVisible = false;
    @observable addVisible = false;
    @observable detailsVisible = false;
    @observable modalLoading = false;
    @observable modalCountConfigVisible = false;
    @observable maxReissueCount = {};
    @observable modalReissuteClockVisible = false;
    @observable entByWorkCard = [];
}

export default class extends BaseViewStore {
    @action
    getList = async (param) => {
        this.view.loading = true;
        param ? (this.view.page = param) : (this.view.page = { RecordIndex: 1, RecordSize: this.view.page.RecordSize });
        let page = { RecordIndex: (this.view.page.RecordIndex - 1) * this.view.page.RecordSize, RecordSize: this.view.page.RecordSize };
        const searchValue = { ...{}, ...this.view.searchValue };
        for (let key in searchValue) {
            if (key === 'ClockStartDt' || key === 'ClockEndDt') {
                searchValue[key] && (searchValue[key] = searchValue[key].format('YYYY-MM-DD'));
            }
            !searchValue[key] && delete searchValue[key];
        }
        try {
            const res = await getClockList({ ...searchValue, ...page });
            this.view.dataSource = res.Data.RecordList || [];
            this.view.RecordCount = res.Data.RecordCount;
        } catch (err) {
            message.error(err.Desc);
            this.view.dataSource = [];
            this.view.RecordCount = 0;
            this.view.page = {
                RecordIndex: 0,
                RecordSize: 10
            };
        }
        this.view.loading = false;
    }

    // 保存补打卡
    @action
    handleSave = async (values, callback) => {
        this.view.modalLoading = true;
        try {
            await repairClock(values);
            callback();
            message.success('补打卡成功');
            this.setVisible('addVisible', false);
        } catch (err) {
            message.error(err.Desc);
        }
        this.view.modalLoading = false;
    }

    // 导出
    @action
    importList = async () => {
        this.view.modalLoading = true;
        const searchValue = { ...{}, ...this.view.searchValue };
        for (let key in searchValue) {
            if (key === 'ClockStartDt' || key === 'ClockEndDt') {
                searchValue[key] && (searchValue[key] = searchValue[key].format('YYYY-MM-DD'));
            }
            !searchValue[key] && delete searchValue[key];
        }
        try {
            const res = await importClock(searchValue);
            window.open(res.Data.FileUrl);
            message.success('导出成功');
        } catch (err) {
            message.error(err.Desc || '导出失败');
        }
        this.setVisible('importVisible', false);
        this.view.modalLoading = false;
    }

    // 显示不打卡记录
    @action
    repairClockDetail = (param, flag) => {
        this.setVisible('detailsVisible', true);
        this.view.modalLoading = true;
        this.view.recordDataSource = {
            ...param,
            InterviewDt: moment(param.InterviewDt),
            RepairType: flag === 'up' ? 1 : 2,
            RepairTm: flag === 'up' ? moment(param.ClockInTm) : moment(param.ClockOutTm)
        };
        this.view.modalLoading = false;
    }

    // 设置弹窗的显示和隐藏
    @action
    setVisible = (visible, flag) => {
        this.view[visible] = flag;
        ((visible === 'detailsVisible') && !flag) && (
            this.view.recordDataSource = {
                EndID: '',
                IDCardNum: '',
                InterviewDt: null,
                Remark: '',
                RepairTm: null,
                RepairType: '',
                SrceSpID: '',
                TrgtSpID: '',
                WorkCardNo: ''
            }
        );
    }

    // 判断时否有选中的记录
    line = (visible, record) => {
        switch (visible) {
            case 'importVisible':
                if (toJS(this.view.searchValue).ClockStartDt && toJS(this.view.searchValue).ClockEndDt) {
                    this.setVisible('importVisible', true);
                } else {
                    message.warn('请选择导出时间段');
                }
                break;
            default: return;
        }
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    };

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    };

    @action
    setMaxReissueCount = async () => {
        try {
            await setMaxReissueCount(this.view.maxReissueCount);
            message.success('设置成功！');
            this.setVisible('modalCountConfigVisible', false);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getMaxReissueCount = async () => {
        try {
            let resData = await getMaxReissueCount();
            this.view.maxReissueCount = resData.Data;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    editMaxReissueCount = (values) => {
        this.view.maxReissueCount = values;
    }

    @action
    getEntByWorkCard = async (e) => {
        try {
            let reqParam = {
                WorkCardNo: e.target.value
            };
            let resData = await getEntByWorkCard(reqParam);
            this.view.entByWorkCard = resData.Data.RecordList || [];
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    reissueClock = async (values) => {
        let reqParam = {
            ...values,
            ClockInDt: values.ClockInDt.format('YYYY-MM-DD HH:mm:ss'),
            ClockOutDt: values.ClockOutDt.format('YYYY-MM-DD HH:mm:ss')
        };
        try {
            await reissueClock(reqParam);
            message.success('补卡成功！');
            this.setVisible('modalReissuteClockVisible', false);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}