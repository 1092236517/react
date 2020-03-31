import 'ADMIN_ASSETS/less/pages/imageView.less';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import { Button, Modal } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import 'ADMIN_ASSETS/less/pages/systemManager.less';
@observer
class showForMessaegPush extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstValue: {},
            num: 0,
            width: "auto",
            height: window.screen.width > 1600 ? 400 : 300,
            rot: 0,
            px: 0,
            py: 100,
            isDrag: false,
            screenWidth: window.screen.width,
            imgTop: window.screen.width > 1600 ? 75 : 15,
            imgLeft: (window.screen.width - 300) / 2 - 260
        };

    }

    render() {
        let { setInfoModalVisible, contentView, pushInfo } = this.props;
        return (
            <div style={{
                overflow: "hidden",
                position: 'absolute', top: 0, left: 0
            }}
            >
                <Modal
                    title="推送文案"
                    visible={contentView}
                    onCancel={() => setInfoModalVisible()}

                    style={{
                        position: 'relative',
                        top: this.state.screenWidth > 1600 ? '60px' : '20px'
                    }}
                    footer={[
                        <Button key="submit" type="primary" onClick={() => { setInfoModalVisible(); window._czc.push(['_trackEvent', '公告推送管理', '确定推送文案', '公告推送管理_N非结算']); }}>确定</Button>
                    ]}
                >
                    <textarea value={pushInfo} rows={6} cols={60} className='removeDefault' readOnly={true} />
                </Modal>
            </div>
        );
    }
}
export default showForMessaegPush;
