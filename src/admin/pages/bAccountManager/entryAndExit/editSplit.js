import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import { homeStore } from 'ADMIN_STORE';
import { safeDiv, safeMul } from 'ADMIN_UTILS/math';
import { createFormField, formLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Icon, Input, InputNumber, message, Row, Select } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;

@observer
class EditSpit extends React.Component {
    constructor(props) {
        super(props);
        const { getFieldDecorator } = this.props.form;
        getFieldDecorator('dunningKeys', { initialValue: [] });
        getFieldDecorator('ZXdunningKeys', { initialValue: [] });
        getFieldDecorator('profitdunningKeys', { initialValue: [] });
        getFieldDecorator('taxdunningKeys', { initialValue: [] });
        getFieldDecorator('DepositFee', { initialValue: 0 });
        getFieldDecorator('RiskFundFee', { initialValue: 0 });
        let url = window.location.href;
        let idCode1 = url.indexOf("=");
        let idCode2 = url.indexOf("&");
        let id = url.substring(idCode1 + 1, idCode2);
        let diffCode = url.lastIndexOf("=");
        let urlDiff = url.substring(diffCode + 1);
        let SplitTm = url.indexOf('SplitTm');
        if (SplitTm) {
            let first = decodeURIComponent(url).indexOf('SplitTm');
            let end = decodeURIComponent(url).lastIndexOf(':');
            this.state = {
                RecordID: id,
                x: urlDiff,
                SplitTm: decodeURIComponent(url).slice(first + 8, end + 3)
            };
        } else {
            this.state = {
                RecordID: id,
                x: urlDiff
            };
        }
    }

    // 拆分到押金
    splitDeposit = (flag) => {
        const { view: { depositShow }, depositDelete, editValue } = this.props.entryAndExitStore;
        const { form: { setFieldsValue } } = this.props;
        window._czc.push(['_trackEvent', '到账/出账', '拆分到押金', '到账/出账_Y结算']);
        if (flag === 'add') {
            if (depositShow === 'block') {
                message.warning("押金只能拆分一次");
            } else {
                depositDelete('block');
                setFieldsValue({
                    DepositFee: 0
                });
                editValue();
            }
        } else {
            depositDelete('none');
            setFieldsValue({
                DepositFee: 0
            });
        }

    }

    // 拆分到风险金
    splitRiskFund = (flag) => {
        const { view: { riskFundShow }, riskFundDelete, editValue } = this.props.entryAndExitStore;
        const { form: { setFieldsValue } } = this.props;
        window._czc.push(['_trackEvent', '到账/出账', '拆分到风险金', '到账/出账_Y结算']);
        if (flag === 'add') {
            if (riskFundShow === 'block') {
                message.warning("风险金只能拆分一次");
            } else {
                riskFundDelete('block');
                setFieldsValue({
                    RiskFundFee: 0
                });
                editValue();
            }
        } else {
            riskFundDelete('none');
            setFieldsValue({
                RiskFundFee: 0
            });
        }
    }

    // 拆分到催账单
    splitDunning = () => {
        window._czc.push(['_trackEvent', '到账/出账', '拆分到催账单', '到账/出账_Y结算']);
        const { setdunning } = this.props.entryAndExitStore;
        const { setFieldsValue } = this.props.form;
        setdunning(setFieldsValue);
    }

    // 催账单明细删除
    dunningDelete = (k) => {
        window._czc.push(['_trackEvent', '到账/出账', '催账单明细删除', '到账/出账_Y结算']);
        const { dunningDelete } = this.props.entryAndExitStore;
        const { setFieldsValue } = this.props.form;
        dunningDelete(k, setFieldsValue);
    }

    // 拆分到zx模式
    splitZX = () => {
        window._czc.push(['_trackEvent', '到账/出账', '拆分到zx模式', '到账/出账_Y结算']);
        const { ZXsetdunning } = this.props.entryAndExitStore;
        const { setFieldsValue } = this.props.form;
        ZXsetdunning(setFieldsValue);
    }

    // zx明细删除
    ZXdunningDelete = (k) => {
        window._czc.push(['_trackEvent', '到账/出账', 'zx明细删除', '到账/出账_Y结算']);
        const { ZXdunningDelete } = this.props.entryAndExitStore;
        const { setFieldsValue } = this.props.form;
        ZXdunningDelete(k, setFieldsValue);
    }

    // 拆分到利润
    profit = () => {
        window._czc.push(['_trackEvent', '到账/出账', '拆分到利润', '到账/出账_Y结算']);
        const { profitsetdunning } = this.props.entryAndExitStore;
        const { setFieldsValue } = this.props.form;
        profitsetdunning(setFieldsValue);
    }

    // profit明细删除
    profitdunningDelete = (k) => {
        window._czc.push(['_trackEvent', '到账/出账', 'profit明细删除', '到账/出账_Y结算']);
        const { profitdunningDelete } = this.props.entryAndExitStore;
        const { setFieldsValue } = this.props.form;
        profitdunningDelete(k, setFieldsValue);
    }

    // 拆分到退税
    tax = () => {
        window._czc.push(['_trackEvent', '到账/出账', '拆分到退税', '到账/出账_Y结算']);
        const { taxsetdunning } = this.props.entryAndExitStore;
        const { setFieldsValue } = this.props.form;
        taxsetdunning(setFieldsValue);
    }

    // tax明细删除
    taxdunningDelete = (k) => {
        window._czc.push(['_trackEvent', '到账/出账', 'tax明细删除', '到账/出账_Y结算']);
        const { taxdunningDelete } = this.props.entryAndExitStore;
        const { setFieldsValue } = this.props.form;
        taxdunningDelete(k, setFieldsValue);
    }

    // 押金列表展示
    getDeposit = () => {
        const { view: { DepositAmt, depositShow, edit, dele }, depositDelete } = this.props.entryAndExitStore;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 13 }
        };
        return (
            <Row style={{ display: depositShow }} >
                <Col span={14} style={{ paddingTop: "20px", marginLeft: "70px", border: "1px solid #aaa", marginBottom: "20px" }}>
                    <Row >
                        <Col span={12} >
                            <FormItem {...formItemLayout} label="押金" className="mb-8">
                                {getFieldDecorator('DepositFee', {
                                    initialValue: Math.abs(safeDiv(DepositAmt, 100)),
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }]
                                })(<InputNumber disabled={edit} style={{ width: "100%" }} min={0} className="inputbgc" maxLength={15} />)}
                            </FormItem>
                        </Col>
                        <Col span={1} >
                            <FormItem {...formItemLayout}>元</FormItem>
                        </Col>
                        {
                            dele &&
                            <Icon type="close" onClick={() => this.splitDeposit('delete')} style={{ fontSize: 26, color: '#aaa', cursor: "pointer", position: "absolute", top: "0px", right: "10px" }} />
                        }
                    </Row>
                </Col>
            </Row>
        );
    }

    // 风险金列表展示
    getRiskFund = () => {
        const { view: { RiskFundFee, riskFundShow, edit, dele }, riskFundDelete } = this.props.entryAndExitStore;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 13 }
        };
        console.log('depositShow', riskFundShow);
        return (
            <Row style={{ display: riskFundShow }} >
                <Col span={14} style={{ paddingTop: "20px", marginLeft: "70px", border: "1px solid #aaa", marginBottom: "20px" }}>
                    <Row >
                        <Col span={12} >
                            <FormItem {...formItemLayout} label="风险金" className="mb-8">
                                {getFieldDecorator('RiskFundFee', {
                                    initialValue: Math.abs(safeDiv(RiskFundFee, 100)),
                                    rules: [{
                                        required: true,
                                        message: '必填'
                                    }]
                                })(<InputNumber disabled={edit} style={{ width: "100%" }} min={0} className="inputbgc" maxLength={15} />)}
                            </FormItem>
                        </Col>
                        <Col span={1} >
                            <FormItem {...formItemLayout}>元</FormItem>
                        </Col>
                        {
                            dele &&
                            <Icon type="close" onClick={() => this.splitRiskFund('delete')} style={{ fontSize: 26, color: '#aaa', cursor: "pointer", position: "absolute", top: "0px", right: "10px" }} />
                        }
                    </Row>
                </Col>
            </Row>
        );
    }

    // 催账单列表展示
    getDunning = () => {
        const { getFieldDecorator } = this.props.form;
        const { companyList } = this.props.globalStore;
        const { view: { edit, dunningKeys, SplitDetailList, dele } } = this.props.entryAndExitStore;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 13 }
        };
        return dunningKeys.map((k, index) => {
            return (<div key={index} style={{ marginBottom: "20px" }}>
                <Row>
                    <Col span={14} style={{ paddingTop: "20px", marginLeft: "70px", border: "1px solid #aaa", borderBottom: "none" }}>
                        <Row >
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="企业名称">
                                    {getFieldDecorator(`EntId_${k}`, {
                                        initialValue: SplitDetailList.length - 1 >= k ? toJS(SplitDetailList)[k].EntId : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }]
                                    })(
                                        <Select style={{ width: "100%" }} showSearch
                                            disabled={edit}
                                            allowClear={true}
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {
                                                companyList.length > 0 ? companyList.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.EntId}>{item.EntShortName}</Option>
                                                    );
                                                }) : null
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ position: "relative" }}>
                                <FormItem {...formItemLayout} label="月份" className="mb-8">
                                    {getFieldDecorator(`DunningMonth_${k}`, {
                                        initialValue: SplitDetailList.length - 1 >= k ? moment(toJS(SplitDetailList)[k].MonthDate) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }]
                                    })(<MonthPicker disabled={edit} style={{ width: "100%" }} className="inputbgc" maxLength={15} />)}
                                </FormItem>
                                {
                                    dele &&
                                    <Icon type="close" onClick={() => { this.dunningDelete(k); }} style={{ fontSize: 26, color: '#aaa', cursor: "pointer", position: "absolute", top: "0px", right: "10px" }} />
                                }
                            </Col>

                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={14} style={{ marginLeft: "70px", borderLeft: "1px solid #aaa", borderRight: "1px solid #aaa" }}>
                        <Row>
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="周薪" className="mb-8">
                                    {getFieldDecorator(`WeekBill_${k}`, {
                                        initialValue: SplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(SplitDetailList)[k].WeekBill, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="月薪" className="mb-8">
                                    {getFieldDecorator(`MonthBill_${k}`, {
                                        initialValue: SplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(SplitDetailList)[k].MonthBill, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col span={14} style={{ marginLeft: "70px", border: "1px solid #aaa", borderTop: "none" }}>
                        <Row >
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="服务费" className="mb-8">
                                    {getFieldDecorator(`AgentFee_${k}`, {
                                        initialValue: SplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(SplitDetailList)[k].AgentBill, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="平台费" className="mb-8">
                                    {getFieldDecorator(`PlatformFee_${k}`, {
                                        initialValue: SplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(SplitDetailList)[k].PlatformBill, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>);
        });
    }

    // ZX模式列表展示
    getZX = () => {
        const { getFieldDecorator } = this.props.form;
        const { companyList } = this.props.globalStore;
        const { view: { edit, ZXdunningKeys, ZXSplitDetailList, dele } } = this.props.entryAndExitStore;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 13 }
        };
        return ZXdunningKeys.map((k, index) => {
            return (<div key={index} style={{ marginBottom: "20px" }}>
                <Row>
                    <Col span={14} style={{ paddingTop: "20px", marginLeft: "70px", border: "1px solid #aaa", borderBottom: "none" }}>
                        <Row >
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="企业名称">
                                    {getFieldDecorator(`CompanyId_${k}`, {
                                        initialValue: ZXSplitDetailList.length - 1 >= k ? toJS(ZXSplitDetailList)[k].EntId : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }]
                                    })(
                                        <Select style={{ width: "100%" }} showSearch
                                            disabled={edit}
                                            allowClear={true}
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {
                                                companyList.length > 0 ? companyList.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.EntId}>{item.EntShortName}</Option>
                                                    );
                                                }) : null
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ position: "relative" }}>
                                <FormItem {...formItemLayout} label="月份" className="mb-8">
                                    {getFieldDecorator(`Month_${k}`, {
                                        initialValue: ZXSplitDetailList.length - 1 >= k ? moment(toJS(ZXSplitDetailList)[k].MonthDate) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }]
                                    })(<MonthPicker disabled={edit} style={{ width: "100%" }} className="inputbgc" maxLength={15} />)}
                                </FormItem>
                                {
                                    dele &&
                                    <Icon type="close" onClick={() => { this.ZXdunningDelete(k); }} style={{ fontSize: 26, color: '#aaa', cursor: "pointer", position: "absolute", top: "0px", right: "10px" }} />
                                }
                            </Col>

                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={14} style={{ marginLeft: "70px", borderLeft: "1px solid #aaa", borderRight: "1px solid #aaa" }}>
                        <Row>
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="X-工资" className="mb-8">
                                    {getFieldDecorator(`XSalary_${k}`, {
                                        initialValue: ZXSplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(ZXSplitDetailList)[k].XSalary, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="X-社保" className="mb-8">
                                    {getFieldDecorator(`XSocial_${k}`, {
                                        initialValue: ZXSplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(ZXSplitDetailList)[k].XSocial, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col span={14} style={{ marginLeft: "70px", borderLeft: "1px solid #aaa", borderRight: "1px solid #aaa" }}>
                        <Row >
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="X-管理费" className="mb-8">
                                    {getFieldDecorator(`XManage_${k}`, {
                                        initialValue: ZXSplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(ZXSplitDetailList)[k].XManage, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="X-招聘费" className="mb-8">
                                    {getFieldDecorator(`XRecruit_${k}`, {
                                        initialValue: ZXSplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(ZXSplitDetailList)[k].XRecruit, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col span={14} style={{ marginLeft: "70px", border: "1px solid #aaa", borderTop: "none" }}>
                        <Row >
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="X-自离工资" className="mb-8">
                                    {getFieldDecorator(`XLeave_${k}`, {
                                        initialValue: ZXSplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(ZXSplitDetailList)[k].XLeave, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formItemLayout} label="X-其他" className="mb-8">
                                    {getFieldDecorator(`XOther_${k}`, {
                                        initialValue: ZXSplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(ZXSplitDetailList)[k].XOther, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </div>);
        });
    }

    // profit列表展示
    getprofit = () => {
        const { getFieldDecorator } = this.props.form;
        const { companyList } = this.props.globalStore;
        const { view: { edit, profitdunningKeys, ProfitSplitDetailList, dele } } = this.props.entryAndExitStore;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 13 }
        };
        return profitdunningKeys.map((k, index) => {
            return (<div key={index} style={{ marginBottom: "20px" }}>
                <Row>
                    <Col span={14} style={{ paddingTop: "20px", marginLeft: "70px", border: "1px solid #aaa", borderBottom: "none" }}>
                        <Row >
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="企业名称">
                                    {getFieldDecorator(`EntIdP_${k}`, {
                                        initialValue: ProfitSplitDetailList.length - 1 >= k ? toJS(ProfitSplitDetailList)[k].EntId : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }]
                                    })(
                                        <Select style={{ width: "100%" }} showSearch
                                            disabled={edit}
                                            allowClear={true}
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {
                                                companyList.length > 0 ? companyList.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.EntId}>{item.EntShortName}</Option>
                                                    );
                                                }) : null
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ position: "relative" }}>
                                <FormItem {...formItemLayout} label="月份" className="mb-8">
                                    {getFieldDecorator(`MonthP_${k}`, {
                                        initialValue: ProfitSplitDetailList.length - 1 >= k ? moment(toJS(ProfitSplitDetailList)[k].Month) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }]
                                    })(<MonthPicker disabled={edit} style={{ width: "100%" }} className="inputbgc" maxLength={15} />)}
                                </FormItem>
                                {
                                    dele &&
                                    <Icon type="close" onClick={() => { this.profitdunningDelete(k); }} style={{ fontSize: 26, color: '#aaa', cursor: "pointer", position: "absolute", top: "0px", right: "10px" }} />
                                }
                            </Col>

                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={14} style={{ marginLeft: "70px", border: "1px solid #aaa", borderTop: "none" }}>
                        <Row>
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="利润" className="mb-8">
                                    {getFieldDecorator(`Profit_${k}`, {
                                        initialValue: ProfitSplitDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(ProfitSplitDetailList)[k].Profit, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </div>);
        });
    }

    // tax列表
    gettax = () => {
        const { getFieldDecorator } = this.props.form;
        const { companyList } = this.props.globalStore;
        const { view: { edit, taxdunningKeys, TaxBackDetailList, dele } } = this.props.entryAndExitStore;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 13 }
        };
        return taxdunningKeys.map((k, index) => {
            return (<div key={index} style={{ marginBottom: "20px" }}>
                <Row>
                    <Col span={14} style={{ paddingTop: "20px", marginLeft: "70px", border: "1px solid #aaa", borderBottom: "none" }}>
                        <Row >
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="企业名称">
                                    {getFieldDecorator(`EntIdT_${k}`, {
                                        initialValue: TaxBackDetailList.length - 1 >= k ? toJS(TaxBackDetailList)[k].EntId : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }]
                                    })(
                                        <Select style={{ width: "100%" }} showSearch
                                            disabled={edit}
                                            allowClear={true}
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {
                                                companyList.length > 0 ? companyList.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item.EntId}>{item.EntShortName}</Option>
                                                    );
                                                }) : null
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ position: "relative" }}>
                                <FormItem {...formItemLayout} label="月份" className="mb-8">
                                    {getFieldDecorator(`MonthT_${k}`, {
                                        initialValue: TaxBackDetailList.length - 1 >= k ? moment(toJS(TaxBackDetailList)[k].Month) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }]
                                    })(<MonthPicker disabled={edit} style={{ width: "100%" }} className="inputbgc" maxLength={15} />)}
                                </FormItem>
                                {
                                    dele &&
                                    <Icon type="close" onClick={() => { this.taxdunningDelete(k); }} style={{ fontSize: 26, color: '#aaa', cursor: "pointer", position: "absolute", top: "0px", right: "10px" }} />
                                }
                            </Col>

                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={14} style={{ marginLeft: "70px", border: "1px solid #aaa", borderTop: "none" }}>
                        <Row>
                            <Col span={12} >
                                <FormItem {...formItemLayout} label="金额" className="mb-8">
                                    {getFieldDecorator(`Tax_${k}`, {
                                        initialValue: TaxBackDetailList.length - 1 >= k ? Math.abs(safeDiv(toJS(TaxBackDetailList)[k].Amt, 100)) : undefined,
                                        rules: [{
                                            required: true,
                                            message: '必填'
                                        }, {
                                            pattern: /(^\d+(\.\d+)?$)/,
                                            message: "请输入正确的金额"
                                        }]
                                    })(<Input disabled={edit} className="inputbgc" maxLength={15} addonAfter="元" />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </div>);
        });
    }

    handleSubmit = (e) => {
        window._czc.push(['_trackEvent', '到账/出账', '确定按钮点击', '到账/出账_Y结算']);
        e.preventDefault();
        const { view: { dunningKeys, ZXdunningKeys, profitdunningKeys, taxdunningKeys, RequestValue }, splitById } = this.props.entryAndExitStore;
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            if (!err) {
                let BillRemindList = dunningKeys.map(num =>
                    ({
                        EntId: values[`EntId_${num}`],
                        DunningMonth: values[`DunningMonth_${num}`] ? values[`DunningMonth_${num}`].format('YYYY-MM') : '',
                        WeekBill: safeMul(values[`WeekBill_${num}`], 100),
                        MonthBill: safeMul(values[`MonthBill_${num}`], 100),
                        AgentFee: safeMul(values[`AgentFee_${num}`], 100),
                        PlatformFee: safeMul(values[`PlatformFee_${num}`], 100)
                    })
                );
                let ZxBillRemindList = ZXdunningKeys.map(num =>
                    ({
                        EntId: values[`CompanyId_${num}`],
                        Month: values[`Month_${num}`] ? values[`Month_${num}`].format('YYYY-MM') : '',
                        XLeave: safeMul(values[`XLeave_${num}`], 100),
                        XManage: safeMul(values[`XManage_${num}`], 100),
                        XOther: safeMul(values[`XOther_${num}`], 100),
                        XRecruit: safeMul(values[`XRecruit_${num}`], 100),
                        XSalary: safeMul(values[`XSalary_${num}`], 100),
                        XSocial: safeMul(values[`XSocial_${num}`], 100)
                    })
                );

                let ProfitList = profitdunningKeys.map(num =>
                    ({
                        EntId: values[`EntIdP_${num}`],
                        Month: values[`MonthP_${num}`] ? values[`MonthP_${num}`].format('YYYY-MM') : '',
                        Profit: safeMul(values[`Profit_${num}`], 100)
                    })
                );

                let TaxBackList = taxdunningKeys.map(num =>
                    ({
                        EntId: values[`EntIdT_${num}`],
                        Month: values[`MonthT_${num}`] ? values[`MonthT_${num}`].format('YYYY-MM') : '',
                        Tax: safeMul(values[`Tax_${num}`], 100)
                    })
                );

                let DepositFee = safeMul(values['DepositFee'], 100);
                let RiskFundFee = safeMul(values['RiskFundFee'], 100);
                let RecordID = Number(this.state.RecordID);
                let param = { BillRemindList, ZxBillRemindList, ProfitList, TaxBackList, RecordID, DepositFee, RiskFundFee };
                let WeekBillCountArr = []; // 周薪总额
                let MonthBillCountArr = []; // 月薪总额
                let AgentFeeCountArr = []; // 中介费总额
                let PlatformFeeCountArr = []; // 平台费总额

                let XLeaveCountArr = [];
                let XManageCountArr = [];
                let XOtherCountArr = [];
                let XRecruitCountArr = [];
                let XSalaryCountArr = [];
                let XSocialCountArr = [];
                // 利润
                let profitBillCountArr = [];

                // 退税
                let taxBillCountArr = [];

                let zCount = 0;
                let zxCount = 0;
                let profitCount = 0;
                let taxCount = 0;

                if (BillRemindList.length > 0) {
                    for (let i = 0; i < BillRemindList.length; i++) {
                        let getWeekBillNum = BillRemindList[i].WeekBill;
                        let getMonthBillNum = BillRemindList[i].MonthBill;
                        let getAgentFeeNum = BillRemindList[i].AgentFee;
                        let getPlatformFeeNum = BillRemindList[i].PlatformFee;
                        WeekBillCountArr.push(getWeekBillNum);
                        MonthBillCountArr.push(getMonthBillNum);
                        AgentFeeCountArr.push(getAgentFeeNum);
                        PlatformFeeCountArr.push(getPlatformFeeNum);
                    }
                    let WeekBillCount = WeekBillCountArr.reduce((total, num) => { return total + num; });
                    let MonthBillCount = MonthBillCountArr.reduce((total, num) => { return total + num; });
                    let AgentFeeCount = AgentFeeCountArr.reduce((total, num) => { return total + num; });
                    let PlatformFeeCount = PlatformFeeCountArr.reduce((total, num) => { return total + num; });
                    zCount = WeekBillCount + MonthBillCount + AgentFeeCount + PlatformFeeCount;
                }

                if (ZxBillRemindList.length > 0) {
                    for (let i = 0; i < ZxBillRemindList.length; i++) {
                        let getXLeaveNum = ZxBillRemindList[i].XLeave;
                        let getXManageNum = ZxBillRemindList[i].XManage;
                        let getXOtherNum = ZxBillRemindList[i].XOther;
                        let getXRecruitNum = ZxBillRemindList[i].XRecruit;
                        let getXSalaryNum = ZxBillRemindList[i].XSalary;
                        let getXSocialNum = ZxBillRemindList[i].XSocial;
                        XLeaveCountArr.push(getXLeaveNum);
                        XManageCountArr.push(getXManageNum);
                        XOtherCountArr.push(getXOtherNum);
                        XRecruitCountArr.push(getXRecruitNum);
                        XSalaryCountArr.push(getXSalaryNum);
                        XSocialCountArr.push(getXSocialNum);
                    }
                    let XLeaveCount = XLeaveCountArr.reduce((total, num) => { return total + num; });
                    let XManageCount = XManageCountArr.reduce((total, num) => { return total + num; });
                    let XOtherCount = XOtherCountArr.reduce((total, num) => { return total + num; });
                    let XRecruitCount = XRecruitCountArr.reduce((total, num) => { return total + num; });
                    let XSalaryCount = XSalaryCountArr.reduce((total, num) => { return total + num; });
                    let XSocialCount = XSocialCountArr.reduce((total, num) => { return total + num; });
                    zxCount = XLeaveCount + XManageCount + XOtherCount + XRecruitCount + XSalaryCount + XSocialCount;
                }

                if (ProfitList.length > 0) {
                    for (let i = 0; i < ProfitList.length; i++) {
                        let getProfitBillNum = ProfitList[i].Profit;
                        profitBillCountArr.push(getProfitBillNum);
                    }
                    profitCount = profitBillCountArr.reduce((total, num) => { return total + num; });
                }

                if (TaxBackList.length > 0) {
                    for (let i = 0; i < TaxBackList.length; i++) {
                        let gettaxNum = TaxBackList[i].Tax;
                        taxBillCountArr.push(gettaxNum);
                    }
                    taxCount = taxBillCountArr.reduce((total, num) => { return total + num; });
                }


                let SumAccount = 0;
                SumAccount = DepositFee + RiskFundFee + zCount + zxCount + profitCount + taxCount;
                // console.log(SumAccount, DepositFee, RiskFundFee, zCount, zxCount, profitCount, taxCount);
                // console.log(safeMul(RequestValue.Amount, 100));
                if (SumAccount === safeMul(RequestValue.Amount, 100)) {
                    splitById(param);
                } else {
                    message.error("金额不一致，请核对后提交!");
                    SumAccount = 0;
                }
            }
        });

    }

    // 取消 返回上一个页面
    handleFormReset = () => {
        homeStore.handleTabOperate('close');
        this.props.entryAndExitStore.getList();
    }

    // 审核通过
    pass = ({ status = 2, SplitTm = this.state.SplitTm }) => {
        window._czc.push(['_trackEvent', '到账/出账', '审核通过', '到账/出账_Y结算']);
        const { audit, getList } = this.props.entryAndExitStore;
        audit(status, SplitTm, () => {
            homeStore.handleTabOperate('close');
            getList();
        });
    }
    // 审核不通过
    failed = ({ status = 3, SplitTm = this.state.SplitTm }) => {
        window._czc.push(['_trackEvent', '到账/出账', '审核不通过', '到账/出账_Y结算']);
        const { audit, getList } = this.props.entryAndExitStore;
        audit(status, SplitTm, () => {
            homeStore.handleTabOperate('close');
            getList();
        });
    }

    render() {
        const { view: { AuditValue: { Remark }, AuditStatus, SplitSts, hideSpl, OPType }, editValue, getRemark } = this.props.entryAndExitStore;
        const RemarkformItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 12 }
        };

        return (
            <div>
                {
                    this.state.x === ("check") && AuditStatus !== 1 ?
                        <div>
                            <FormItem {...RemarkformItemLayout}
                                label="备注">
                                <Input.TextArea resize="none" disabled={true} className="inputbgc" rows={4} value={Remark}></Input.TextArea>
                            </FormItem>
                        </div> : null
                }
                {
                    !hideSpl && this.getDeposit()
                }
                {
                    !hideSpl && this.getRiskFund()
                }
                {
                    !hideSpl && this.getDunning()
                }

                {
                    !hideSpl && this.getZX()
                }

                {
                    !hideSpl && this.getprofit()
                }

                {
                    !hideSpl && this.gettax()
                }

                {
                    ((this.state.x === ("check") && SplitSts === 2 && AuditStatus === 1 && !hideSpl) || this.state.x === ("split")) ?
                        <div>
                            <Row>
                                <Col offset={1} style={{ marginBottom: "20px" }}>
                                    <Button type="primary" ghost onClick={() => this.splitDeposit('add')}>拆分到押金</Button>
                                    <Button type="primary" className='ml-8' ghost onClick={() => this.splitRiskFund('add')}>拆分到风险金</Button>
                                    <Button type="primary" className="ml-8" ghost onClick={this.splitDunning}><Icon type="plus" style={{ fontSize: 16, color: '#08c' }} />拆分到Z模式</Button>
                                    <Button type="primary" className="ml-8" ghost onClick={this.splitZX}><Icon type="plus" style={{ fontSize: 16, color: '#08c' }} />拆分到ZX模式</Button>
                                    {
                                        OPType === 2 && <Button type="primary" className="ml-8" ghost onClick={this.profit}><Icon type="plus" style={{ fontSize: 16, color: '#08c' }} />拆分到利润</Button>
                                    }
                                    {
                                        OPType === 2 && <Button type="primary" className="ml-8" ghost onClick={this.tax}><Icon type="plus" style={{ fontSize: 16, color: '#08c' }} />拆分到退税</Button>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={5}>
                                    {
                                        this.state.x === ("check") && SplitSts === 2 && AuditStatus === 1 &&
                                        <Button type="primary" onClick={() => { editValue(); window._czc.push(['_trackEvent', '到账/出账', '编辑拆分', '到账/出账_Y结算']); }}>编辑拆分</Button>
                                    }
                                    <Button type="primary" className="ml-8" onClick={this.handleSubmit}>确定</Button>
                                    <Button className="primary ml-8" onClick={this.handleFormReset}>返回</Button>
                                </Col>
                            </Row>
                        </div>
                        : null
                }
                {
                    (this.state.x === ("check") && AuditStatus !== 1) ?
                        <Row>
                            <Col offset={1}>
                                <Button className="ml-8" type="primary" onClick={this.handleFormReset}>返回</Button>
                            </Col>
                        </Row> : null
                }

                {
                    this.state.x === ("examined") ?
                        <div>
                            <FormItem {...RemarkformItemLayout} label={<span><span style={{ color: "red" }}>* </span>备注</span>}>
                                <Input.TextArea resize="none" maxLength={300} value={Remark} onChange={(e) => { getRemark(e.target.value); }} disabled={false} rows={4}></Input.TextArea>
                            </FormItem>
                            <Row>
                                <Col offset={5} style={{ marginBottom: "20px" }}>
                                    <Button type="primary" onClick={this.pass}>通过</Button>
                                    <Button className="ml-8" type="primary" onClick={this.failed}>不通过</Button>
                                    <Button className="ml-8" onClick={this.handleFormReset}>返回</Button>
                                </Col>
                            </Row>
                        </div> : null
                }
            </div>
        );

    }
}

export default Form.create({
    mapPropsToFields: props => createFormField(props.entryAndExitStore.view.tempValue),
    onValuesChange: (props, changeValues, allValues) => props.entryAndExitStore.handleBillFormValuesChange(allValues)
})(EditSpit);