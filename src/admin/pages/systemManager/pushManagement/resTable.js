import React, { Component, Fragment } from 'react';
import { Table, message } from 'antd';
import { Link } from 'react-router-dom';
import { expBillDetail } from 'ADMIN_SERVICE/ZXX_WeekReturnFee';
import { disableOpt, tableSrcRender, tableDateTimeRender, tableDateRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt, generateColInfo } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import ImageView from './showImage';
import ShowForMessaegPush from './showForMessaegPush';

class ResTable extends Component {
    showAuditModal = (batchID) => {
        const { setSelectRowKeys, showAuditModal } = this.props;
        setSelectRowKeys([batchID]);
        showAuditModal();
    }
    constructor(props) {
        super(props);
        this.state = {
            imageView: false,
            imageSource: '',
            pushInfo: '',
            contentView: false
        };
    }
    preModifyNoticeBean = (record) => {
        this.props.modifyNoticeOpt(record);
        window._czc.push(['_trackEvent', '公告推送管理', '修改', '公告推送管理_N非结算']);
    }
    // 查看图片
    showImage = (value) => {
        this.setState({
            imageSource: value,
            imageView: true
        });
    }
    setModal1Visible = () => {
        this.setState({
            imageSource: '',
            imageView: false
        });
    }
    bankCardAuditModal = () => {
        this.setState({
            imageSource: '',
            imageView: false
        });
    }
    preShowPushMessage = (record) => {
        this.setState({
            pushInfo: record.MsgText,
            contentView: true
        });
        window._czc.push(['_trackEvent', '公告推送管理', '查看', '公告推送管理_N非结算']);
    };
    setInfoModalVisible = () => {
        let { contentView } = this.state;
        this.setState({
            contentView: !contentView
        });
    };
    render() {
        const { seeDetailX, exportDetailX } = resId.weekReturnFee.bill;
        const { receiveMembertModal } = this.props;
        const columnsMap = [
            ['DataId', '序号', undefined, 100],
            ['Title', '标题'],
            ['MsgURL', '图片', (text, record) => {
                return <div onClick={() => this.showImage(text)}><img style={{ width: "84px", height: "46px" }} src={text} /></div>;
            }],
            ['BeginDt', '开始时间', tableDateRender],
            ['EndDt', '结束时间', tableDateRender, 220],
            ['Enable', '是否禁用', disableOpt, 80],
            ['ReceiveTyp', '接收会员', (text, record) => {
                return (
                    <Fragment>
                        {text === 3 ? '全部会员' : ''}
                        {
                            <a href='javascript:;' onClick={() => { receiveMembertModal(record.DataId); window._czc.push(['_trackEvent', '公告推送管理', '点击接收会员', '公告推送管理_N非结算']); }}>{text === 1 ? '查看' : text === 2 ? ' 查看' : ''}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
                        }
                    </Fragment>
                );

            }],
            ['Operator', '操作人'],
            ['OperatTm', '操作时间', tableDateRender],
            ['MsgText', '推送文案', (text, record) => <a href='javascript:;' onClick={this.preShowPushMessage.bind(this, record)}>查看</a>],
            ['ExportData', '操  作', (text, record) => <a href='javascript:;' onClick={this.preModifyNoticeBean.bind(this, record)}>修改</a>]
        ];

        const {
            tableInfo: {
                dataList, total, loading, selectedRowKeys
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            setSelectRowKeys
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);
        let { imageSource, imageView, pushInfo, contentView } = this.state;
        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='DataId'
                    scroll={{ x: width, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        current,
                        pageSize,
                        total,
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        },
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        }
                    }}
                    loading={loading} >
                </Table>
                {
                    imageView &&
                    <ImageView setModal1Visible={this.setModal1Visible.bind(this)} imageView source={imageSource} />
                }
                {contentView && <ShowForMessaegPush setInfoModalVisible={this.setInfoModalVisible} pushInfo={pushInfo} contentView />}
            </div>
        );
    }
}

export default ResTable;