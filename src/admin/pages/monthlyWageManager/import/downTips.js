import React from 'react';
import monthImpTemp from 'ADMIN_ASSETS/template/month_import.xlsx';

export default function (props) {
    return (
        <div className='mb-16'>
            <span className='color-danger'>导入的Excel中必须包含：姓名、身份证号码、工号、实发工资、入职日期、在职状态、离职/转正日期</span>
            <a download='月薪导入模板.xlsx' onClick={() => { window._czc.push(['_trackEvent', '导入月薪', '模板下载', '导入月薪_Y结算']); }} href={monthImpTemp} className='ml-32'>模板下载</a>
        </div>
    );
}