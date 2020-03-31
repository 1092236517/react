import React from 'react';
import { Modal } from 'antd';
import { observer, inject } from 'mobx-react';


@inject('listStore')
@observer
class DetailModal extends React.Component {
    // handelSubmit = (e) => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         if (!err) {
    //             this.props.listStore.saveSynch(values.date);
    //             this.props.form.resetFields();
    //         }
    //     });
    // }

    handelOnCancel = () => {
        this.props.setSynchVisible(false);
    }

    render() {
        const {
            synchVisible, synchVisibleValue
        } = this.props;
        return (
            <Modal
                visible={synchVisible}
                title="订单详情"
                onCancel={this.handelOnCancel}
                footer={null}
            >
                <div>{synchVisibleValue}</div>
            </Modal>
        );
    }
}
export default DetailModal;
