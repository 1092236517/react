import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';
import { Button } from 'antd';
export default ({ rowCount, pepoleCount, refresh }) => (
    <div className='mb-16'>
        {/* <span style={{ fontWeight: 'bold' }} className='color-danger'>周二开始才能查上周数据。</span> */}
        <span className='color-black'>共{rowCount}条记录，共{pepoleCount}人</span>
        <Button type='primary' className='ml-8' onClick={() => { refresh(); window._czc.push(['_trackEvent', '发薪进度表', '刷新', '发薪进度表_Y结算']); }}>刷新</Button>
    </div>
);