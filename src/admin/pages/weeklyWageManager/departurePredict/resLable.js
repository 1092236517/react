import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ ClockNgTimes, ClockOkTimes, NewEntryNum, OldEntryNum }) => (
<div className='mb-16'><span className='color-black'>新入职人数：{NewEntryNum}人；已入职人数：{OldEntryNum}；正常打卡次数：{ClockOkTimes}；非正常打卡次数：{ClockNgTimes}</span></div>
);