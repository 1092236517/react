import React, { PureComponent } from 'react';
import impTemp from 'ADMIN_ASSETS/template/labor_remit_imp.xlsx';

export default class extends PureComponent {
    render() {
        return (
            <div className='mb-16'>
                <span className='color-danger'>导入的表格，必须包含：身份证号码，面试日期，打款金额，打款日期，银行名称，银行卡号</span>
                <a download='劳务打款数据导入模板.xlsx' href={impTemp} className='ml-32'>模板下载</a>
            </div>
        );
    }
}