import React from 'react';
import weekImpTemp from 'ADMIN_ASSETS/template/week_import.xlsx';


export default function (props) {
    return (
        <div className='mb-16'>
            <span className='color-danger'>导入的Excel中必须包含：身份证号码</span>
            {/* <a download='周薪导入模板.xlsx' href={weekImpTemp} className='ml-32'>模板下载</a> */}
        </div>
    );
}