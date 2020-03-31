import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ TotalClockCount, TotalAmtCount }) => (
    <div className='mb-16'>
        <span style={{ fontWeight: 'bold' }} className='color-danger'>周二开始才能查上周数据。</span>
        <span className='color-black'>打卡人数合计:{TotalClockCount}，预估周薪合计：{convertCentToThousandth(TotalAmtCount)}。</span>
    </div>
);