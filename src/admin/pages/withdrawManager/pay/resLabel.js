import React, { Component } from 'react';
import { observer } from "mobx-react";
import { convertCentToThousandth } from 'web-react-base-utils';

@observer
export default class extends Component {
    render() {
        const { UnAuditAmount, UnAuditCount, WaitWithdrawAmount, WaitWithdrawCount, SelectedAmount } = this.props.attachInfo;
        return (
            <div className='mb-16'>
                <span className='color-danger'>未授权条数：{UnAuditCount}，未授权金额：{convertCentToThousandth(UnAuditAmount)}元。</span>
                <span className='color-success'>待打款条数：{WaitWithdrawCount}，待打款金额：{convertCentToThousandth(WaitWithdrawAmount)}元。</span>
                <div className='color-black mt-8'>本次选中金额：{convertCentToThousandth(SelectedAmount)}元。</div>
            </div>
        );
    }
}