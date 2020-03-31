import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ TolAdvancePayAmt, WeeklyCount, TolAgentAmt, TolPlatformSrvcAmt, total }) => (
    <div className='mb-16'>
        <span className='color-black'>当前筛选条件下总人次{total}，返费周薪发放人次{WeeklyCount}，总周薪{convertCentToThousandth(TolAdvancePayAmt)}元，总服务费{convertCentToThousandth(TolAgentAmt)}元，总平台费{convertCentToThousandth(TolPlatformSrvcAmt)}元。</span>
    </div>
); 