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
                    <Button type='primary' onClick={() => { exportRec(); window._czc.push(['_trackEvent', '打卡统计', '导出', '打卡统计_N非结算']); }}>导出</Button>
                }
            </Col>

            <Col span={12} className='text-right'>
                <img
                    className='see-detail'
                    onClick={() => { changeShowMode(); window._czc.push(['_trackEvent', '打卡统计', showMode == 'chart' ? '切换成图形显示' : '切换成表格显示', '打卡统计_N非结算']); }}
                    src={showMode == 'chart' ? tablePic : chartPic} />
            </Col>
        </Row>
    );
};