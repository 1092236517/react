import React from 'react';
import { observer } from "mobx-react";
import { convertCentToThousandth } from 'web-react-base-utils';

export default React.memo(({ selectedRows }) => {
    let TotAmtS = 0;
    let AgentAmtS = 0;
    let PlatformSrvcAmtS = 0;

    selectedRows.forEach(({ TotAmt, AgentAmt, PlatformSrvcAmt }) => {
        TotAmtS += TotAmt;
        AgentAmtS += AgentAmt;
        PlatformSrvcAmtS += PlatformSrvcAmt;
    });

    return selectedRows.length > 0 &&
        <div className='mb-16 color-danger'>
            总人数:{selectedRows.length}人,会员总金额：{convertCentToThousandth(TotAmtS)}元,中介费用：{convertCentToThousandth(AgentAmtS)}元,平台费用：{convertCentToThousandth(PlatformSrvcAmtS)}元。
            </div>;
});