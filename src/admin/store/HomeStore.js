import {observable, action, autorun, toJS, computed} from "mobx";
import {BaseViewStore} from "./BaseViewStore";
import MainTab from "ADMIN/routes/mainTab";
import {message} from "antd";
import {loadResources} from 'ADMIN_SERVICE/ZXX_Authority';
import {setAuthorityList} from 'ADMIN_COMPONENTS/Authority';

export default class {

    constructor(history, store) {
        this.history = history;
        this.store = store;
    }

    @observable tabList = new Map();
    @observable tabActiveKey = '';
    @observable navOpenKeys = [];
    @observable navCollapsed = false;
    @observable MenuList = [];
    @observable MenuListObj = {};

    @observable homeRoute = new MainTab();
    @observable isLoadResource = false;

    @action.bound
    async loadResources(callback) {
        this.isLoadResource = false;
        try {
            let res = await loadResources();
            let Resource = res.Data.Resources && res.Data.Resources[0] || {};
            const {menuList, MenuListObj, funSet} = this.getResource(Resource);
            this.MenuListObj = MenuListObj;
            this.MenuList = menuList.length ? menuList[0].SubMenus || [] : [];
            setAuthorityList(funSet);
            this.setAuthorityList(Object.keys(MenuListObj));
            callback && callback();
        } catch (e) {
            message.error(e.message);
        }
        this.isLoadResource = true;
    }

    getResource(resource, menuList = [], MenuListObj = {}, funSet = new Set()) {
        if (resource.Type === 2) { // 资源
            funSet.add(resource.BtnUid);
        } else {
            const menu = {
                MID: resource.ResID,
                NavUrl: resource.NavUrl,
                ImgUrl: resource.IconUrl,
                Name: resource.Name
            };
            let sub = resource.SubResources;
            if (sub && sub.length) {
                menu.SubMenus = [];
                for (let subRes of sub) {
                    this.getResource(subRes, menu.SubMenus, MenuListObj, funSet);
                    if (sub.Type === 1) {
                        menu.hasSubMenu = true;
                    }
                }
            }
            if (resource.NavUrl && !menu.hasSubMenu) {
                if (!MenuListObj[resource.NavUrl]) MenuListObj[resource.NavUrl] = [];
                MenuListObj[resource.NavUrl].push({MID: resource.ResID, Name: resource.Name});
            }
            menuList.push(menu);
        }
        return {menuList, MenuListObj, funSet};
    }

    setAuthorityList(keys) {
        const homeRoute = new MainTab();
        for (let route of homeRoute.children) {
            let rpath = route.path;
            for (let key of keys) {
                if (rpath.search(key) >= 0) {
                    route.isAuth = true;
                    if (!homeRoute.authRoute || !homeRoute.authRoute.path) {
                        homeRoute.authRoute = {
                            path: route.path
                        };
                    }
                    break;
                }
            }
        }
        this.homeRoute = homeRoute;
    }

    @computed
    get navSelectedKeys() {
        return this.tabActiveKey && (this.MenuListObj[this.tabActiveKey] || []).map(item => item.MID.toString()) || [];
    }

    @action.bound
    tabSave(tabItem) {
        if (tabItem.tabKey) {
            let menu = this.MenuListObj[tabItem.tabKey];
            if (menu && menu.length) {
                let name = menu[0].Name;
                if (name) tabItem.tabName = name;
            }
            this.switchTabStoreView(tabItem);
            this.tabList.set(tabItem.tabKey, tabItem);
            this.tabActiveKey = tabItem.tabKey;
        }
    };

    @action
    handleTabEdit = (targetKey, action) => {
        if (action === 'remove') {
            if (targetKey) {
                if (this.tabActiveKey === targetKey) { // 关闭当前
                    let prePath;
                    let preClosePath = Object.keys(this.homeRoute.onLastClose || '').find(item => this.tabActiveKey.match(item));
                    if (preClosePath) prePath = this.homeRoute.onLastClose[preClosePath];
                    if (!prePath) {
                        let length = this.tabList.size;
                        if (length > 1) {
                            prePath = [...this.tabList.keys()].filter(item => item !== targetKey)[length - 2];
                        }
                    }
                    if (!prePath) {
                        prePath = this.homeRoute.indexPage && this.homeRoute.indexPage.path;
                    }
                    if (prePath && prePath !== targetKey) {
                        this.tabList.set(targetKey, {...this.tabList.get(targetKey), preClose: true});
                        this.history.push(prePath);
                        this.tabActiveKey = prePath;
                    }
                } else { // 关闭其它
                    this.onTabCloseChange(targetKey);
                }
            }
        }
    };

    @action
    tabOut = (tabKey) => {
        let tabItem = this.tabList.get(tabKey);
        if (tabItem && tabItem.preClose) this.onTabCloseChange(tabKey);
    };

    @action
    handleTabPageChange = (tabKey, type) => {
        if (this.tabActiveKey !== tabKey || type === 'nav') {
            this.history.push(tabKey, {type});
        }
    };

    @action
    handleNavOpenChange = (navOpenKeys) => {
        this.navOpenKeys = navOpenKeys;
    };

    @action
    handleNavToggle = () => {
        this.navCollapsed = !this.navCollapsed;
    };

    @action
    handleTabOperate = (type) => {
        switch (type) {
            case 'close': // 关闭当前
                this.handleTabEdit(this.tabActiveKey, 'remove');
                break;
            case 'close-other': // 关闭其他所有
                const current = this.tabActiveKey;
                const tabItems = toJS(this.tabList);
                for (let tabItemKey in tabItems) {
                    if (current !== tabItemKey) {
                        this.onTabCloseChange(tabItemKey);
                    }
                }
                // this.tabList = new Map().set(current, tabItems[current]);
                break;
            case 'clear':
                this.handleTabOperate('close-other');
                this.handleTabEdit(this.tabActiveKey, 'remove');
                break;
        }
    };

    // 修复当nav从展开到收起状态时，如果存在选中的navMenu，则会悬浮在外侧
    nav = autorun(() => {
        if (this.navCollapsed) {
            this.navOpenKeys = [];
        }
    });


    switchTabStoreView = (newTabItem) => {
        if (newTabItem) {
            let stores = newTabItem.stores;
            if (stores && stores instanceof Array && stores.length) {
                for (let storeName of stores) {
                    let store = this.store[storeName];
                    if (store && store instanceof BaseViewStore) {
                        store.switchView(newTabItem.tabKey);
                    }
                }
            }
        }
    };

    onTabCloseChange = (targetKey) => {
        if (targetKey) {
            let targetTabItem = this.tabList.get(targetKey);
            if (targetTabItem) {
                let stores = toJS(targetTabItem.stores);
                if (stores && stores instanceof Array && stores.length) {
                    for (let storeName of stores) {
                        let store = this.store[storeName];
                        if (store && store instanceof BaseViewStore) {
                            store.resetStoreView(targetKey, true);
                        }
                    }
                }
            }
        }
        this.tabList.delete(targetKey);
    };
}