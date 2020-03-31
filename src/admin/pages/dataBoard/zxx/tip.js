import React from 'react';
import { Row, Col, Button } from 'antd';
import tablePic from 'ADMIN_ASSETS/images/table.png';
import chartPic from 'ADMIN_ASSETS/images/chart.png';

export default (props) => {
    const { changeShowMode, showMode, exportRec } = props;
    return (
        <Row className='mt-16 mb-16'>
            <Col span={12}>
                {
                    showMode == 'table' &&
                    <Button type='primary' onClick={() => { exportRec(); window._czc.push(['_trackEvent', '周薪统计', '导出', '周薪统计_N非结算']); }}>导出</Button>
                }
            </Col>

            <Col span={12} className='text-right'>
                <img
                    className='see-detail'
                    onClick={changeShowMode}
                    src={showMode == 'chart' ? tablePic : chartPic} />
            </Col>
        </Row>
    );
};