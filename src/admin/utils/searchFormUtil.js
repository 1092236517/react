import { Form } from 'antd';
import { isObservableArray, toJS } from 'mobx';

export const getFormOptLayout = (itemCount) => {
    // 搜索条件的个数
    return {
        lg: { span: (4 - itemCount % 4) * 6 },
        md: { span: (3 - itemCount % 3) * 8 },
        sm: { span: (2 - itemCount % 2) * 12 }
    };
};

export const formItemLayout = {
    labelCol: { span: 8, offset: 0 },
    wrapperCol: { span: 16, offset: 0 }
};

export const formLayout = {
    sm: { span: 12, offset: 0 },
    md: { span: 8, offset: 0 },
    lg: { span: 6, offset: 0 }
};

export const createFormField = (fields, withValue) => {
    return Object.entries(fields || {}).reduce((pre, cur) => {
        pre[cur[0]] = Form.createFormField(withValue ? isObservableArray(cur[1].value) ? toJS(cur[1]) : cur[1] : { value: isObservableArray(cur[1]) ? toJS(cur[1]) : cur[1] });
        return pre;
    }, {});
};