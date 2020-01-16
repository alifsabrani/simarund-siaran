import React, { Component } from 'react';
import {
	Container,
	Row,
	Col,
	CardGroup,
	Card,
	CardBlock,
	Button,
	Input,
	InputGroup,
	InputGroupAddon,
	Form,
	NavbarBrand
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import AuthService from '../../components/AuthService.js';

class Login extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleFormSubmit(e) {
		e.preventDefault();
		this.setState({
			loginToastId: toast(
				({ closeToast }) => (
					<span>
						<i className="fa fa-circle-o-notch fa-spin" /> Logging in
					</span>
				),
				{ autoClose: false }
			)
		});
		this.Auth.login(this.state.username, this.state.password)
			.then(res => {
				this.props.history.replace('/');
			})
			.catch(err => {
				let errText = err.toString();
				console.log(err.toString());
				if (err.toString() == 'Error: Unauthorized') {
					errText = 'Username atau password salah';
				} else {
					errrText = 'Internal Server Error';
				}
				toast.update(this.state.loginToastId, {
					render: (
						<span>
							<i className="fa fa-check" /> {errText}
						</span>
					),
					type: toast.TYPE.ERROR,
					className: 'rotateY animated',
					autoClose: 5000
				});
			});
	}

	componentWillMount() {
		if (this.Auth.loggedIn()) this.props.history.replace('/');
	}

	render() {
		return (
			<div className="app flex-row align-items-center">
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
				<Container>
					<Row className="justify-content-center">
						<Col md="8">
							<CardGroup className="mb-0">
								<Card className="p-4">
									<CardBlock className="card-body">
										<h1>Login</h1>
										<p className="text-muted">Masuk ke akun anda</p>
										<Form onSubmit={this.handleFormSubmit}>
											<InputGroup className="mb-3">
												<InputGroupAddon>
													<i className="icon-user" />
												</InputGroupAddon>
												<Input
													type="text"
													name="username"
													placeholder="Username"
													onChange={this.handleChange}
												/>
											</InputGroup>
											<InputGroup className="mb-4">
												<InputGroupAddon>
													<i className="icon-lock" />
												</InputGroupAddon>
												<Input
													type="password"
													name="password"
													placeholder="Password"
													onChange={this.handleChange}
												/>
											</InputGroup>
											<Row>
												<Col xs="6">
													<Button
														color="primary"
														className="px-4"
														type="submit">
														Login
													</Button>
												</Col>
												<Col xs="6" className="text-right" />
											</Row>
										</Form>
										<Row>
											<Col
												xs="12"
												className="text-center mt-5 text-info">
												Hubungi Administrator jika anda lupa
												username atau password
											</Col>
										</Row>
									</CardBlock>
								</Card>
								<Card
									className="text-white bg-primary py-5 d-md-down-none"
									style={{ width: 44 + '%' }}>
									<CardBlock className="card-body text-center">
										<div>
											<img
												src="/img/logo.png"
												width="100%"
												height="auto"
											/>
											<h2>Welcome!</h2>
											<h3>
												Sistem Informasi Manajemen Rundown Warta NTB
											</h3>
										</div>
									</CardBlock>
								</Card>
							</CardGroup>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Login;
