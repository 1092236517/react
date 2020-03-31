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
			ModalText: '您确定要将这张可用的银行卡设为可用吗？',
			confirmLoading: false
		};
	}

	handleOk = () => {
		this.props.bankCardStore.modifyBankCardStatus();
	}

	handleCancel = () => {
		this.props.bankCardStore.setVisible('unusableVisible', false);
	}

	render() {
		const { view } = this.props.bankCardStore;
		const { confirmLoading, ModalText } = this.state;
		const { unusableVisible, modalLoading } = view;
		return (
			<div>
				<Modal title="设为可用"
					visible={unusableVisible}
					onOk={this.handleOk}
					confirmLoading={modalLoading}
					onCancel={this.handleCancel}
				>
					<p>{ModalText}</p>
				</Modal>
			</div>
		);
	}
}

export default UsableModal;