import React from 'react';
import weekImpTemp from 'ADMIN_ASSETS/template/week_returnfee_import.xlsx';


export default function (props) {
    return (
        <div className='mb-16'>
            <span className='color-danger'>导入的Excel中必须包含：姓名、身份证号码、工号、入职日期、上班天数、在职状态、离职/转正/自离日期</span>
            <a download='周薪返费导入模板.xlsx' href={weekImpTemp} className='ml-32' onClick={() => { window._czc.push(['_trackEvent', '导入返费周薪', '模板下载', '导入返费周薪_N非结算']); }}>模板下载</a>
        </div>
    );
}