import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ PlatformSrvcAmt, TotMonthlySalary, TotOkRemainingSalary, TotOkTrgtSpMonthlyPaidSalary, TotOkWeeklyPaidAmt, TotPayCnt, TotUserCnt }) => (
    <div className='mb-16'><span className='color-black'>总人数：{TotUserCnt}人；总笔数：{TotPayCnt}；总月薪：{convertCentToThousandth(TotMonthlySalary)}元；总平台费：{convertCentToThousandth(PlatformSrvcAmt)}元。总实发工资：{convertCentToThousandth(TotOkTrgtSpMonthlyPaidSalary)}元；总已支生活费：{convertCentToThousandth(TotOkWeeklyPaidAmt)}元；总实际剩余工资：{convertCentToThousandth(TotOkRemainingSalary)}元。</span></div>
);