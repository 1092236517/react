import React, { Component } from 'react';
import { observer } from "mobx-react";
import { convertCentToThousandth } from 'web-react-base-utils';

@observer
export default class extends Component {
    render() {
        const { UnHandleCount, SelectedAmount } = this.props.attachInfo;
        return (
            <div className='mb-16'>
                <div className='color-danger'>还有{UnHandleCount}条退回记录未处理。</div>
                <div className='color-black mt-8'>选中金额：{convertCentToThousandth(SelectedAmount)}元。</div>
            </div>
        );
    }
}