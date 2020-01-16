import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/core';
// import 'regenerator-runtime/runtime';
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
import { isNull } from 'util';
const Auth = new AuthService();

class SiaranUtama extends Component {
	constructor(props) {
		super(props);
		this.indexN = this.indexN.bind(this);
		this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
		this.fancyTimeFormat = this.fancyTimeFormat.bind(this);
		this.getItemById = this.getItemById.bind(this);

		this.getItem = this.getItem.bind(this);
		this.insertItem = this.insertItem.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.updateItem = this.updateItem.bind(this);
		this.getDividerItem = this.getDividerItem.bind(this);
		this.insertDividerItem = this.insertDividerItem.bind(this);
		this.getPegawai = this.getPegawai.bind(this);
		this.getCrew = this.getCrew.bind(this);
		this.insertCrew = this.insertCrew.bind(this);

		this.renderInsertButton = this.renderInsertButton.bind(this);
		this.renderDeleteButton = this.renderDeleteButton.bind(this);
		this.renderToolbar = this.renderToolbar.bind(this);
		this.renderInsertModalHeader = this.renderInsertModalHeader.bind(this);

		this.handleOnSelect = this.handleOnSelect.bind(this);
		this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
		this.handleRowDelete = this.handleRowDelete.bind(this);
		this.handleDateFilter = this.handleDateFilter.bind(this);
		this.toggleAddModal = this.toggleAddModal.bind(this);
		this.toggleCrewModal = this.toggleCrewModal.bind(this);

		this.state = {
			data: undefined,
			bagian: [
				'redaktur_1',
				'redaktur_2',
				'redaktur_3',
				'petugas_efp',
				'unit_manager',
				'editor',
				'pengarah_acara',
				'penyiar'
			],
			selectCount: 0,
			edittedRow: [],
			itemPerPage: 10,
			currentPage: 1,
			showSaveModals: false,
			showDeleteModal: false,
			showResetModal: false,
			showAddModal: false,
			showCrewModal: false,
			savingData: false,
			deletingData: false,
			resettingData: false,
			next: undefined,
			saveToastId: null,
			urutan: [],
			itemDivider: [],
			pegawai: [],
			tanggal: new Date()
				.toISOString()
				.substring(0, 10)
				.replace(/-/g, '_')
		};
	}

	componentDidMount() {
		this.getItem(this.state.tanggal);
		this.getDividerItem();
		this.getPegawai();
		this.getCrew();
	}

	getPegawai() {
		Auth.fetch('http://localhost:8000/api/pegawai/', {
			method: 'GET',
			timeout: 5000
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.setState({ pegawai: data });
				if (handleSuccess !== undefined) {
					handleSuccess();
				}
			});
	}

	getCrew() {
		Auth.fetch(
			'http://localhost:8000/api/petugas_siaran/' + this.state.data.id,
			{
				method: 'GET',
				timeout: 5000
			}
		)
			.then(response => {
				return response.json();
			})
			.then(data => {
				data.map(item => {
					this.setState({
						[item.bagian]: item.id_pegawai
					});
				});
			});
	}

	getItem(tanggal, handleSuccess) {
		this.state.bagian.map(item => {
			this.setState({
				[item]: '0'
			});
		});
		Auth.fetch('http://localhost:8000/api/siaran/utama/' + tanggal, {
			method: 'GET',
			timeout: 5000
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				let urutan = data.item.map(item => parseInt(item.urutan));
				this.setState({
					data: data,
					urutan: urutan
				});
				this.getCrew();
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
		Auth.fetch('http://localhost:8000/api/item_siaran', {
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
					data: [...prevState.data, data],
					urutan: [
						...prevState.urutan,
						prevState.urutan[prevState.urutan.length] + 1
					]
				}));
			});
	}

	getItemById(id) {
		for (let i = 0; i < this.state.data.item.length; i++) {
			if (id == this.state.data.item[i].urutan) {
				return this.state.data.item[i];
			}
		}
	}

	updateItem() {
		this.setState({
			savingData: true
		});
		Auth.fetch(
			'http://localhost:8000/api/siaran/' +
				this.state.data.id +
				'/item/' +
				this.state.edittedRow
					.map(row => {
						return row.urutan;
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
				this.setState(prevState => ({
					showSaveModals: false,
					edittedRow: [],
					savingData: false
				}));
			});
	}

	deleteItem(row) {
		Auth.fetch(
			'http://localhost:8000/api/siaran/' +
				this.state.data.id +
				'/item/' +
				row.join(','),
			{
				method: 'DELETE'
			}
		)
			.then(response => {
				return response.json();
			})
			.then(data => {
				toast.error(({ closeToast }) => (
					<span>
						<i className="fa fa-trash" /> Data berhasil dihapus
					</span>
				));
				this.setState(prevState => ({
					...prevState,
					deletingData: false,
					showDeleteModal: false
				}));
				this.getItem(this.state.tanggal);
			});
	}

	getDividerItem(handleSuccess) {
		Auth.fetch('http://localhost:8000/api/item/', {
			method: 'GET',
			timeout: 5000
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.setState({
					itemDivider: data
				});
				if (handleSuccess !== undefined) {
					handleSuccess();
				}
			});
	}

	insertDividerItem() {
		const dataItem = { id: this.state.insertItemID };
		console.log(dataItem);

		Auth.fetch(
			'http://localhost:8000/api/siaran/item/' + this.state.data.id,
			{
				method: 'POST',
				body: JSON.stringify(dataItem)
			}
		)
			.then(response => {
				return response.json();
			})
			.then(data => {
				toast.info(
					<span>
						<i className="fa fa-check" /> Item berhasil ditambahkan ke
						siaran
					</span>
				);
				this.getItem(this.state.tanggal);
				this.toggleAddModal();
			});
	}

	insertCrew() {
		const dataItem = [
			{
				bagian: 'redaktur_1',
				id_pegawai: this.state.redaktur_1
			},
			{
				bagian: 'redaktur_2',
				id_pegawai: this.state.redaktur_2
			},
			{
				bagian: 'redaktur_3',
				id_pegawai: this.state.redaktur_3
			},
			{
				bagian: 'petugas_efp',
				id_pegawai: this.state.petugas_efp
			},
			{
				bagian: 'unit_manager',
				id_pegawai: this.state.unit_manager
			},
			{
				bagian: 'editor',
				id_pegawai: this.state.editor
			},
			{
				bagian: 'pengarah_acara',
				id_pegawai: this.state.pengarah_acara
			},
			{
				bagian: 'penyiar',
				id_pegawai: this.state.penyiar
			}
		];
		Auth.fetch(
			'http://localhost:8000/api/petugas_siaran/' + this.state.data.id,
			{
				method: 'POST',
				body: JSON.stringify(dataItem)
			}
		)
			.then(response => {
				return response.json();
			})
			.then(data => {
				toast.info(
					<span>
						<i className="fa fa-check" /> Petugas berhasil ditambahkan ke
						siaran
					</span>
				);
				this.getItem(this.state.tanggal);
				this.toggleCrewModal();
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
					<Col xs="12" md="6">
						<ButtonToolbar>
							{this.props.user.lvl != 'pegawai' ? (
								<ButtonToolbar>
									<Button
										color="primary"
										onClick={this.toggleAddModal}>
										<i className="fa fa-plus" /> Tambah Item Pembatas
									</Button>
									<Button
										color="success"
										onClick={this.toggleCrewModal}>
										<i className="fa fa-group" /> Kru Siaran
									</Button>
									{props.components.deleteBtn}
								</ButtonToolbar>
							) : null}
							<Button color="danger" href={"http://localhost:8000/api/siaran/download/" + this.state.data.id} outline
							>
								<i className="fa fa-download" /> Unduh PDF
							</Button>{' '}
						</ButtonToolbar>
					</Col>
					<Col xs="12" md="6">
						{props.components.searchField}
					</Col>
				</Row>
				<Row className="mt-2">
					<Col xs="12" md="5">
						{this.props.user.lvl != 'pegawai' ? (
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
						) : null}
					</Col>
					<Col md="1" />
					<Col md="3" />
					<Col xs="12" md="3">
						<InputGroup>
							<InputGroupAddon className="bg-primary">
								<i className="fa fa-calendar" />
							</InputGroupAddon>

							<Input
								type="date"
								name="filter-date"
								id="filter-date"
								value={this.state.tanggal.replace(/_/g, '-')}
								onChange={this.handleDateFilter}
							/>
						</InputGroup>
					</Col>
				</Row>
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
		if (!isNull(cell)) {
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
		return '-';
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

	handleDateFilter(e) {
		let newDate;
		if (e.target.value != '') {
			newDate = e.target.value.replace(/-/g, '_');
		} else {
			newDate = new Date()
				.toISOString()
				.substring(0, 10)
				.replace(/-/g, '_');
		}
		this.setState({
			tanggal: newDate
		});
		this.getItem(newDate);
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
	toggleAddModal() {
		this.setState(prevState => ({
			showAddModal: !prevState.showAddModal
		}));
	}
	toggleCrewModal() {
		this.setState(prevState => ({
			showCrewModal: !prevState.showCrewModal
		}));
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
			onSizePerPageList: this.handleSizePerPageListChange.bind(this),
			sortName: 'urutan',
			sortOrder: 'asc'
		};

		const cellEditProps = {
			mode: 'click',
			blurToSave: true,
			beforeSaveCell: (row, cellName, cellValue) => {
				let prevValue = row[cellName];
				let edittedRow = [...this.state.edittedRow];
				let newData = this.refs.table.state.data.map(item => {
					console.log('item : ');
					console.log(item);
					console.log('prevValue : ');
					console.log(prevValue);
					console.log('cellValue : ');
					console.log(cellValue);
					if (item.urutan == cellValue) {
						item.urutan = parseInt(prevValue);
						edittedRow = [...edittedRow, item];
					}
					return item;
				});
				this.setState(prevState => ({
					...prevState,
					data: {
						...prevState.data,
						item: newData
					},
					edittedRow: edittedRow
				}));
				console.log(this.state.edittedRow);
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

		const addModal = (
			<Modal
				isOpen={this.state.showAddModal}
				toggle={this.toggleAddModal}
				centered={true}>
				<ModalHeader toggle={this.toggle}>Tambah Item Pembatas</ModalHeader>
				<ModalBody>
					<FormGroup row>
						<Col xs="12" md="12">
							<InputGroup>
								<InputGroupAddon className="bg-primary">
									<span>
										<i className="fa fa-item" /> Item
									</span>
								</InputGroupAddon>

								<Input
									type="select"
									name="item"
									id="item"
									onChange={e => {
										this.setState({
											insertItemID: e.target.value
										});
									}}>
									<option value="-">Pilih Item</option>
									{this.state.itemDivider.map(item => (
										<option value={item.id}>{item.judul}</option>
									))}
								</Input>
							</InputGroup>
						</Col>
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.toggleAddModal}>
						Batal
					</Button>{' '}
					<Button
						color="primary"
						onClick={this.insertDividerItem.bind(this)}>
						Tambah
					</Button>
				</ModalFooter>
			</Modal>
		);

		const crewModal = (
			<Modal
				isOpen={this.state.showCrewModal}
				toggle={this.toggleCrewModal}
				centered={true}>
				<ModalHeader toggle={this.toggle}>Kru Siaran</ModalHeader>
				<ModalBody>
					<FormGroup row>
						{this.state.bagian.map(item => {
							return (
								<Col xs="12" md="12" className="mb-2">
									<InputGroup>
										<InputGroupAddon className="bg-primary">
											<span>
												<i className="fa fa-item" />{' '}
												{item.toUpperCase().replace(/_/g, ' ')}
											</span>
										</InputGroupAddon>

										<Input
											type="select"
											name={item}
											id={item}
											value={this.state[item]}
											onChange={(e, key) => {
												this.setState({
													[item]: e.target.value
												});
												console.log(this.state[item]);
											}}>
											<option value="0">Pilih Pegawai</option>
											{this.state.pegawai.map(item => (
												<option value={item.id}>{item.nama}</option>
											))}
										</Input>
									</InputGroup>
								</Col>
							);
						})}
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.toggleCrewModal}>
						Batal
					</Button>{' '}
					<Button color="success" onClick={this.insertCrew.bind(this)}>
						Simpan
					</Button>
				</ModalFooter>
			</Modal>
		);

		return (
			<div className="animated fadeIn textCenter">
				{saveConfirmModal}
				{deleteConfirmModal}
				{resetConfirmModal}
				{addModal}
				{crewModal}
				<Card>
					<CardHeader>
						<h4>
							<i className="fa fa-desktop " /> Siaran Utama
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
								data={this.state.data.item}
								version="4"
								cellEdit={
									this.props.user.lvl != 'pegawai'
										? cellEditProps
										: false
								}
								options={options}
								insertRow
								selectRow={
									this.props.user.lvl != 'pegawai'
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
									dataField="urutan"
									dataSort
									hiddenOnInsert
									editable={{
										type: 'select',
										options: { values: this.state.urutan }
									}}
									width="8%">
									No
								</TableHeaderColumn>

								<TableHeaderColumn
									isKey
									dataField="id"
									hidden
									autoValue
									csvHeader="ID Berita"
									export={true}
									editable={false}
									hiddenOnInsert>
									ID
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="judul"
									editable={false}
									tdStyle={{ whiteSpace: 'normal' }}
									csvHeader="Judul Berita"
									searchable={true}
									>
									Judul
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="durasi"
									editable={false}
									width="7%"
									dataFormat={this.fancyTimeFormat}
									csvHeader="Durasi"
									csvFormat={this.fancyTimeFormat}
									dataAlign="center">
									Durasi
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="lokasi"
									width="10%"
									editable={false}
									csvHeader="Lokasi"
									searchable={true}
									dataFormat={(cell, row) => {
										if (!isNull(cell)) {
											return cell.toUpperCase();
										}
										return '-';
									}}
									dataAlign="center">
									Lokasi
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="jenis_liputan"
									editable={false}
									width="10%"
									csvHeader="Liputan"
									dataFormat={(cell, row) => {
										if (!isNull(cell)) {
											return cell.toUpperCase();
										}
										return '-';
									}}
									dataAlign="center">
									Liputan
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="kameramen"
									width="12%"
									editable={false}
									dataFormat={(cell, row) => {
										if (!isNull(cell)) {
											return cell.toUpperCase();
										}
										return '-';
									}}
									csvHeader="Kameramen"
									dataAlign="center">
									Kameramen
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="reporter"
									editable={false}
									dataFormat={(cell, row) => {
										if (!isNull(cell)) {
											return cell.toUpperCase();
										}
										return '-';
									}}
									csvHeader="Reporter"
									width="10%"
									dataAlign="center">
									Reporter
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="tanggal"
									width="12%"
									editable={false}
									dataFormat={(cell, row) => {
										if (!isNull(cell)) {
											return cell;
										}
										return '-';
									}}
									dataAlign="center"
									csvFormat={this.convertToString.bind(this)}>
									Tanggal
								</TableHeaderColumn>
							</BootstrapTable>
						)}
					</CardBlock>
				</Card>
			</div>
		);
	}
}

export default withAuth(SiaranUtama);
