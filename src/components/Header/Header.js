import React, { Component } from 'react';
import {
	Badge,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Nav,
	NavItem,
	NavLink,
	NavbarToggler,
	NavbarBrand,
	DropdownToggle
} from 'reactstrap';
import AuthService from '../../components/AuthService.js';
const Auth = new AuthService();

class Header extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			dropdownOpen: false,
			user: Auth.getProfile()
		};
		console.log(props);
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	sidebarToggle(e) {
		e.preventDefault();
		document.body.classList.toggle('sidebar-hidden');
	}

	sidebarMinimize(e) {
		e.preventDefault();
		document.body.classList.toggle('sidebar-minimized');
	}

	mobileSidebarToggle(e) {
		e.preventDefault();
		document.body.classList.toggle('sidebar-mobile-show');
	}

	asideToggle(e) {
		e.preventDefault();
		document.body.classList.toggle('aside-menu-hidden');
	}
	handleLogout() {
		Auth.logout();
		this.props.history.replace('/login');
	}

	render() {
		return (
			<header className="app-header navbar">
				<NavbarToggler
					className="d-lg-none"
					onClick={this.mobileSidebarToggle}>
					&#9776;
				</NavbarToggler>
				<NavbarBrand href="#" />
				<NavbarToggler
					className="d-md-down-none"
					onClick={this.sidebarToggle}>
					&#9776;
				</NavbarToggler>
				<Nav className="ml-auto" navbar>
					<NavItem>
						<Dropdown
							isOpen={this.state.dropdownOpen}
							toggle={this.toggle}>
							<DropdownToggle className="nav-link dropdown-toggle">
								<img
									src={'img/avatars/6.jpg'}
									className="img-avatar"
									alt="admin@bootstrapmaster.com"
								/>
								<span className="d-md-down-none">
									{this.props.username}
								</span>
							</DropdownToggle>
							<DropdownMenu
								right
								className={this.state.dropdownOpen ? 'show' : ''}>
								<DropdownItem header tag="div" className="text-center">
									<strong>Account</strong>
								</DropdownItem>
								<DropdownItem onClick={this.handleLogout.bind(this)}>
									<i className="fa fa-lock" /> Logout
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</NavItem>
				</Nav>
			</header>
		);
	}
}

export default Header;
