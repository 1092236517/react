import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ tableInfo: { TolReturnFee, TolReturnFeeAfterTax }, total }) => (
    <div className='mb-16'>
        <span className='color-black'>总条数{total}；总返费{convertCentToThousandth(TolReturnFee)}元；总税后金额{convertCentToThousandth(TolReturnFeeAfterTax)}元</span>
    </div>
); 