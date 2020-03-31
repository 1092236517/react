import React, { Component } from 'react';
import { observer } from "mobx-react";
import { convertCentToThousandth } from 'web-react-base-utils';

@observer
export default class extends Component {
    render() {
        const { TolOrderRf, TolPredictRf, TolPaidRf, TolNotPayRf } = this.props.tableInfo;
        return (
            <div className='mb-16'>
                <span>订单返费总金额：{convertCentToThousandth(TolOrderRf)}元;预计应付：{convertCentToThousandth(TolPredictRf)}元；实付：{convertCentToThousandth(TolPaidRf)}元;预计待支付：{convertCentToThousandth(TolNotPayRf)}元。  </span>
            </div>
        );
    }
}