import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	FormGroup,
	Label,
	FormText,
	ButtonGroup,
	ButtonToolbar,
	Badge,
	Row,
	Col,
	Card,
	CardHeader,
	CardBlock,
	Table,
	Pagination,
	PaginationItem,
	PaginationLink,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'C:/www/simarund/node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'C:/www/simarund/node_modules/react-toastify/dist/ReactToastify.css';
import AuthService from '../../../components/AuthService.js';
import withAuth from '../../../components/withAuth.js';
const Auth = new AuthService();

class Lainnya extends Component {
	constructor(props) {
		super(props);
		this.indexN = this.indexN.bind(this);
		this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
		this.fancyTimeFormat = this.fancyTimeFormat.bind(this);
		this.getDataById = this.getDataById.bind(this);

		this.getItem = this.getItem.bind(this);
		this.insertItem = this.insertItem.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.updateItem = this.updateItem.bind(this);

		this.renderInsertButton = this.renderInsertButton.bind(this);
		this.renderDeleteButton = this.renderDeleteButton.bind(this);
		this.renderToolbar = this.renderToolbar.bind(this);
		this.renderInsertModalHeader = this.renderInsertModalHeader.bind(this);

		this.handleOnSelect = this.handleOnSelect.bind(this);
		this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
		this.handleRowDelete = this.handleRowDelete.bind(this);

		this.state = {
			data: undefined,
			selectCount: 0,
			edittedRow: [],
			itemPerPage: 10,
			currentPage: 1,
			showSaveModals: false,
			showDeleteModal: false,
			showResetModal: false,
			savingData: false,
			deletingData: false,
			resettingData: false,
			next: undefined,
			saveToastId: null
		};
	}

	componentDidMount() {
		this.getItem();
	}

	getItem(handleSuccess) {
		Auth.fetch('http://localhost:8000/api/item/', {
			method: 'GET',
			timeout: 5000
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				console.log(data);
				this.setState({
					data: data
				});
				if (handleSuccess !== undefined) {
					handleSuccess();
				}
			});
	}

	insertItem(row) {
		this.setState({
			saveToastId: toast(
				({ closeToast }) => (
					<span>
						<i className="fa fa-circle-o-notch fa-spin" /> Menyimpan data
					</span>
				),
				{ autoClose: false }
			)
		});
		Auth.fetch('http://localhost:8000/api/item/', {
			method: 'POST',
			body: JSON.stringify(row)
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				toast.update(this.state.saveToastId, {
					render: (
						<span>
							<i className="fa fa-check" /> Data berhasil disimpan
						</span>
					),
					type: toast.TYPE.INFO,
					className: 'rotateY animated',
					autoClose: 5000
				});
				this.setState(prevState => ({
					...prevState,
					data: [...prevState.data, data]
				}));
			});
	}

	getDataById(id) {
		for (let i = 0; i < this.state.data.length; i++) {
			if (id == this.state.data[i].id) {
				return this.state.data[i];
			}
		}
	}

	updateItem() {
		this.setState({
			savingData: true
		});
		Auth.fetch(
			'http://localhost:8000/api/item/' +
				this.state.edittedRow
					.map(row => {
						return row.id;
					})
					.slice(','),
			{
				method: 'PUT',
				body: JSON.stringify(this.state.edittedRow)
			}
		)
			.then(response => {
				return response.json();
			})
			.then(data => {
				toast.success(({ closeToast }) => (
					<span>
						<i className="fa fa-check" /> Data berhasil disimpan
					</span>
				));
				this.setState({
					data: data,
					showSaveModals: false,
					edittedRow: [],
					savingData: false
				});
			});
	}

	deleteItem(row) {
		Auth.fetch('http://localhost:8000/api/item/' + row.join(','), {
			method: 'DELETE'
		}).then(response => {
			toast.error(({ closeToast }) => (
				<span>
					<i className="fa fa-trash" /> Data berhasil dihapus
				</span>
			));
			this.setState(prevState => ({
				...prevState,
				deletingData: false,
				showDeleteModal: false,
				data: prevState.data.filter(item => {
					let isFiltered = false;
					for (let i = 0; i < row.length; i++) {
						if (item.id === row[i]) {
							isFiltered = true;
						}
					}
					return !isFiltered;
				})
			}));
		});
	}

	renderInsertButton() {
		return (
			<Button color="primary" className="float-right">
				<i className="fa fa-plus" /> Tambah
			</Button>
		);
	}

	renderDeleteButton() {
		return (
			<Button color="danger" className="float-right">
				<i className="fa fa-trash" /> Hapus
			</Button>
		);
	}

	renderToolbar(props) {
		return (
			<Col md="12">
				<Row>
					{this.props.user.lvl == 'admin' ? (
						<Col xs="12" md="6">
							<ButtonToolbar>
								{props.components.insertBtn}{' '}
								{props.components.deleteBtn}
							</ButtonToolbar>
						</Col>
					) : null}
					<Col xs="12" md="6">
						{props.components.searchField}
					</Col>
				</Row>
				{this.props.user.lvl == 'admin' ? (
					<Row className="mt-2">
						<Col xs="12" md="5">
							<ButtonToolbar>
								<Button
									outline
									color="success"
									disabled={this.state.edittedRow.length < 1}
									onClick={() => {
										this.setState({ showSaveModals: true });
									}}>
									<i className="fa fa-save" /> Simpan Perubahan
								</Button>
								<Button
									outline
									color="secondary"
									disabled={this.state.edittedRow.length < 1}
									onClick={() => {
										this.setState({ showResetModal: true });
									}}>
									<i className="fa fa-undo" /> Reset Perubahan
								</Button>
							</ButtonToolbar>
						</Col>
						<Col md="1" />
					</Row>
				) : null}
			</Col>
		);
	}

	renderInsertModalHeader(closeModal, save) {
		return (
			<div>
				<h6>Tambah Item</h6>
			</div>
		);
	}

	indexN(cell, row, enumObject, index) {
		return index + (this.state.currentPage - 1) * this.state.itemPerPage + 1;
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	convertToString(cell, row) {
		console.log(cell);
		return `${cell}`;
	}

	fancyTimeFormat(cell, row) {
		let time = cell;
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = time % 60;

		var ret = '';

		if (hrs > 0) {
			ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
		}

		ret += '' + mins + ':' + (secs < 10 ? '0' : '');
		ret += '' + secs;
		return ret;
	}

	handleOnSelectAll(isSelected, rows) {
		let count = 0;
		if (isSelected) {
			for (let i = 0; i < rows.length; i++) {
				count++;
			}
		} else {
			for (let i = 0; i < rows.length; i++) {
				count--;
			}
		}
		this.setState(prevState => ({
			...prevState,
			selectCount: prevState.selectCount + count
		}));
	}

	handleOnSelect(row, isSelected, e) {
		if (isSelected) {
			this.setState(prevState => ({
				...prevState,
				selectCount: prevState.selectCount + 1
			}));
		} else {
			this.setState(prevState => ({
				...prevState,
				selectCount: prevState.selectCount - 1
			}));
		}
	}

	handleRowDelete(next, rowKeys) {
		this.setState({
			showDeleteModal: true,
			next: next
		});
	}

	handlePageChange(page, sizePerPage) {
		this.setState({
			currentPage: page
		});
	}

	handleSizePerPageListChange(sizePerPage) {
		this.setState({
			itemPerPage: sizePerPage
		});
	}

	emptyStringValidator(value, row) {
		if (value == '') {
			return 'Field tidak boleh kosong';
		}
		return true;
	}

	render() {
		const options = {
			afterInsertRow: this.insertItem,
			searchPlaceholderText: 'Nama Item',
			exportCSVText: 'Unduh CSV',
			clearSearch: true,
			insertBtn: this.renderInsertButton,
			deleteBtn: this.renderDeleteButton,
			afterDeleteRow: this.deleteItem,
			toolBar: this.renderToolbar,
			handleConfirmDeleteRow: this.handleRowDelete,
			insertModalHeader: this.renderInsertModalHeader,
			page: this.state.currentPage,
			sizePerPage: this.state.itemPerPage,
			onPageChange: this.handlePageChange.bind(this),
			onSizePerPageList: this.handleSizePerPageListChange.bind(this)
		};

		const cellEditProps = {
			mode: 'click',
			blurToSave: true,
			beforeSaveCell: (row, cellName, cellValue) => {
				if (cellValue == '') {
					return false;
				}
				return true;
			},
			afterSaveCell: (row, cellName, cellValue) => {
				this.setState(prevState => ({
					...prevState,
					edittedRow: [...prevState.edittedRow, row]
				}));
			}
		};

		const saveConfirmModal = (
			<SweetAlert
				show={this.state.showSaveModals}
				warning
				showCancel
				confirmBtnText={
					<span>
						<i className="fa fa-save" /> Simpan
					</span>
				}
				cancelBtnText="Batal"
				cancelBtnBsStyle="default"
				onConfirm={this.updateItem}
				onCancel={() => {
					this.setState({ showSaveModals: false });
				}}>
				{this.state.savingData ? (
					<span>
						<i className="fa fa-circle-o-notch fa-spin" /> Menyimpan data
					</span>
				) : (
					'Apakah anda yakin ingin menyimpan data? Data yang telah diubah tidak dapat dikembalikan'
				)}
			</SweetAlert>
		);

		const deleteConfirmModal = (
			<SweetAlert
				show={this.state.showDeleteModal}
				danger
				showCancel
				confirmBtnText={
					<span>
						<i className="fa fa-trash" /> Hapus
					</span>
				}
				confirmBtnBsStyle="danger"
				cancelBtnText="Batal"
				cancelBtnBsStyle="default"
				onConfirm={() => {
					this.setState({
						deletingData: true
					});
					this.state.next();
				}}
				onCancel={() => {
					this.setState({ showDeleteModal: false });
				}}>
				{this.state.deletingData ? (
					<span>
						<i className="fa fa-circle-o-notch fa-spin" /> Menghapus
					</span>
				) : (
					'Apakah anda yakin ingin menghapus data? Data yang telah dihapus tidak dapat dikembalikan'
				)}
			</SweetAlert>
		);

		const resetConfirmModal = (
			<SweetAlert
				show={this.state.showResetModal}
				warning
				showCancel
				confirmBtnText={
					<span>
						<i className="fa fa-undo" /> Reset
					</span>
				}
				confirmBtnBsStyle="warning"
				cancelBtnText="Batal"
				cancelBtnBsStyle="default"
				onConfirm={() => {
					this.setState({
						resettingData: true
					});
					this.getItem(() => {
						this.setState({
							resettingData: false,
							showResetModal: false,
							edittedRow: []
						});
						toast.info(({ closeToast }) => (
							<span>
								<i className="fa fa-check" /> Perubahan telah di-reset
							</span>
						));
					});
				}}
				onCancel={() => {
					this.setState({ showResetModal: false });
				}}>
				{this.state.resettingData ? (
					<span>
						<i className="fa fa-circle-o-notch fa-spin" /> Mereset
						perubahan
					</span>
				) : (
					'Apakah anda yakin ingin mereset data? Data yang telah diubah tidak dapat dikembalikan'
				)}
			</SweetAlert>
		);

		return (
			<div className="animated fadeIn textCenter">
				{saveConfirmModal}
				{deleteConfirmModal}
				{resetConfirmModal}
				<Card>
					<CardHeader>
						<h4>
							<i className="fa fa-ellipsis-h " /> Item Lainnya
						</h4>
					</CardHeader>
					<CardBlock className="card-body">
						{this.state.data === undefined ? (
							<Col className="vertical-align text-center " xs="12">
								<i className="fa fa-circle-o-notch fa-spin " /> Silahkan
								tunggu
							</Col>
						) : (
							<BootstrapTable
								height={400}
								scrollTop={'Top'}
								ref="table"
								hover
								striped
								data={this.state.data}
								version="4"
								cellEdit={
									this.props.user.lvl == 'admin'
										? cellEditProps
										: false
								}
								options={options}
								insertRow
								selectRow={
									this.props.user.lvl == 'admin'
										? {
												mode: 'checkbox',
												onSelectAll: this.handleOnSelectAll,
												onSelect: this.handleOnSelect
										  }
										: false
								}
								deleteRow
								exportCSV={true}
								search
								searchPlaceholder="Cari Item"
								pagination>
								<TableHeaderColumn
									dataField="No."
									dataFormat={this.indexN}
									hiddenOnInsert
									editable={false}
									export={false}
									width="5%">
									No
								</TableHeaderColumn>

								<TableHeaderColumn
									isKey
									dataField="id"
									hidden
									autoValue
									export={true}
									editable={false}
									hiddenOnInsert>
									ID
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="judul"
									tdStyle={{ whiteSpace: 'normal' }}
									dataSort
									editable={{
										validator: this.emptyStringValidator.bind(this)
									}}
									searchable={true}>
									Judul
								</TableHeaderColumn>
							</BootstrapTable>
						)}
					</CardBlock>
				</Card>
			</div>
		);
	}
}

export default withAuth(Lainnya);
