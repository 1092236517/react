import { tabWrap } from 'ADMIN_PAGES';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Apply from './apply';
import Check from './check';
import EditSpit from './editSplit';
import FindLabourList from './findLabourList';
import Split from './split';

@tabWrap({
    tabName: '单条明细',
    stores: ['entryAndExitStore']
})

@inject('entryAndExitStore', 'globalStore')

@observer
export default class EntryAndExit extends React.Component {
    constructor(props) {
        super(props);
        let url = window.location.href;
        let diffCode = url.lastIndexOf("=");
        let urlDiff = url.substring(diffCode + 1);
        this.state = {
            urlDiff: urlDiff
        };
    }

    componentDidMount() {
        if (!this.props.entryAndExitStore.view.isDirty) {
            let url = window.location.href;
            let idCode1 = url.indexOf("=");
            let idCode2 = url.indexOf("&");
            let id = url.substring(idCode1 + 1, idCode2);
            if (url.indexOf("id") !== -1) {
                this.getByID(id);
            }
        }
        this.getAllCompanyInfo();
        this.getBankList();
    }
    request = this.props.entryAndExitStore.request;
    getAllCompanyInfo = this.props.globalStore.getAllCompanyInfo;
    getBankList = this.props.globalStore.getBankList;
    getByID = this.props.entryAndExitStore.getByID;

    render() {
        const { entryAndExitStore, globalStore } = this.props;
        return (
            <div style={{
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* table劳务展示*/}
                <FindLabourList
                    {...{
                        entryAndExitStore,
                        globalStore,
                        excelValue: entryAndExitStore.view.excelValue,
                        SheetNameValueChange: entryAndExitStore.SheetNameValueChange
                    }}
                />
                {/* 录入，展示，修改，拆分*/}
                {
                    (this.state.urlDiff === 'examined' || this.state.urlDiff === 'split') ?
                        <Split
                            {...{
                                entryAndExitStore,
                                globalStore,
                                RequestValue: entryAndExitStore.view.RequestValue
                            }}
                        /> : this.state.urlDiff === 'check' ?
                            <Check
                                {...{
                                    entryAndExitStore,
                                    globalStore,
                                    RequestValue: entryAndExitStore.view.RequestValue
                                }}
                            /> : this.state.urlDiff === 'apply' ? <Apply
                                {...{
                                    entryAndExitStore,
                                    globalStore,
                                    RequestValue: entryAndExitStore.view.RequestValue
                                }}
                            /> : ''
                }
                {/* 录入，查看，修改，拆分按钮操作*/}
                <EditSpit
                    {
                    ...{
                        entryAndExitStore,
                        globalStore
                    }
                    }
                />
            </div>
        );
    }
}