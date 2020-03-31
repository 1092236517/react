import add from 'ADMIN_ASSETS/images/add.png';
import left from 'ADMIN_ASSETS/images/left.png';
import minus from 'ADMIN_ASSETS/images/minus.png';
import right from 'ADMIN_ASSETS/images/right.png';
import 'ADMIN_ASSETS/less/pages/imageView.less';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import { Button, Modal, Row } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import DragContainer from './imageView';

@observer
class ImageView extends React.Component {
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
        this.downX = 0;
        this.downY = 0;
    }

    fnDown = event => {
        event.preventDefault();
        this.setState({
            isDrag: true
        });
        this.downX = event.clientX;
        this.downY = event.clientY;
    };

    fnMove = (event) => {
        event.persist();
        if (this.state.isDrag) {
            // 判断容器宽高
            this.setState(state => {
                let result = {
                    px: state.px + (event.clientX - this.downX),
                    py: state.py + (event.clientY - this.downY)
                };
                this.downX = event.clientX;
                this.downY = event.clientY;
                return result;
            });
        }
    };

    fnUp = (event) => {
        event.preventDefault();
        this.setState({
            isDrag: false
        });
    };

    // 放大缩小图片
    imgToSize = (size, e) => {
        if (e) {
            if (e.nativeEvent.deltaY <= 0) {
                size = size;
            } else {
                size = -size;
            }
        }
        var img = document.getElementById('img');
        let { width, height, imgTop, imgLeft } = this.state;
        if (width === "auto") {
            width = img.width;
        }
        if (height <= 300 && size < 0) {
            return;
        } else {
            this.setState({
                width: width * 1 + size,
                height: (height + size / width * height),
                imgTop: size > 0 ? imgTop - ((height + size / width * height) / 2 - (height / 2)) : imgTop + (height / 2 - (height + size / width * height) / 2),
                imgLeft: size > 0 ? imgLeft - ((width * 1 + size) / 2 - width / 2) : imgLeft + (width / 2 - (width * 1 + size) / 2)
            });
        }
    }
    // 向右转
    rotRight = () => {
        if (this.state.rot < 3) {
            this.setState({
                rot: this.state.rot + 1
            });
        } else {
            this.setState({
                rot: 0
            });
        }

    }
    // 像左转
    rotLeft = () => {
        if (this.state.rot === 0) {
            this.setState({
                rot: 3
            });
        } else {
            this.setState({
                rot: this.state.rot - 1
            });
        }
    }

    // 关闭弹窗
    setModalVisible = () => {
        this.props.setModalVisible();
    }

    render() {
        let { source, imageView } = this.props;
        let { width, height, rot } = this.state;
        return (
            <div style={{
                overflow: "hidden",
                position: 'absolute', top: 0, left: 0
            }}
                onMouseDown={this.fnDown}
                onMouseMove={this.fnMove}
                onMouseUp={this.fnUp}
            >
                <Modal
                    title="上传凭证信息"
                    visible={imageView}
                    onCancel={() => this.setModalVisible()}
                    width={this.state.screenWidth - 200}
                    style={{ 
                        position: 'relative',
                        top: this.state.screenWidth > 1600 ? '60px' : '20px'
                    }}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.setModalVisible}>确定</Button>
                    ]}
                >
                    <Row type="flex" justify="center" className="mb-16">
                        {
                            source ?
                                <div>
                                    <DragContainer style={
                                        {
                                            width: this.state.screenWidth - 300,
                                            height: this.state.screenWidth > 1600 ? '530px' : '330px',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }
                                    }>
                                        <img id="img" style={
                                            {
                                                position: 'relative',
                                                top: this.state.imgTop,
                                                left: this.state.imgLeft
                                            }
                                        }
                                            width={width} height={height} onWheel={(e) => { this.imgToSize(50, e); }} src={source} className={`rot${rot}`} />
                                    </DragContainer>
                                    <div style={{ paddingTop: "15px" }}>
                                        <Button className="ml-8" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.imgToSize(50)}><img src={add} /></Button>
                                        <Button className="ml-16" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.imgToSize(-50)}><img src={minus} /></Button>
                                        <Button className="ml-16" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.rotRight()}><img src={right} /></Button>
                                        <Button className="ml-16" style={{ width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px" }} onClick={() => this.rotLeft()}><img src={left} /></Button>
                                    </div>
                                </div> : null
                        }
                    </Row>
                </Modal>
            </div>
        );
    }
}
export default ImageView;
