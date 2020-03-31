import React from 'react';
import impTemp from 'ADMIN_ASSETS/template/x_import.xlsx';

export default function (props) {
    return (
        <div className='mb-16'>
            <span className='color-danger'>导入的表格，必须包含：身份证号码或者工号，X，和姓名</span>
            <a download='x导入模板.xlsx' href={impTemp} className='ml-32' onClick={() => { window._czc.push(['_trackEvent', '导入X', '模板下载', '导入X_Y结算']); }}>模板下载</a>
        </div>
    );
}