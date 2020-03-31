import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ TolAdvancePayAmt, WeeklyCount, TolAgentAmt, TolPlatformSrvcAmt, total, SrceFlag }) => (
    <div className='mb-16'>
        <span className='color-black'>当前筛选条件下总人次{total}，周薪发放人次{WeeklyCount}，总周薪{convertCentToThousandth(TolAdvancePayAmt)}元，总服务费{convertCentToThousandth(TolAgentAmt)}元，总平台费{convertCentToThousandth(TolPlatformSrvcAmt)}元。</span>
        {
            SrceFlag != -9999 &&
            <span className='color-danger'>{`该页面从[盈利报表-${{ 1: '我打服务费查询', 2: '萌店服务费查询' }[SrceFlag]}]跳转而来，如需普通查询请点击重置按钮。`}</span>
        }
    </div>
); 