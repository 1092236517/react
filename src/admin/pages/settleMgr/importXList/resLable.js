import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';

export default ({ AuditPassUserCount, AuditPassXAmount, AuditRejectUserCount, AuditRejectXAmount, UnAuditUserCount, UnAuditXAmount,
    TotalXSalaryAmount, TotalXSocialAmount, TotalXManageFeeAmount, TotalXRecruitmentFeeAmount, TotalXLeaveAmount, TotalXOtherAmount }) => (
        <div className='mb-16 color-danger'>
            <p>
                审核通过{AuditPassUserCount}人，{convertCentToThousandth(AuditPassXAmount)}元；审核不通过{AuditRejectUserCount}人，{convertCentToThousandth(AuditRejectXAmount)}元；未审核有{UnAuditUserCount}人，{convertCentToThousandth(UnAuditXAmount)}元。
        </p>

            <p>
                X-工资：{convertCentToThousandth(TotalXSalaryAmount)}元，X-社保：{convertCentToThousandth(TotalXSocialAmount)}元，X-管理费：{convertCentToThousandth(TotalXManageFeeAmount)}元，X-招聘费：{convertCentToThousandth(TotalXRecruitmentFeeAmount)}元，X-自离工资：{convertCentToThousandth(TotalXLeaveAmount)}元，X-其他：{convertCentToThousandth(TotalXOtherAmount)}元。
        </p>
        </div>
    );