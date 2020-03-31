import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import { Button } from 'antd';
import InfoModal from './infoModal';

@tabWrap({
    tabName: '月薪短信配置',
    stores: ['monthlyMessageSetStore']
})
@inject('monthlyMessageSetStore', 'globalStore')
@observer
class Index extends Component {
    state = {
        modalTitle: ''
    }
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/basicData/monthlyMessageSet']);
        if (!this.props.monthlyMessageSetStore.view.isDirty) {
            this.init();
        }
    }
    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery } = this.props.monthlyMessageSetStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        startQuery();
    }

    addEntLaborMap = () => {
        const { setModalShow, handleFormValuesChange } = this.props.monthlyMessageSetStore;
        this.setState({
            modalTitle: 'addModal'
        });
        handleFormValuesChange({});
        setModalShow();
        window._czc.push(['_trackEvent', '月薪短信配置', '添加', '月薪短信配置_Y结算']);
    }

    closeShowModal = () => {
        const { setModalHide } = this.props.monthlyMessageSetStore;
        setModalHide();
    }
    preModifyModal = (record) => {
        const { setModalShow, handleFormValuesChange } = this.props.monthlyMessageSetStore;
        this.setState({
            modalTitle: 'modifyModal'
        });

        setModalShow();
        handleFormValuesChange(record);
    }
    render() {
        const {
            monthlyMessageSetStore: {
                view: { modalValue, tableInfo, pagination, isShowModal },
                startQuery,
                setPagination,
                setSelectRowKeys
            }
        } = this.props;
        const { modalTitle } = this.state;

        return (
            <div>
                <div className='mb-16'>
                    {<Button type='primary' onClick={this.addEntLaborMap}>添加</Button>}
                    {<Button type='primary' style={{ marginLeft: '1rem' }} onClick={() => {startQuery();window._czc.push(['_trackEvent', '月薪短信配置', '刷新', '月薪短信配置_Y结算']);}}>刷新</Button>}
                </div>
                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys, setModalShow: this.preModifyModal }} />
                {
                    isShowModal &&
                    <InfoModal {...{ modalValue, startQuery, closeModal: this.closeShowModal, modalTitle }} />
                }
            </div>
        );
    }
}

export default Index;


