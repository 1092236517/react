import React from 'react';
import {Modal, Button, Row, Form, Input, message} from 'antd';
import LazyLoadMap from './LazyLoadMap';

const FormItem = Form.Item;

class EnterpriseMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: this.props.initPoi.searchKey || '',
            searchResult: '',
            overlays: [],
            longlat: this.props.initPoi.longlat || '',
            clockLonglat: this.props.initPoi.clockLonglat || '',
            clockRadius: this.props.initPoi.clockRadius || ''
        };
        this.map = '';
        this.defaultCircle = '';
    }

    componentDidMount() {
        LazyLoadMap({needDraw: true}).then(() => {
            this.map = new window.BMap.Map("baiduMap");
            window.cc = this.map;
            // enable mouse scroller
            this.map.enableScrollWheelZoom(true);
            // enable controller component
            let top_left_control = new window.BMap.ScaleControl({anchor: window.BMAP_ANCHOR_TOP_LEFT});
            let top_left_navigation = new window.BMap.NavigationControl();
            this.map.addControl(top_left_control);
            this.map.addControl(top_left_navigation);

            var styleOptions = {
                strokeColor: "purple", // 边线颜色。
                fillColor: "purple", // 填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 1, // 边线的宽度，以像素为单位。
                strokeOpacity: 0.6,	// 边线透明度，取值范围0 - 1。
                fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
                strokeStyle: 'dashed' // 边线的样式，solid或dashed。
            };
            // 实例化鼠标绘制工具
            var drawingManager = new window.BMapLib.DrawingManager(this.map, {
                isOpen: false, // 是否开启绘制模式
                enableDrawingTool: this.props.enableEdit, // 是否显示工具栏
                enableCalculate: false,
                drawingToolOptions: {
                    anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 位置
                    offset: new window.BMap.Size(5, 5), // 偏离值
                    drawingModes: [window.BMAP_DRAWING_CIRCLE]
                },
                circleOptions: styleOptions // 圆的样式
            });
            drawingManager.addEventListener('overlaycomplete', (e) => {
                if (this.state.overlays.length) {
                    for (let i = 0; i < this.state.overlays.length; i++) {
                        this.map.removeOverlay(this.state.overlays[i]);
                    }
                }
                this.map.removeOverlay(this.defaultCircle);
                if (Math.ceil(e.overlay.xa) > 10000) {
                    message.error('企业打卡范围半径不能超过10Km, 请重新绘制。');
                    this.setState({
                        overlays: [e.overlay],
                        clockLonglat: '',
                        clockRadius: ''
                    });
                } else {
                    this.setState({
                        overlays: [e.overlay],
                        clockLonglat: e.overlay.point.lng + ',' + e.overlay.point.lat,
                        clockRadius: Math.ceil(e.overlay.xa)
                    });
                }

            });

            // when did mont have the data. init the map
            if (this.state.longlat) {
                let longlat = this.state.longlat.split(',');
                this.map.centerAndZoom(new window.BMap.Point(longlat[0], longlat[1]), 16);
                var marker = new window.BMap.Marker(new window.BMap.Point(longlat[0], longlat[1]));
                this.map.addOverlay(marker);
            } else {
                this.map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11);
            }
            if (this.state.clockLonglat && this.state.clockRadius) {
                let clockLonglat = this.state.clockLonglat.split(',');
                let point = new window.BMap.Point(clockLonglat[0], clockLonglat[1]);
                this.defaultCircle = new window.BMap.Circle(
                    point,
                    this.state.clockRadius,
                    styleOptions
                );
                this.map.addOverlay(this.defaultCircle);
            }
        }, () => {
        });
    }

    handleSearchKeyChange(e) {
        this.setState({
            searchKey: e.target.value
        });
    }

    handleDoSearch() {
        var local = new window.BMap.LocalSearch(this.map, {
            renderOptions: {map: this.map, panel: "mapResult", autoViewport: true},
            onSearchComplete: (results) => {
                if (local.getStatus() == window.BMAP_STATUS_SUCCESS) {
                    // 判断状态是否正确      
                    var s = [];
                    for (var i = 0; i < results.getCurrentNumPois(); i++) {
                        s.push(results.getPoi(i));
                    }
                    if (!s.length) {
                        alert('没有找到该关键字的地点！');
                    }
                    this.setState({
                        searchResult: s
                    });
                }
            },
            onMarkersSet: (pois) => {
                for (let i = 0; i < pois.length; i++) {
                    pois[i].marker.addEventListener('click', (e) => {
                        this.setState({
                            longlat: e.target.point.lng + ',' + e.target.point.lat
                        });
                    });
                }
            },
            onResultsHtmlSet: (e) => {
                let container = e;
                let lis = container.getElementsByTagName('li') || [];
                for (let i = 0; i < lis.length; i++) {
                    lis[i].addEventListener('click', () => {
                        this.setState({
                            longlat: this.state.searchResult[i].point.lng + ',' + this.state.searchResult[i].point.lat
                        });
                    });
                }
            }
        });
        local.search(this.state.searchKey);
    }

    hideModal(value) {
        if (this.props.enableEdit && value === 'ok') {
            if (!this.state.longlat || !this.state.clockLonglat || !this.state.clockRadius) {
                message.error('请通过搜索定位地理位置，并通过划定圆圈，确定打卡范围！');
                return false;
            }
        }
        this.props.closeCall(value, {
            clockLonglat: this.state.clockLonglat,
            clockRadius: this.state.clockRadius,
            longlat: this.state.longlat,
            searchKey: this.state.searchKey
        });
    }

    render() {
        return (
            <div>
                <Modal
                    title={this.props.title || '企业定位'}
                    visible={true}
                    onOk={() => this.hideModal('ok')}
                    onCancel={() => this.hideModal('cancel')}
                    okText="确认"
                    cancelText="取消"
                    width='80%'
                >
                    {<Row>
                        <Form layout="inline">
                            {this.props.enableEdit && <FormItem>
                                <Input type="text" style={{width: '300px'}} placeholder="请输入企业位置"
                                       value={this.state.searchKey} onChange={(e) => this.handleSearchKeyChange(e)}/>
                            </FormItem>}
                            {this.props.enableEdit && <FormItem>
                                <Button htmlType="button" type="primary"
                                        onClick={() => this.handleDoSearch()}>搜索</Button>
                            </FormItem>}
                            <FormItem label={'打卡范围半径（米）'}>
                                <Input type="number" readOnly={true} value={this.state.clockRadius}
                                       placeholder="打卡范围半径"/>
                            </FormItem>
                            <FormItem label={'企业定位'}>
                                <Input type="text" readOnly={true} value={this.state.longlat} placeholder="经纬度"/>
                            </FormItem>
                        </Form>
                        {this.props.enableEdit &&
                        <p className="mt-8 color-danger">温馨提示：1、输入关键词时，请尽量带上区域名称（如：昆山世硕）；2、【手势】【圆圈】工具可在地图拖动和画圆圈功能之间进行切换；3、打卡范围半径请通过<b>地图右上角</b>【圆圈】工具进行划定。鼠标点击处为圆圈范围中心点。
                        </p>}
                    </Row>}
                    <Row className="mt-24">
                        <div style={{
                            width: ((this.props.enableEdit && this.state.searchResult.length) ? '80%' : '100%'),
                            height: '500px',
                            float: 'left'
                        }} id="baiduMap"/>
                        <div style={{
                            width: '20%',
                            height: '500px',
                            float: 'left',
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            display: (this.props.enableEdit && this.state.searchResult.length) ? 'block' : 'none'
                        }} id="mapResult"/>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default EnterpriseMap;