import React, { Component } from 'react';
import AuthService from './AuthService.js';
import { withRouter } from 'react-router-dom';

export default function withAuth(AuthComponent) {
	const Auth = new AuthService();
	class AuthComp extends Component {
		constructor(props) {
			super(props);
			// console.log(this.props);
			this.state = {
				user: null
			};
		}
		componentWillMount() {
			if (!Auth.loggedIn()) {
				this.props.history.replace('/login');
			} else {
				try {
					const profile = Auth.getProfile();
					this.setState({
						user: profile
					});
				} catch (err) {
					Auth.logout();
					this.props.history.replace('/login');
				}
			}
		}
		render() {
			if (this.state.user) {
				return (
					<AuthComponent
						history={this.props.history}
						user={this.state.user}
					/>
				);
			} else {
				return null;
			}
		}
	}
	return AuthComp;
}
