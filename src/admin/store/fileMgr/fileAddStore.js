import { observable, action } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";

export class View extends BaseView {
    @observable formValue = {
        BeginDate: undefined,
        EndDate: undefined,
        EnterID: undefined,
        FileList1: [],
        FileList2: [],
        FileType: 1,
        LaborID: undefined,
        Remark: ''
    }
}

export default class extends BaseViewStore {
    @action
    setStoreFile = (id, list) => {
        this.view.formValue = {
            ...this.view.formValue,
            [id]: [...list]
        };
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.formValue = values;
    }

    @action
    resetForm = () => {
        this.view.resetProperty('formValue');
    }
}