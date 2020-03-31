import React, { PureComponent } from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default class extends PureComponent {
    render() {
        const {
            TolRemainingSalary = 0, TolSumPay = 0, TolXArrears = 0, TolSumProfit = 0, TolWeeklyPaidAmt = 0, TolXEnd = 0, TolXImport = 0, TotSumProfit = 0, TolXPaidBIllAmt = 0, TolSubsidy = 0
        } = this.props;

        return (
            <div className='color-danger mb-16'>
                <div className='mb-8'>
                    合计X为：{TolXEnd ? convertCentToThousandth(TolXEnd) : convertCentToThousandth(TolXImport)}元，
                        合计支出Y为：{convertCentToThousandth(TolSumPay)}元，
                        总X欠款：{convertCentToThousandth(TolXArrears)}元，
                        总X已到账：{convertCentToThousandth(TolXPaidBIllAmt)}元。
                    </div>
                <div>
                    其中已支生活费：{convertCentToThousandth(TolWeeklyPaidAmt)}元，
                        剩余月薪为：{convertCentToThousandth(TolRemainingSalary)}元，
                        {/* 补贴为: {convertCentToThousandth(TolSubsidy)}元， */}                        
                        盈利：{convertCentToThousandth(TolSumProfit)}元。
                    </div>
            </div>
        );
    }
}