import React, { Component } from 'react';
import { observer } from "mobx-react";
import { convertCentToThousandth } from 'web-react-base-utils';

@observer
export default class extends Component {
    render() {
        const { TotalX, TotalY, TotalAdvancePayAmt, TotalRemainingSalary, TotalReturnFee, TotalProfit, TotalEntryNumber } = this.props.tableInfo;
        return (
            <div className='mb-16'>
                <span>合计X为：{convertCentToThousandth(TotalX)}元，合计支出Y为：{convertCentToThousandth(TotalY)}元，其中已支出生活费为：{convertCentToThousandth(TotalAdvancePayAmt)}元，剩余月薪为：{convertCentToThousandth(TotalRemainingSalary)}元，返费为：{convertCentToThousandth(TotalReturnFee)}元，盈利：{convertCentToThousandth(TotalProfit)}元，总人数：{TotalEntryNumber}人。  </span>
            </div>
        );
    }
}