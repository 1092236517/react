import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ tableInfo: { TolReturnFee, total } }) => (
    <div className='mb-16'>
        <span className='color-black'>总条数{total}，总金额{convertCentToThousandth(TolReturnFee)}元</span>
    </div>
); 