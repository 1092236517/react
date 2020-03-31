import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ TolRemainingSalary, TolAgentAmt, MonthlyCount, total, TolPlatformSrvcAmt }) => (
    <div className='mb-16'><span className='color-black'>当前筛选条件下总人次{total}，月薪发放人次{MonthlyCount}，总月薪{convertCentToThousandth(TolRemainingSalary)}元，总平台费{convertCentToThousandth(TolPlatformSrvcAmt)}元，总服务费{convertCentToThousandth(TolAgentAmt)}元。</span></div>
);