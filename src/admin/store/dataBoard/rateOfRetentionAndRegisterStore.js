import { observable, action } from 'mobx';
import { message } from 'antd';
import { BaseView, BaseViewStore } from '../BaseViewStore';
import moment from 'moment';
import { interviewerRetentionRate } from 'ADMIN_SERVICE/ZXX_KanBan';

export class View extends BaseView {
    @observable searchValue = {
        TrgtSpId: undefined,
        EntId: undefined,
        Days: undefined,
        BeginDt: undefined,
        EndDt: undefined
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0
    }
}

export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: {
                BeginDt, EndDt, TrgtSpId, Days, EntId
            }
        } = view;

        let reqParam = {
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            TrgtSpId: TrgtSpId || -9999,
            EntId: EntId || -9999,
            Days: Days.slice().map(Number)
        };

        try {
            view.tableInfo.Loading = true;
            let resData = await interviewerRetentionRate(reqParam);
            const { Data: { RecordCount, RecordList, TolEntryNumber, TolInterviewerPassNumber, TolRegistrationRate, TolRetentionRateList } } = resData;
            
            RecordList.push({
                EntryNumber: TolEntryNumber,
                InterviewerPassNumber: TolInterviewerPassNumber,
                RegistrationRate: TolRegistrationRate,
                RetentionRateList: TolRetentionRateList
            });

            let dataList = (RecordList || []).map((rowData) => ({
                ...rowData,
                ...reqParam.Days.reduce((prev, curr, index) => {
                    prev['RetentionRate' + curr] = rowData.RetentionRateList[index];
                    return prev;
                }, {})
            }));



            view.tableInfo = {
                dataList,
                total: RecordCount
            };

        } catch (err) {
            message.error(err.message);
            console.log(err);
        } finally {
            view.tableInfo.Loading = false;
        }
    }

    @action
    handleFormValuesChange = (changedValues, values) => {
        const view = this.view;
        if (changedValues.Days) {
            values = {
                ...values,
                Days: values.Days.slice(0, 7).map(Number).sort((a, b) => (a - b))
            };
        }
        view.searchValue = values;
    }

    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
}
