import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Radio, Button, Icon } from 'antd';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import AliyunUpload from 'ADMIN_COMPONENTS/AliyunUpload';
import ImportConditTable from './importConditTable';
import 'ADMIN_ASSETS/less/pages/systemManager.less';
import weekImpTemp from 'ADMIN_ASSETS/template/member_import_notice.xlsx';
class FilterCondit extends Component {
    state = {
        fileList: []
    }

    onChange = e => {
        this.props.receiveMemberTypeOpt(e.target.value);
    };
    render() {
        const {
            setImportFile, setSelectRowKeys, startQuery, setPagination, showAuditModal, memberInfo, infoBean, radioButtonBean, importFile, saveImportContent, backToEditPage
        } = this.props;
        return (
            <div>
                <div className='optItemGroup'>
                    <div className='optItem'>
                        <Radio.Group onChange={this.onChange} value={radioButtonBean.Typ}>
                            <Radio value={1}>表格导入</Radio>
                            <Radio value={2}>条件筛选</Radio>
                            <Radio value={3}>全部在职会员</Radio>
                        </Radio.Group>
                        <a download='会员导入模板.xlsx' href={weekImpTemp} className='ml-32' onClick={() => { window._czc.push(['_trackEvent', '公告推送管理', '模板下载', '公告推送管理_N非结算']); }}>模板下载</a>
                    </div>
                    <div className='optItem'><Button onClick={backToEditPage}>返回</Button> <Button type="primary" onClick={()=>{saveImportContent();window._czc.push(['_trackEvent', '公告推送管理', '提交', '公告推送管理_N非结算']);}}>提交</Button></div>
                </div>

                <div style={{ paddingTop: '1%' }}>
                    {memberInfo.receiveMemberList.length === 0 && <AliyunUpload
                        id={'ImportFile'}
                        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        listType="text"
                        oss={uploadRule.pushMant}
                        maxNum={1}
                        previewVisible={false}
                        defaultFileList={importFile}
                        uploadChange={(id, list) => {
                            console.log(list);
                            setImportFile(id, list);
                        }}>
                        <Button><Icon type="upload" />点击上传</Button>
                    </AliyunUpload>
                    }
                    {
                        memberInfo.receiveMemberList.length > 0 &&
                        <ImportConditTable {...{ setSelectRowKeys, memberInfo, startQuery, setPagination, showAuditModal }} />
                    }
                </div>

            </div>
        );
    }
}


export default FilterCondit;