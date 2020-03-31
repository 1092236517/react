import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from "mobx-react";
import { Table, Button, Modal } from 'antd';
import { tabWrap } from 'ADMIN_PAGES';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import SearchForm from './searchForm';
import EditModal from './editModal';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { generateColInfo } from 'ADMIN_UTILS';
@tabWrap({
    tabName: '中介基础数据',
    stores: ['intermediaryAgentStore']
})
@inject('intermediaryAgentStore', 'globalStore')
@observer
class intermediaryAgent extends Component {

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/basicData/intermediaryAgent']);
        if (!this.props.intermediaryAgentStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        this.props.globalStore.getAgentList();
        this.props.globalStore.getBankList();
        this.props.intermediaryAgentStore.getList();
    }

    onChange = (page, pageSize) => {
        this.props.intermediaryAgentStore.getList({ RecordIndex: page, RecordSize: pageSize });
    }

    render() {
        const { agentList, bankList } = this.props.globalStore;
        const { view, handleFormValuesChange, handleFormReset, syncAgentLabor, setVisible, setRecord, getList } = this.props.intermediaryAgentStore;
        const { searchValue } = view; // 搜索条件
        const { RecordCount, page, dataSource, loading } = view;
        const { syncVisible, modalLoading, editVisible } = view;
        const columnsMap = [
            ['SpFullName', '中介全称', undefined, 180],
            ['SpShortName', '中介简称', undefined, 180],
            ['CtctName', '联系人', undefined, 100],
            ['CtctMobile', '手机号码', (text, record, index) => text && text.replace(text.slice(3, 7), '****'), 120],
            ['BankName', '银行名称'],
            ['BankCardNo', '银行账号', (text, record, index) => text && text.replace(text.slice(0, text.length - 6), '****')],
            ['BankAccountName', '银行账号名', undefined, 180],
            // ['InfoIsCompleted', '信息完整度', (text, record, index) => text === 1 ? '不完整' : (text === 2 ? '完整' : '')],
            ['CreateTm', '操作时间', tableDateTimeRender, 150],
            ['CreateBy', '操作人', undefined, 100],
            ['DeleteReason', '操作', (text, record, index) => authority(resId.baseAgentList.edit)(<a href="javascript:void(0)" onClick={() => { setRecord(record); window._czc.push(['_trackEvent', '中介基础数据', '编辑', '中介基础数据_N非结算']); }}>编辑</a>)]
        ];

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div className="id-card">
                {authority(resId.baseAgentList.sync)(<Button onClick={() => { setVisible('syncVisible', true); window._czc.push(['_trackEvent', '中介基础数据', '同步', '中介基础数据_N非结算']); }} type='primary' className='mb-16'>同步</Button>)}
                <SearchForm
                    {...{
                        searchValue,
                        handleFormValuesChange,
                        handleFormReset,
                        agentList,
                        bankList,
                        getList,
                        loading
                    }} />
                <Table
                    scroll={{ x: width, y: 550 }}
                    columns={columns}
                    bordered={true}
                    dataSource={toJS(dataSource)}
                    rowKey='SpId'
                    pagination={{
                        ...tablePageDefaultOpt,
                        current: page.RecordIndex,
                        pageSize: page.RecordSize,
                        total: RecordCount,
                        onChange: (page, pageSize) => this.onChange(page, pageSize),
                        onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize)
                    }}
                    loading={loading}
                />
                <Modal
                    title="同步确认"
                    visible={syncVisible}
                    onCancel={() => { setVisible('syncVisible', false); window._czc.push(['_trackEvent', '中介基础数据', '取消同步', '中介基础数据_N非结算']); }}
                    onOk={syncAgentLabor}
                    confirmLoading={modalLoading}
                >
                    是否同步？
                </Modal>
                {editVisible && <EditModal
                    {...{ bankList }}
                />}
            </div>
        );
    }
}

export default intermediaryAgent;