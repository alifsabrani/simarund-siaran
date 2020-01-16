import React, { Component } from 'react';
import AuthService from '../../components/AuthService.js';
import withAuth from '../../components/withAuth.js';
const Auth = new AuthService();

class Beranda extends Component {
	render() {
		return (
			<div className="animated fadeIn textCenter">
				<h1>Selamat Datang di Sistem Informasi Warta NTB</h1>
			</div>
		);
	}
}

export default withAuth(Beranda);
