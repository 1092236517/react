import React from 'react';
import weekImpTemp from 'ADMIN_ASSETS/template/perks_import.xlsx';


export default function (props) {
    return (
        <div className='mb-16'>
            <span className='color-danger'>导入的Excel中必须包含：姓名、身份证号码、工号</span>
            <a download='额外补贴.xlsx' onClick={() => { window._czc.push(['_trackEvent', '额外补贴', '模板下载', '额外补贴_Y结算']); }} href={weekImpTemp} className='ml-32'>模板下载</a>
        </div>
    );
}