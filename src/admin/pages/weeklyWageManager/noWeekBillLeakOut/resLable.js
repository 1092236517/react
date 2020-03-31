import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ total }) => (
    <div className='mb-16'>
        {/* <span style={{ fontWeight: 'bold' }} className='color-danger'>周二开始才能查上周数据。</span> */}
        <span className='color-black'>该查询条件下总人次:{total}</span>
    </div>
);