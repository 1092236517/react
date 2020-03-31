import {createViewModel} from "mobx-utils";

export class BaseViewStore {
    constructor(ViewPattern) {
        this.ViewPattern = ViewPattern;
        this.view = this.getPatternView();
        this.viewMap = new Map();
    }

    getPatternView = () => createViewModel(new this.ViewPattern());

    // 标签关闭时重置store
    resetStoreView = (viewKey, isDrop) => {
        if (isDrop) {
            this.viewMap.delete(viewKey);
        } else if (viewKey) {
            let view = this.viewMap.get(viewKey);
            if (view) view.reset();
        } else {
            this.view.reset();
        }
    };

    switchView = (newKey) => {
        if (!newKey) return;
        !this.viewMap.has(newKey) && this.viewMap.set(newKey, this.getPatternView());
        this.view = this.viewMap.get(newKey);
    };
}

export class BaseView {
    constructor() {
        // todo
    }
}