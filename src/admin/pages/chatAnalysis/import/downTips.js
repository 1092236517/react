import React from 'react';
import weekImpTemp from 'ADMIN_ASSETS/template/week_import.xlsx';


export default function (props) {
    return (
        <div className='mb-16'>
            <span className='color-danger'>文件名规则:  年月日~门店名称~群聊记录.xlsx， 例:  20191101~利得1店~群聊记录.xlsx ，sheet名称规则: 马甲|昵称|群人数, 例: 莉姐|我的打工网莉姐|300</span>
            {/* <a download='周薪导入模板.xlsx' href={weekImpTemp} className='ml-32'>模板下载</a> */}
        </div>
    );
}