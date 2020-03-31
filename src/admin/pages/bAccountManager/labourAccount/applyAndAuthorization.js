import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import { tabWrap } from 'ADMIN_PAGES';
import { Button, Col, Form, Input, Row, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { formLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Link, withRouter } from 'react-router-dom';
const info = Modal.info;
const FormItem = Form.Item;

@tabWrap({
    tabName: '单条明细',
    stores: ['labourAccountStore']
})

@inject('labourAccountStore')

@observer
export default class EntryAndExit extends React.Component {
    getSpAccountBillDetail = this.props.labourAccountStore.getSpAccountBillDetail;
    componentDidMount() {
        if (!this.props.labourAccountStore.view.isDirty) {
            let url = window.location.href;
            let idCode = url.indexOf("=");
            let id = url.substring(idCode + 1);
            if (url.indexOf("id") !== -1) {
                this.getSpAccountBillDetail(id);
            }
        }
    }
    render() {
        const {billDetail} = this.props.labourAccountStore.view;
        return <SingleDetail billDetail = {billDetail}/>;
    }
}

@withRouter
@observer
// 详细信息
class SingleDetail extends React.Component {  
    imgOpen = (value) =>{
        if (value) {
            info({content: <img src={value} style={{maxWidth: '100%', maxHeight: '100%'}}/>});
        }
    }

    render () {
        const {SpFullName, SpShortName, CtctName, CtctMobile, TradeTyp, PayBankName, ReceiveBankName, PayUserName, 
            ReceiveUserName, PayBankCardNum, ReceiveBankCardNum, BankOrderId, DealAmt, AuditRemark, EvidenceUrl} = this.props.billDetail;
        let flag = EvidenceUrl && EvidenceUrl.substring(0, 1) !== '/';
        const formItemLayout = {    
            labelCol: { span: 11},
            wrapperCol: { span: 13}
        };
        const RemarkformItemLayout = {
            labelCol: { sm: { span: 2 }},
            wrapperCol: { sm: { span: 6 }}
        };
        return (
            <div>
                <div>
                    <table border = "1" className = "tableStyle">
                        <tbody>
                            <tr className = "firstTr">
                                <td>劳务全称</td>
                                <td>劳务简称</td>
                                <td>劳务联系人</td>
                                <td>联系电话</td>
                            </tr>
                            <tr className = "secondTr">
                                <td>{SpFullName}</td>
                                <td>{SpShortName}</td>
                                <td>{CtctName}</td>
                                <td>{CtctMobile && CtctMobile.replace(CtctMobile.slice(3, 7), '****')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <span style = {{marginTop: "20px", display: "block", fontWeight: 700}}>
                    变动类型: {{1: "账户充值", 2: "账户提现", 3: "押金充值", 4: "押金提现"}[TradeTyp]}
                </span> 
                <Form onSubmit={this.handleFormSubmit}>
                    <Row>
                        <Col span = {7}>
                            <FormItem {...formItemLayout} label="付款银行" className="mb-8">
                                <Input disabled = {true} value = {PayBankName} className = "inputbgc"/>
                            </FormItem>
                        </Col>  
                            <Col span = {7}>
                                <FormItem {...formItemLayout} label="收款银行" className="mb-8">
                                    <Input disabled = {true} value = {ReceiveBankName} className = "inputbgc"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span = {7}>
                                <FormItem {...formItemLayout} label="付款银行账号名" className="mb-8">
                                    <Input disabled = {true} value = {PayUserName} className = "inputbgc"/>
                                </FormItem>
                            </Col>
                            <Col span = {7}>
                                <FormItem {...formItemLayout} label="收款银行账号名" className="mb-8">
                                    <Input disabled = {true} value = {ReceiveUserName} className = "inputbgc"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span = {7}>
                                <FormItem {...formItemLayout} label="付款银行账号" className="mb-8">
                                    <Input disabled = {true} value = {PayBankCardNum && PayBankCardNum.replace(PayBankCardNum.slice(0, PayBankCardNum.length - 6), '****')} className = "inputbgc"/>
                                </FormItem>
                            </Col>
                            <Col span = {7}>
                                <FormItem {...formItemLayout} label="收款银行账号" className="mb-8">
                                    <Input disabled = {true} value = {ReceiveBankCardNum && ReceiveBankCardNum.replace(ReceiveBankCardNum.slice(0, ReceiveBankCardNum.length - 6), '****')} className = "inputbgc"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span = {7}>
                                <FormItem {...formItemLayout} label="银行流水号" className="mb-8">
                                    <Input disabled = {true} value = {BankOrderId} className = "inputbgc"/>
                                </FormItem>
                            </Col>
                            <Col span = {7}>
                                <FormItem {...formItemLayout} label="金额（元）" className="mb-8">
                                    {
                                        DealAmt ? 
                                        <Input disabled = {true} value = { DealAmt / 100 } className = "inputbgc"/> : 
                                        null
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span = {7}>
                                <FormItem {...formItemLayout} label = "上传凭证">
                                { 
                                    flag ? 
                                    <img style = {{width: "150px", height: "auto"}} src = {EvidenceUrl} onClick = {() => {this.imgOpen(EvidenceUrl);}} alt = "这里是一张照片"/> 
                                    : <span>未上传凭证</span>   
                                }
                                </FormItem>
                            </Col>
                        </Row>
                        <div>
                            <FormItem {...RemarkformItemLayout}
                                label="备注">
                                <Input.TextArea resize="none" disabled = {true} className = "inputbgc" rows={4} value = {AuditRemark}></Input.TextArea>
                            </FormItem>
                            <Col {...formLayout}>
                                <Button type = "primary"><Link to = "/bAccountManager/labourAccount">返回</Link></Button>
                            </Col>
                        </div>
                </Form>
            </div>
        );
    }
}