import React from 'react';
import { tabWrap } from 'ADMIN_PAGES';
import { inject, observer } from 'mobx-react';
import ApplyModal from './applyModal';
import SearchForm from './searchForm';
import ResTable from './resTable';
import OperBtn from './operBtn';
import ResLabel from './resLabel';

@tabWrap({
    tabName: '发薪申请',
    stores: ['applyStore']
})

@inject('applyStore', 'globalStore')

@observer
export default class extends React.Component {
    state = {
        record: null,
        isShowModal: false
    }

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/payOffManager/Apply']);
        if (!this.props.applyStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }

        const { startQuery } = this.props.applyStore;
        startQuery();
    }

    closeModal = () => {
        this.setState({
            record: null,
            isShowModal: false
        });
    }

    editApply = (record) => {
        this.setState({
            record,
            isShowModal: true
        });
        window._czc.push(['_trackEvent', '发薪申请', '修改', '发薪申请_Y结算']);
    }

    startApply = () => {
        this.setState({
            record: null,
            isShowModal: true
        });
    }

    render() {
        const {
            view: {
                searchValue,
                pagination,
                tableInfo
            },
            handleFormValuesChange,
            resetForm,
            startQuery,
            resetPageCurrent,
            setPagination,
            delApply,
            setSelectRowKeys,
            submitBatch
        } = this.props.applyStore;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { record, isShowModal } = this.state;

        return (
            <div>
                <OperBtn startApply={this.startApply} submitBatch={submitBatch} />

                <SearchForm
                    {...{
                        searchValue,
                        resetForm,
                        agentList,
                        companyList,
                        laborList,
                        handleFormValuesChange,
                        startQuery,
                        resetPageCurrent
                    }}
                />

                <ResLabel selectedRows={tableInfo.selectedRows} />

                <ResTable
                    {...{
                        setSelectRowKeys,
                        pagination,
                        tableInfo,
                        startQuery,
                        setPagination,
                        delApply,
                        editApply: this.editApply
                    }} />

                {
                    isShowModal &&
                    <ApplyModal
                        {...{
                            record,
                            agentList,
                            companyList,
                            laborList,
                            startQuery,
                            closeModal: this.closeModal
                        }}
                    />
                }
            </div>
        );
    }
}