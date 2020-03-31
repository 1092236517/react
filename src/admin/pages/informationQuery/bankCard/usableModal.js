import React from 'react';
import { Modal } from 'antd';
import { observer, inject } from 'mobx-react';
import 'ADMIN_ASSETS/less/pages/listManager.less';

@inject('bankCardStore')
@observer
class UsableModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ModalText: '您确定要将这张可用的银行卡设为不可用吗？',
			confirmLoading: false
		};
	}

	handleOk = () => {
		this.props.bankCardStore.modifyBankCardStatus();
	}

	handleCancel = () => {
		this.props.bankCardStore.setVisible('usableVisible', false);
	}

	render() {
		const { view } = this.props.bankCardStore;
		const { visible, confirmLoading, ModalText } = this.state;
		const { usableVisible, modalLoading } = view;
		return (
			<div>
				<Modal title="设为不可用"
					visible={usableVisible}
					onOk={this.handleOk}
					confirmLoading={confirmLoading}
					onCancel={this.handleCancel}
				>
					<p>{ModalText}</p>
				</Modal>
			</div>
		);
	}
}

export default UsableModal;