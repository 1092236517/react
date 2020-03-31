import React, { PureComponent } from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default class extends PureComponent {
    render() {
        const {
            TotSumPay = 0, TolWeeklyPaidAmt = 0, TolRemainingSalary = 0, TotSumProfit = 0, TolWodaAgentAmt = 0, TolOtherAgentAmt = 0, TolPlatformSrvcAmt = 0, TolReturnFee = 0, TolPaidBIllAmt = 0, TolTrgtSpArrears = 0
        } = this.props;

        return (
            <div className='mb-16'>
                <div className='color-danger'>合计支出：{convertCentToThousandth(TotSumPay)}元，其中周薪支出{convertCentToThousandth(TolWeeklyPaidAmt)}元，月薪支出{convertCentToThousandth(TolRemainingSalary)}元。</div>
                <div className='color-danger mt-8'>合计盈利：{convertCentToThousandth(TotSumProfit)}元，其中我打服务费{convertCentToThousandth(TolWodaAgentAmt)}元，萌店服务费{convertCentToThousandth(TolOtherAgentAmt)}元，平台服务费{convertCentToThousandth(TolPlatformSrvcAmt)}元。</div>
                <div className='color-danger mt-8'>已到账款：{convertCentToThousandth(TolPaidBIllAmt)}元。劳务欠款{convertCentToThousandth(TolTrgtSpArrears)}元。总返费：{convertCentToThousandth(TolReturnFee)}元。</div>
            </div>
        );
    }
}