import React, { PureComponent } from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default class extends PureComponent {
    render() {
        const { DebtBossNum = 0, DepositBalance = 0, PreDeposit = 0, TotalDeposit = 0 } = this.props;
        return (
            <div className='mb-16'><span className='color-black'>当前筛选条件下押金总额{convertCentToThousandth(TotalDeposit)}，押金余额总额{convertCentToThousandth(DepositBalance)}，预收押金总额{convertCentToThousandth(PreDeposit)}元，欠款大佬{DebtBossNum}家。</span></div>
        );
    }
}