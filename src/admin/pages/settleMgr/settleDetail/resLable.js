import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ TolX, TolDValue, TolY, TolZ }) => (
    <h3 style={{ margin: '0 0 16px 0', color: 'red' }}>根据当前筛选结果汇总：X汇总{convertCentToThousandth(TolX)}元；Y汇总{convertCentToThousandth(TolY)}元；Z汇总{convertCentToThousandth(TolZ)}元；(X-Y)/2 - Z汇总{convertCentToThousandth(TolDValue)}元</h3>
);