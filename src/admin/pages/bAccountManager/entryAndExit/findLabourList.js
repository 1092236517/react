import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import entry_import from 'ADMIN_ASSETS/template/entry_import.xlsx';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { createFormField, formItemLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, Form, Icon, Input, Row, Select, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';
import RightBox from './rightBox';

const Option = Select.Option;
const FormItem = Form.Item;
@observer
class FindLabourList extends React.Component {
    constructor(props) {
        super(props);
        let diffCode = window.location.href.lastIndexOf("=");
        let urlDiff = window.location.href.substring(diffCode + 1);
        this.state = {
            x: urlDiff
        };
    }
    componentDidMount() {
        const { view: { isDirty }, getByID, getAccoutInfoBySPID } = this.props.entryAndExitStore;
        if (!isDirty) {
            let url = window.location.href;
            let idCode1 = url.indexOf("=");
            let idCode2 = url.indexOf("&");
            let id = url.substring(idCode1 + 1, idCode2);
            if (url.indexOf("id") !== -1) {
                let data = getByID(id);
                data.then((res) => {
                    let Data = res.RecordList[0];
                    this.props.entryAndExitStore.view.LabourInfo = {
                        SPID: Data.SPID,
                        SPShortName: Data.SPShortName,
                        SPFullName: Data.SPFullName,
                        SPContactMobile: Data.SPContactMobile,
                        SPContactName: Data.SPContactName
                    };
                    this.props.entryAndExitStore.getAccoutInfoBySPID(Data.SPID);
                });
            }
        }
    }

    getSpId = (value, name) => {
        this.props.entryAndExitStore.getAccoutInfoBySPID(
            value,
            name.props.children,
            name.props['data-spfullname'],
            name.props['data-ctctmobile'],
            name.props['data-ctctname']
        );
    }

    importPreview = (e) => {
        e.preventDefault();
        window._czc.push(['_trackEvent', '到账/出账', '上传文件', '到账/出账_Y结算']);
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { importPreview } = this.props.entryAndExitStore;
            importPreview();
        });
    }

    resetImport = (e) => {
        e.preventDefault();
        this.props.entryAndExitStore.resetImport();
    }
    render() {
        const content = (
            <div>
                <p>1.可不导入文件，手工录入信息 </p>
                <p>2.导入模板excel中银行打款时间需要为日期格式，其他内容为文本格式</p>
                <p>3.导入模板内容为必填项，其他表头内容不导入</p>
            </div>
        );
        const {
            view: {
                LabourInfo: { SPID, SPFullName, SPShortName, SPContactName, SPContactMobile },
                FindValue: { DepositAmount, Balance },
                excelValue: { ImportFile, SheetName },
                dis, rightBoxVis, flag, ExcelData: { PayBankNameExc, RecvBankNameExc, SPNameExc }
            },
            setImportFile, ExcelRecordList
        } = this.props.entryAndExitStore;
        const { laborList } = this.props.globalStore;
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                {
                    this.state.x === "apply" ?
                        <div className="mouldHover">
                            <div>
                                <Tooltip placement="topLeft"
                                    title={content} arrowPointAtCenter>
                                    {/* <Button className="questionMark">？</Button> */}
                                    <a href={entry_import} className='ml-8' download='到账出账模板.xlsx' onClick={() => { window._czc.push(['_trackEvent', '到账/出账', '模板下载', '到账/出账_Y结算']); }}>模板下载</a>
                                </Tooltip>
                            </div>
                            <Form onSubmit={this.importPreview}>
                                <Row gutter={15} type="flex" justify="start">
                                    <Col span={6}>
                                        <FormItem {...formItemLayout} label='excel文件'>
                                            {getFieldDecorator('ImportFile', {
                                                rules: [{ required: true, message: '请上传文件' }],
                                                //  AliyunUpload封装时可能未考虑到必填属性。通过normalize强行设置AliyunUpload值
                                                normalize: () => (ImportFile.length > 0 && ImportFile[0].status == 'done' ? 'img' : '')
                                            })(
                                                <AliyunUpload
                                                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                    listType="text"
                                                    oss={uploadRule.entryImp}
                                                    maxNum={1}
                                                    previewVisible={false}
                                                    defaultFileList={ImportFile}
                                                    uploadChange={(id, list) => {
                                                        setImportFile(id, list);
                                                    }}>
                                                    <Button><Icon type="upload" />点击上传</Button>
                                                </AliyunUpload>
                                            )}
                                        </FormItem>
                                    </Col>

                                    <Col span={6}>
                                        <FormItem {...formItemLayout} label='默认导入'>
                                            {getFieldDecorator('SheetName', {
                                                rules: [{ required: true, message: '请填写表单名称' }]
                                            })(
                                                <Input maxLength={100} />
                                            )}
                                        </FormItem>
                                    </Col>

                                    <Col span={6} >
                                        <FormItem>
                                            <Button htmlType="submit" type="primary">导入待选框</Button>
                                            <Button type='primary' className='ml-8' onClick={this.resetImport}>取消导入</Button>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            {
                                this.state.x === "apply" && rightBoxVis && !flag && SPNameExc && <p className="labourShow">导入件：{SPNameExc}</p>
                            }
                            选择劳务：
                        <Select showSearch
                                disabled={dis}
                                allowClear={true}
                                placeholder="请选择劳务"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={this.getSpId}
                                value={SPID}
                                style={{ width: 260, marginBottom: "30px" }}
                            >
                                {
                                    laborList.length > 0 ? laborList.map((item, index) => {
                                        return (
                                            <Option
                                                key={index}
                                                value={item.SpId}
                                                data-spfullname={item.SpFullName}
                                                data-spshortname={item.SpShortName}
                                                data-ctctmobile={item.CtctMobile}
                                                data-ctctname={item.CtctName}>
                                                {item.SpShortName}</Option>
                                        );
                                    }) : null
                                }
                            </Select>
                        </div> : null
                }
                {
                    // SPID !== "" ? 
                    <table border="1" className="tableStyle">
                        {
                            this.state.x === "check" || this.state.x === "split" ?
                                <tbody>
                                    <tr className="firstTr">
                                        <td>劳务全称</td>
                                        <td>劳务简称</td>
                                        <td>劳务联系人</td>
                                        <td>联系电话</td>
                                    </tr>
                                    <tr className="secondTr">
                                        <td>{SPFullName}</td>
                                        <td>{SPShortName}</td>
                                        <td>{SPContactName}</td>
                                        <td>{SPContactMobile && SPContactMobile.replace(SPContactMobile.slice(3, 7), '****')}</td>
                                    </tr>
                                </tbody> :
                                <tbody>
                                    <tr className="firstTr">
                                        <td>劳务全称</td>
                                        <td>劳务简称</td>
                                        <td>劳务联系人</td>
                                        <td>联系电话</td>
                                        <td>用户押金</td>
                                        <td>账户余额</td>
                                    </tr>
                                    <tr className="secondTr">
                                        <td>{SPFullName}</td>
                                        <td>{SPShortName}</td>
                                        <td>{SPContactName}</td>
                                        <td>{SPContactMobile}</td>
                                        <td>{convertCentToThousandth(DepositAmount)}</td>
                                        <td>{convertCentToThousandth(Balance)}</td>
                                    </tr>
                                </tbody>
                        }
                    </table>
                    // : null
                }
                {this.state.x === "apply" && rightBoxVis && !flag && <RightBox className="rightBox" {
                    ...this.props.entryAndExitStore
                } />}
            </div>
        );
    }
}


export default Form.create({
    mapPropsToFields: props => createFormField(props.excelValue),
    onValuesChange: (props, changedValues, allValues) => {
        (props.SheetNameValueChange(allValues));
    }
})(FindLabourList);