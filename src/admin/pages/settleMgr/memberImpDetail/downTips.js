import React from 'react';
import member_import from 'ADMIN_ASSETS/template/member_import.xlsx';

export default function (props) {
    return (
        <div className='mb-16'>
            <span className='color-danger'>导入的表格，必须包含：身份证号码或者工号、X和姓名</span>
            <a download='筛选会员费用明细.xlsx' href={member_import} className='ml-32' onClick={() => { window._czc.push(['_trackEvent', '筛选会员费用明细', '模板下载', '筛选会员费用明细_Y结算']); }}>模板下载</a>
        </div>
    );
}