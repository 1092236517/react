import { tabWrap } from 'ADMIN_PAGES';
import { Button, Spin, Tooltip } from 'antd';
import { inject, observer } from "mobx-react";
import React, { Component, Fragment } from 'react';
import ResTable from './resTable';
import SearchForm from './searchForm';
import impTemp from 'ADMIN_ASSETS/template/payroll_Import.xlsx';

@tabWrap({
    tabName: '工资单导入',
    stores: ['payrollImportStore']
})
@inject('payrollImportStore', 'globalStore')
@observer
class PayrollImport extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/monthlyWageManager/payrollImport']);
        if (!this.props.payrollImportStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    delete = () => {
        this.props.payrollImportStore.line();
        window._czc.push(['_trackEvent', '工资单导入', '删除', '工资单导入_Y结算']);
    }

    // 导出
    export = () => {
        this.props.payrollImportStore.exportPreview();
        // Data.then((res) => {
        //     window.open(res.FileUrl);
        // });
        window._czc.push(['_trackEvent', '工资单导入', '导出', '工资单导入_Y结算']);
    }

    render() {
        const { view: { showSpin } } = this.props.payrollImportStore;
        return (
            <div>
                <div className='mb-8'>
                    <Button type='primary' onClick={this.export}>导出</Button>
                    <Button type='primary' className='ml-8' onClick={this.delete}>删除</Button>
                    <Tooltip title={() => (
                        <Fragment>
                            <p>1.入职日期 和 离职/转正日期 内容为日期格式，其他列内容需要为文本格式。</p>
                            <p>2.模板内容为必填项，其他内容依据实际情况填写</p>
                        </Fragment>
                    )}>
                        <a href={impTemp} className='ml-8' download='工资单导入模板.xlsx' onClick={() => { window._czc.push(['_trackEvent', '工资单导入', '模板下载', '工资单导入_Y结算']); }} >模板下载</a>
                    </Tooltip>
                </div>

                <Spin spinning={showSpin}>
                    <SearchForm {...this.props} />
                    {/* <hr /> */}
                    <ResTable {...this.props} />
                </Spin>
            </div>
        );
    }
}

export default PayrollImport;