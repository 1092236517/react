import {observable, action, toJS} from "mobx";
import {BaseView, BaseViewStore} from "../BaseViewStore";
import {message} from 'antd';
import {zxxaLoadRoleList, authLoadRoleUser, authCreateUser, authUpdateUser} from 'ADMIN_SERVICE/ZXX_Authority';

export class View extends BaseView {
    @observable searchValue = {Mobile: '', CnName: ''};
    @observable billList = [];
    @observable total = 0;
    @observable paging = {
        RecordIndex: 1,
        RecordSize: 10
    };
    @observable cityModelValue = {
            RIDs: [],
            Mobile: '',
            CnName: '',
            EnName: '',
            Nickname: '',
            IsValide: true,
            Department: 1
    }
    @observable cityModelName = {
            UID: '',
            addModel: false,
            addModelName: "新增用户信息"
    };
    @observable roleList = [];
    @observable getBillListStatus = false;
    @observable CityMgmtID = null;
}

export default class extends BaseViewStore {

    @action
    getBillList = async (fieldValues) => {
        if(!fieldValues) {
            this.view.paging = {
                RecordIndex: 1,
                RecordSize: 10
            };
        }
        let view = this.view;
        let QueryParams = [];

        if(view.searchValue.Mobile.trim() !== '') {
            QueryParams.push({Key: "Mobile", Value: view.searchValue.Mobile.trim()});
        }
        if(view.searchValue.CnName.trim() !== '') {
            QueryParams.push({Key: "CnName", Value: view.searchValue.CnName.trim()});
        }
        let query = {...{}, ...{QueryParams}, ...(toJS(view.paging))};
        view.billList = [];
        query.RecordIndex = (query.RecordIndex - 1) * query.RecordSize;
        view.getBillListStatus = true;
        try {
            let res = await authLoadRoleUser({...query});
            view.getBillListStatus = false;
            view.billList = res.Data.Users || [];
            view.total = res.Data.Count;
            return res.Data;
        } catch (error) {
            view.getBillListStatus = false;
            message.error(error.message);
        }
    };

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    };

    @action
    handleAddValuesChange = (values) =>{
        this.view.cityModelValue = values;
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    };

    @action
    savePage = (values) =>{
        this.view.paging = {
            RecordIndex: values.page,
            RecordSize: values.pageSize
        };
    }

    @action
    showAddModel = (values) =>{
        this.view.cityModelName = {
            UID: '',
            addModel: true,
            addModelName: "新增用户信息"
        };
        this.view.cityModelValue = {
            RIDs: [],
            Mobile: '',
            CnName: '',
            EnName: '',
            Nickname: '',
            IsValide: true,
            Department: 1
        };
    }

    @action
    hiddenAddModel = () =>{
        this.view.cityModelName = {
            UID: '',
            addModel: false,
            addModelName: "新增用户信息"
        };
        this.view.cityModelValue = {
            RIDs: [],
            Mobile: '',
            CnName: '',
            EnName: '',
            Nickname: '',
            IsValide: true,
            Department: 1
        };
        this.view.AreaShortName = null;
    }

    @action
    saveAddModeValue = async() =>{
        let view = this.view;
        let query = {};
        if(view.cityModelName.UID) {
            query = {...{}, ...(toJS(view.cityModelValue))};
            query.UID = view.cityModelName.UID;
            query.RIDs = query.RIDs.map(Number);
            query.IsValide = query.IsValide == true ? 1 : 0;
             try {
                    let res = await authUpdateUser({...query});
                    this.getBillList();
                    this.view.cityModelName = {
                        UID: '',
                        addModel: false,
                        addModelName: "新增用户信息"
                    };
                    this.view.cityModelValue = {
                        RIDs: [],
                        Mobile: '',
                        CnName: '',
                        EnName: '',
                        Nickname: '',
                        IsValide: true,
                        Department: 1
                    };
                    return res.Data;
                } catch (error) {
                    view.getBillListStatus = false;
                    message.error(error.message);
                    console.info(error);
                }
        }else{
            query = {...{}, ...(toJS(view.cityModelValue))};
            query.IsValide = query.IsValide == true ? 1 : 0;
            query.RIDs = query.RIDs.map(Number);
                delete query["UID"];
                try {
                    let res = await authCreateUser({...query});
                    this.getBillList();
                    this.view.cityModelName = {
                        UID: '',
                        addModel: false,
                        addModelName: "新增用户信息"
                    };
                    this.view.cityModelValue = {
                        RIDs: [],
                        Mobile: '',
                        CnName: '',
                        EnName: '',
                        Nickname: '',
                        IsValide: true,
                        Department: 1
                    };
                    return res.Data;
                } catch (error) {
                    view.getBillListStatus = false;
                    message.error(error.message);
                    console.info(error);
                }
        }
    }

    @action
    editAddModeValue = (Id) =>{
        let view = this.view;
        view.billList.map((item) => {
            if(item.UID == Id) {
               this.view.cityModelName = {
                    UID: Id,
                    addModel: true,
                    addModelName: "编辑用户信息"
               };
               let RIDs = [];
               item.Roles.map((item)=>{
                   RIDs.push(item.RID + '');
               });
               this.view.cityModelValue = {
                    RIDs: RIDs,
                    Mobile: item.Mobile,
                    CnName: item.CnName,
                    EnName: item.EnName,
                    Nickname: item.Nickname,
                    IsValide: item.IsValide == 1 ? true : false,
                    Department: 1
               };
               RIDs = [];
            }
        });
    };

    // 得到角色列表
    @action
    getRoleList = async() =>{
        let view = this.view;
        let res = await zxxaLoadRoleList({Departments: []});
        let RoleList = [];
        res.Data.RoleList.map((item) =>{
           RoleList.push({label: item.Name, value: item.RID + '', key: item.RID});
        });
        this.view.roleList = RoleList;
    }
}