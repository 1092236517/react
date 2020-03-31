import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ TotAgentAmt, TotAdvancePayAmt, TotPayCount, TotUserCount, TotPlatformAmt }) => (
    <div className='mb-16'><span className='color-black'>总人数：{TotUserCount}人；总笔数：{TotPayCount}；总周薪：{convertCentToThousandth(TotAdvancePayAmt)}元；总服务费：{convertCentToThousandth(TotAgentAmt)}元；总平台费：{convertCentToThousandth(TotPlatformAmt)}元。</span></div>
);