import 'ADMIN_ASSETS/less/pages/imageView.less';
import 'ADMIN_ASSETS/less/pages/informationQueryModal.less';
import { Modal, Row, Button } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import DragContainer from './imageView';
import add from 'ADMIN_ASSETS/images/add.png';
import minus from 'ADMIN_ASSETS/images/minus.png';
import right from 'ADMIN_ASSETS/images/right.png';
import left from 'ADMIN_ASSETS/images/left.png';

@observer
class ImageView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstValue: {},
			num: 0,
			width: "auto",
            height: 300,
            rot: 0,
            px: 0,
            py: 100,
            isDrag: false
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
    imgToSize = (size) => {
        var img = document.getElementById('img');
        let {width, height} = this.state;
        if (width === "auto") {
            width = img.width;
        }
        if(height <= 300 && size < 0) {
            return;
        }else {
            this.setState({
                width: width * 1 + size,
                height: (height + size / width * height)
            }, ()=>{
                console.log(this.state.width, this.state.height);
            });
        }
    }
    // 向右转
    rotRight = () => {
        if (this.state.rot < 3) {
            this.setState({
                rot: this.state.rot + 1
              });   
        }else {
            this.setState({
                rot: 0
            });
        }
            
    }
    // 像左转
    rotLeft = () => {
        if(this.state.rot === 0) {
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
    setModal1Visible = () =>{
        this.props.setModal1Visible();
    }

	render() {
        let {source, imageView} = this.props;
        let {width, height, rot} = this.state;
		return (
            <div style={{
                overflow: "hidden",
                position: 'absolute', top: 0, left: 0}}
                onMouseDown={this.fnDown} 
                onMouseMove={this.fnMove} 
                onMouseUp={this.fnUp}
                >
                <Modal
                    title="身份证信息"
                    visible={imageView}
                    onCancel={() => this.setModal1Visible()}
                    style={{
                        width: '550px', 
                        left: this.state.px,
                        top: this.state.py, 
                        position: 'relative'
                    }}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.setModal1Visible}>确定</Button>
                    ]}
                >
                    <Row type="flex" justify="center" className="mb-16">
                        {
                            source ? 
                            <div>
                                <DragContainer style={{width: '500px', height: '400px', position: "relative", overflow: "hidden"}}>
                                    <img id = "img" width = {width} height = {height} src={source} className = {`rot${rot}`}/>
                                </DragContainer>
                                <div style = {{paddingTop: "15px"}}>
                                <Button className="ml-8" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.imgToSize(50)}><img src={add}/></Button>
									<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.imgToSize(-50)}><img src={minus}/></Button>
									<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.rotRight()}><img src={right}/></Button>
									<Button className="ml-16" style={{width: "80px", height: "40px", border: "2px solid #ddd", borderRadius: "5px"}} onClick={() =>this.rotLeft()}><img src={left}/></Button>
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
