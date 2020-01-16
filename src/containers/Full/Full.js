import React, { Component } from 'react';
import { Link, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Beranda from '../../views/Beranda/';
import SiaranUtama from '../../views/Siaran/SiaranUtama';
import ProgramTambahan from '../../views/Siaran/ProgramTambahan';
import Berita from '../../views/Item/Berita';
import BeritaDaerah from '../../views/Item/BeritaDaerah';
import Lainnya from '../../views/Item/Lainnya';
import KategoriProgram from '../../views/KategoriProgram';
import Pegawai from '../../views/Pegawai';
import Pengguna from '../../views/Pengguna';
import Jadwal from '../../views/Jadwal';
import { ToastContainer, toast } from 'react-toastify';
import 'C:/www/simarund/node_modules/react-toastify/dist/ReactToastify.css';
import AuthService from '../../components/AuthService.js';
import withAuth from '../../components/withAuth.js';
const Auth = new AuthService();

class Full extends Component {
	constructor() {
		super();
		this.state = {
			username: 'null'
		};
	}

	componentWillMount() {
		if (!Auth.loggedIn()) {
			this.props.history.replace('/login');
		}
		Auth.fetch(
			'http://localhost:8000/api/pengguna/' + Auth.getProfile().sub,
			{
				method: 'GET',
				timeout: 5000
			}
		)
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.setState({ username: data.username });
			});
	}

	componentDidMount() {
		
	}
	render() {
		const HeaderWithRouter = withRouter(Header);
		return Auth.loggedIn() ? (
			<div className="app">
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnVisibilityChange
					draggable
					pauseOnHover
				/>
				<HeaderWithRouter username={this.state.username} />
				<div className="app-body">
					<Sidebar {...this.props} />
					<main className="main">
						<Breadcrumb />
						<Container fluid>
							<Switch>
								<Route
									path="/siaran/utama"
									name="Siaran Utama"
									component={SiaranUtama}
								/>
								<Route
									path="/siaran/tambahan"
									name="Program Tambahan"
									component={ProgramTambahan}
								/>
								<Route
									path="/item/berita"
									name="Berita"
									component={Berita}
								/>
								<Route
									path="/item/berita-daerah"
									name="Berita Daerah"
									component={BeritaDaerah}
								/>
								<Route
									path="/item/lainnya"
									name="Lainnya"
									component={Lainnya}
								/>
								<Route
									path="/kategori-program"
									name="Kategori Program"
									component={KategoriProgram}
								/>
								<Route
									path="/pegawai"
									name="Pegawai"
									component={Pegawai}
								/>
								<Route
									path="/pengguna"
									name="Pengguna"
									component={Pengguna}
								/>
								<Route
									path="/jadwal"
									name="Jadwal"
									component={Jadwal}
								/>
								<Redirect from="/" to="/siaran/utama" />
							</Switch>
						</Container>
					</main>
					<Aside />
				</div>
				<Footer />
			</div>
		) : (
			<Redirect to="/login" />
		);
	}
}

export default Full;
