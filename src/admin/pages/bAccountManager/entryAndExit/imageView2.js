import React from 'react';
export default class DragContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            px: 0,
            py: 0,
            isDrag: false
        };
        this.downX = 0;
        this.downY = 0;
    }

    fnDown = event => {
        event.stopPropagation();
        event.preventDefault();
        console.log('------ start drag ------');
        this.setState({
            isDrag: true
        });
        this.downX = event.clientX;
        this.downY = event.clientY;
    };

    fnMove = (event) => {
        event.stopPropagation();
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
        event.stopPropagation();
        event.preventDefault();
        console.log('------ stop drag ------');
        this.setState({
            isDrag: false
        });
    };

    render() {
        return (
            <div style={{ ...this.props.style }}>
                <div style={{
                    left: this.state.px,
                    top: this.state.py,
                    position: 'absolute'
                }} onMouseDown={this.fnDown} onMouseMove={this.fnMove} onMouseUp={this.fnUp}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}