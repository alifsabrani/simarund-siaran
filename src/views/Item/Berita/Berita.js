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

class Berita extends Component {
	constructor(props) {
		super(props);
		this.indexN = this.indexN.bind(this);
		this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
		this.fancyTimeFormat = this.fancyTimeFormat.bind(this);
		this.handleDateFilter = this.handleDateFilter.bind(this);
		this.getDataById = this.getDataById.bind(this);

		this.getBerita = this.getBerita.bind(this);
		this.getAliasPegawai = this.getAliasPegawai.bind(this);
		this.getNamaKategori = this.getNamaKategori.bind(this);
		this.insertBerita = this.insertBerita.bind(this);
		this.deleteBerita = this.deleteBerita.bind(this);
		this.updateBerita = this.updateBerita.bind(this);

		this.renderInsertButton = this.renderInsertButton.bind(this);
		this.renderDeleteButton = this.renderDeleteButton.bind(this);
		this.renderToolbar = this.renderToolbar.bind(this);
		this.renderInsertModalHeader = this.renderInsertModalHeader.bind(this);

		this.toggleMoveModal = this.toggleMoveModal.bind(this);
		this.handleCategoryFilter = this.handleCategoryFilter.bind(this);
		this.handleOnSelect = this.handleOnSelect.bind(this);
		this.handleOnSelectAll = this.handleOnSelectAll.bind(this);
		this.handleRowDelete = this.handleRowDelete.bind(this);

		this.state = {
			data: undefined,
			pegawai: undefined,
			kategori: undefined,
			selectCount: 0,
			edittedRow: [],
			itemPerPage: 10,
			currentPage: 1,
			showSaveModals: false,
			showDeleteModal: false,
			showResetModal: false,
			showMoveModal: false,
			selectedCategory: undefined,
			selectedCategoryDay: undefined,
			savingData: false,
			deletingData: false,
			resettingData: false,
			moveDate: '',
			moveError: undefined,
			next: undefined,
			saveToastId: null,
			dateFilter: '',
			categoryFilter: '',
			myItemFilter: ''
		};
	}

	componentDidMount() {
		this.getBerita();
		this.getAliasPegawai();
		this.getNamaKategori();
	}

	getBerita(handleSuccess) {
		Auth.fetch('http://localhost:8000/api/berita/', {
			method: 'GET',
			timeout: 5000
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				let notMyRow;
				if (this.props.user.lvl == 'pegawai') {
					notMyRow = data
						.filter(item => item.id_pengguna != this.props.user.sub)
						.map(item => item.id);
				} else {
					notMyRow = [];
				}
				this.setState({ data: data, notMyRow: notMyRow });
				if (handleSuccess !== undefined) {
					handleSuccess();
				}
			});
	}

	getAliasPegawai() {
		Auth.fetch('http://localhost:8000/api/pegawai/alias', {
			method: 'GET'
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.setState(prevState => ({
					...prevState,
					pegawai: data
				}));
			});
	}

	getNamaKategori() {
		Auth.fetch('http://localhost:8000/api/kategori/nama_siaran_non_lokal', {
			method: 'GET'
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.setState(prevState => ({
					...prevState,
					kategori: data
				}));
			});
	}

	insertBerita(row) {
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
		row = { ...row, id_pengguna: this.props.user.sub };
		Auth.fetch('http://localhost:8000/api/berita/', {
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

	updateBerita() {
		this.setState({
			savingData: true
		});
		Auth.fetch(
			'http://localhost:8000/api/berita/' +
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
				this.setState(prevState => ({
					...prevState,
					data: data,
					showSaveModals: false,
					edittedRow: [],
					savingData: false
				}));
				toast.success(({ closeToast }) => (
					<span>
						<i className="fa fa-check" /> Data berhasil disimpan
					</span>
				));
			});
	}

	deleteBerita(row) {
		Auth.fetch('http://localhost:8000/api/berita/' + row.join(','), {
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

	insertItemSiaran() {
		const data = {
			item: this.refs.table.state.selectedRowKeys,
			tanggal: this.state.moveDate,
			kategori: this.state.selectedCategory
		};

		Auth.fetch('http://localhost:8000/api/siaran/item', {
			method: 'POST',
			body: JSON.stringify(data)
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.toggleMoveModal();
				toast.info(
					<span>
						<i className="fa fa-check" /> Item berhasil dipindahkan ke
						siaran
					</span>
				);
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
							{props.components.insertBtn}{' '}
							{this.props.user.lvl != 'pegawai' ? (
								<Button
									color="info"
									onClick={() => {
										if (this.state.selectCount > 0) {
											let rows = [];
											const arr = this.refs.table.state
												.selectedRowKeys;
											rows[0] = this.getDataById(arr[0]);
											for (let i = 1; i < arr.length; i++) {
												rows[i] = this.getDataById(arr[i]);
												if (rows[0].siaran != rows[i].siaran) {
													toast.warning(({ closeToast }) => (
														<span>
															<i className="fa fa-cross" /> Maaf,
															berita yang akan ditambahkan harus
															memiliki siaran yang sama
														</span>
													));
													return false;
												}
											}
											this.setState({
												selectedCategory: rows[0].siaran
											});
											this.toggleMoveModal();
										}
									}}>
									<i className="fa fa-television" /> Tambah ke Siaran
								</Button>
							) : null}
							{props.components.deleteBtn}
						</ButtonToolbar>
					</Col>
					<Col xs="12" md="6">
						{props.components.searchField}
					</Col>
				</Row>
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
					<Col xs="12" md="3">
						<InputGroup>
							<InputGroupAddon className="bg-primary">
								<i className="fa fa-television" />
							</InputGroupAddon>

							<Input
								type="select"
								name="filter-siaran"
								id="filter-siaran"
								onChange={this.handleCategoryFilter}>
								<option value="all">Semua</option>
								{this.state.kategori.map(item => (
									<option value={item}>{item}</option>
								))}
							</Input>
						</InputGroup>
					</Col>

					<Col xs="12" md="3">
						<InputGroup>
							<InputGroupAddon className="bg-primary">
								<i className="fa fa-calendar" />
							</InputGroupAddon>

							<Input
								type="date"
								name="filter-date"
								id="filter-date"
								onChange={this.handleDateFilter}
							/>
						</InputGroup>
					</Col>
				</Row>
				<Row>
					<Col xs="12" md="12" className="text-right mt-2 mb-2">
						<Input
							type="checkbox"
							onChange={this.handleMyItem.bind(this)}
						/>{' '}
						Hanya tampilkan berita dari saya
					</Col>
				</Row>
			</Col>
		);
	}

	renderInsertModalHeader(closeModal, save) {
		return (
			<div>
				<h6>Tambah Berita Daerah</h6>
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

	handleDateFilter(e) {
		this.setState({
			dateFilter: e.target.value
		});
		this.refs.table.handleFilterData({
			tanggal: e.target.value,
			siaran: this.state.categoryFilter,
			id_pengguna: this.state.myItemFilter
		});
	}

	handleMyItem(e) {
		console.log(e.target);
		let filt = e.target.checked ? this.props.user.sub : '';
		this.setState({
			myItemFilter: filt
		});
		this.refs.table.handleFilterData({
			id_pengguna: filt,
			siaran: this.state.categoryFilter,
			tanggal: this.state.dateFilter
		});
	}

	handleCategoryFilter(e) {
		let cat = e.target.value !== 'all' ? e.target.value : '';
		this.setState({
			categoryFilter: cat
		});
		this.refs.table.handleFilterData({
			tanggal: this.state.dateFilter,
			siaran: cat,
			id_pengguna: this.state.myItemFilter
		});
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

	toggleMoveModal() {
		this.setState(prevState => ({
			showMoveModal: !prevState.showMoveModal
		}));
	}

	render() {
		const options = {
			afterInsertRow: this.insertBerita,
			searchPlaceholderText: 'Judul Berita',
			exportCSVText: 'Unduh CSV',
			clearSearch: true,
			insertBtn: this.renderInsertButton,
			deleteBtn: this.renderDeleteButton,
			afterDeleteRow: this.deleteBerita,
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
			},
			nonEditableRows: () => {
				return this.state.notMyRow;
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
				onConfirm={this.updateBerita}
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
					this.getBerita(() => {
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

		const moveToSiaranModal = (
			<Modal
				isOpen={this.state.showMoveModal}
				toggle={this.toggleMoveModal}
				centered={true}>
				<ModalHeader toggle={this.toggle}>Tambah ke Siaran</ModalHeader>
				<ModalBody>
					<FormGroup row>
						<Col md="3">
							<Label>
								<i className="fa fa-television" /> Siaran
							</Label>
						</Col>
						<Col xs="12" md="9">
							<Input
								type="text"
								name="siaran"
								id="siaran"
								value={this.state.selectedCategory}
								disabled
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col md="3">
							<Label>
								<i className="fa fa-calendar" /> Tanggal
							</Label>
						</Col>
						<Col xs="12" md="9">
							<Input
								type="date"
								name="date"
								id="date"
								onChange={e => {
									const date = new Date(e.target.value);
									const day = date.getUTCDay();

									this.setState({
										moveDate: e.target.value
									});
									Auth.fetch(
										'http://localhost:8000/api/jadwal/siaran_non_lokal',
										{
											method: 'GET'
										}
									)
										.then(response => {
											return response.json();
										})
										.then(data => {
											const jadwal = data;
											let catDay = [];
											let moveable = false;
											for (let i = 0; i < jadwal.length; i++) {
												if (
													jadwal[i].nama ==
													this.state.selectedCategory
												) {
													catDay.push(jadwal[i].hari);
													this.setState({
														selectedCategoryDay: catDay,
														jadwalSiaranLokal: data
													});
												}
											}

											for (
												let i = 0;
												i < this.state.selectedCategoryDay.length;
												i++
											) {
												if (
													day + 1 ==
													this.state.selectedCategoryDay[i]
												) {
													moveable = true;
												}
											}
											if (!moveable) {
												this.setState({
													moveError:
														'Siaran tidak tayang pada tanggal tersebut'
												});
											} else {
												this.setState({
													moveError: ''
												});
											}
										});
								}}
							/>
						</Col>
					</FormGroup>
					{this.state.moveError === '' ? (
						''
					) : (
						<span>{this.state.moveError}</span>
					)}
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.toggleMoveModal}>
						Batal
					</Button>{' '}
					<Button
						color="primary"
						onClick={this.insertItemSiaran.bind(this)}
						disabled={this.state.moveError !== ''}>
						Tambah
					</Button>
				</ModalFooter>
			</Modal>
		);

		return (
			<div className="animated fadeIn textCenter">
				{saveConfirmModal}
				{deleteConfirmModal}
				{resetConfirmModal}
				{moveToSiaranModal}
				<Card>
					<CardHeader>
						<h4>
							<i className="fa fa-video-camera " /> Berita
						</h4>
					</CardHeader>
					<CardBlock className="card-body">
						{this.state.data === undefined ||
						this.state.pegawai === undefined ||
						this.state.kategori === undefined ? (
							<Col className="vertical-align text-center " xs="12">
								<i className="fa fa-circle-o-notch fa-spin " /> Silahkan
								tunggu
							</Col>
						) : (
							<BootstrapTable
								csvFileName={
									'berita_' +
									new Date().toLocaleString('en-US') +
									'.csv'
								}
								height={400}
								scrollTop={'Top'}
								ref="table"
								hover
								striped
								data={this.state.data}
								version="4"
								cellEdit={cellEditProps}
								options={options}
								insertRow
								selectRow={{
									mode: 'checkbox',
									onSelectAll: this.handleOnSelectAll,
									onSelect: this.handleOnSelect,
									unselectable: this.state.notMyRow
								}}
								deleteRow
								exportCSV={false}
								search
								searchPlaceholder="Cari Judul Berita, Lokasi Berita, atau Jenis Liputan"
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
									csvHeader="ID Berita"
									export={true}
									editable={false}
									hiddenOnInsert>
									ID
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="judul"
									tdStyle={{ whiteSpace: 'normal' }}
									dataSort
									csvHeader="Judul Berita"
										editable={{
											type: 'textarea',
										validator: this.emptyStringValidator.bind(this)
									}}
									searchable={true}
									width="12%">
									Judul
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="durasi"
									width="7%"
									dataFormat={this.fancyTimeFormat}
									csvHeader="Durasi"
									csvFormat={this.fancyTimeFormat}
									editable={{
										type: 'select',
										options: { values: [110, 150] }
									}}
									dataAlign="center">
									Durasi
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="lokasi"
									width="10%"
									dataSort
									csvHeader="Lokasi"
									editable={{
										validator: this.emptyStringValidator.bind(this)
									}}
									searchable={true}
									dataFormat={(cell, row) => {
										return cell.toUpperCase();
									}}
									dataAlign="center">
									Lokasi
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="jenis_liputan"
									width="10%"
									dataSort
									csvHeader="Liputan"
									editable={{
										type: 'select',
										options: { values: ['inisiatif', 'advetorial'] }
									}}
									dataFormat={(cell, row) => {
										return cell.toUpperCase();
									}}
									dataAlign="center">
									Liputan
								</TableHeaderColumn>
								<TableHeaderColumn
									dataField="kameramen"
									width="12%"
									dataSort
									dataFormat={(cell, row) => {
										return cell.toUpperCase();
									}}
									csvHeader="Kameramen"
									editable={{
										type: 'select',
										options: { values: this.state.pegawai }
									}}
									dataAlign="center">
									Kameramen
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="reporter"
									dataSort
									dataFormat={(cell, row) => {
										return cell.toUpperCase();
									}}
									csvHeader="Reporter"
									editable={{
										type: 'select',
										options: { values: this.state.pegawai }
									}}
									width="10%"
									dataAlign="center">
									Reporter
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="tanggal"
									width="15%"
									dataSort
									csvHeader="Tanggal"
									editable={{
										type: 'date',
										defaultValue: new Date()
											.toISOString()
											.substring(0, 10),
										validator: this.emptyStringValidator.bind(this)
									}}
									dataAlign="center"
									csvFormat={this.convertToString.bind(this)}>
									Tanggal
								</TableHeaderColumn>

								<TableHeaderColumn
									dataField="siaran"
									dataSort
									tdStyle={{ whiteSpace: 'normal' }}
									dataFormat={(cell, row) => {
										return cell.toUpperCase();
									}}
									csvHeader="Siaran"
									editable={{
										type: 'select',
										options: { values: this.state.kategori }
									}}
									width="12%"
									dataAlign="center">
									Siaran
								</TableHeaderColumn>
							</BootstrapTable>
						)}
					</CardBlock>
				</Card>
			</div>
		);
	}
}

export default withAuth(Berita);
