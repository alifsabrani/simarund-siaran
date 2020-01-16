import React, { Component } from 'react';
import {
	Row,
	Col,
	Button,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Form,
	FormGroup,
	FormText,
	Label,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupButton
} from 'reactstrap';

class DataForm extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Form
				action=""
				method="post"
				encType="multipart/form-data"
				className="form-horizontal">
				{this.props.columns.map((column, index) => {
					if ((column.type = 'select')) {
					} else {
						return (
							<FormGroup row key={column.field}>
								<Col md="3">
									<Label>{column.name}</Label>
								</Col>
								<Col xs="12" md="9">
									<Input
										type="text"
										id="text-input"
										name="text-input"
										placeholder="Text"
									/>
								</Col>
							</FormGroup>
						);
					}
				})}
				<FormGroup row>
					<Col md="3">
						<Label>Static</Label>
					</Col>
					<Col xs="12" md="9">
						<p className="form-control-static">Username</p>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="text-input">Text Input</Label>
					</Col>
					<Col xs="12" md="9">
						<Input
							type="text"
							id="text-input"
							name="text-input"
							placeholder="Text"
						/>
						<FormText color="muted">This is a help text</FormText>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="email-input">Email Input</Label>
					</Col>
					<Col xs="12" md="9">
						<Input
							type="email"
							id="email-input"
							name="email-input"
							placeholder="Enter Email"
						/>
						<FormText className="help-block">
							Please enter your email
						</FormText>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="password-input">Password</Label>
					</Col>
					<Col xs="12" md="9">
						<Input
							type="password"
							id="password-input"
							name="password-input"
							placeholder="Password"
						/>
						<FormText className="help-block">
							Please enter a complex password
						</FormText>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="disabled-input">Disabled Input</Label>
					</Col>
					<Col xs="12" md="9">
						<Input
							type="text"
							id="disabled-input"
							name="disabled-input"
							placeholder="Disabled"
							disabled
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="textarea-input">Textarea</Label>
					</Col>
					<Col xs="12" md="9">
						<Input
							type="textarea"
							name="textarea-input"
							id="textarea-input"
							rows="9"
							placeholder="Content..."
						/>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="select">Select</Label>
					</Col>
					<Col xs="12" md="9">
						<Input type="select" name="select" id="select">
							<option value="0">Please select</option>
							<option value="1">Option #1</option>
							<option value="2">Option #2</option>
							<option value="3">Option #3</option>
						</Input>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="selectLg">Select Large</Label>
					</Col>
					<Col xs="12" md="9" size="lg">
						<Input type="select" name="selectLg" id="selectLg" size="lg">
							<option value="0">Please select</option>
							<option value="1">Option #1</option>
							<option value="2">Option #2</option>
							<option value="3">Option #3</option>
						</Input>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="selectSm">Select Small</Label>
					</Col>
					<Col xs="12" md="9">
						<Input type="select" name="selectSm" id="SelectLm" size="sm">
							<option value="0">Please select</option>
							<option value="1">Option #1</option>
							<option value="2">Option #2</option>
							<option value="3">Option #3</option>
							<option value="4">Option #4</option>
							<option value="5">Option #5</option>
						</Input>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="disabledSelect">Disabled Select</Label>
					</Col>
					<Col xs="12" md="9">
						<Input
							type="select"
							name="disabledSelect"
							id="disabledSelect"
							disabled>
							<option value="0">Please select</option>
							<option value="1">Option #1</option>
							<option value="2">Option #2</option>
							<option value="3">Option #3</option>
						</Input>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="multiple-select">Multiple select</Label>
					</Col>
					<Col md="9">
						<Input
							type="select"
							name="multiple-select"
							id="multiple-select"
							multiple>
							<option value="1">Option #1</option>
							<option value="2">Option #2</option>
							<option value="3">Option #3</option>
							<option value="4">Option #4</option>
							<option value="5">Option #5</option>
							<option value="6">Option #6</option>
							<option value="7">Option #7</option>
							<option value="8">Option #8</option>
							<option value="9">Option #9</option>
							<option value="10">Option #10</option>
						</Input>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label>Radios</Label>
					</Col>
					<Col md="9">
						<FormGroup check>
							<div className="radio">
								<Label check htmlFor="radio1">
									<Input
										type="radio"
										id="radio1"
										name="radios"
										value="option1"
									/>{' '}
									Option 1
								</Label>
							</div>
							<div className="radio">
								<Label check htmlFor="radio2">
									<Input
										type="radio"
										id="radio2"
										name="radios"
										value="option2"
									/>{' '}
									Option 2
								</Label>
							</div>
							<div className="radio">
								<Label check htmlFor="radio3">
									<Input
										type="radio"
										id="radio3"
										name="radios"
										value="option3"
									/>{' '}
									Option 3
								</Label>
							</div>
						</FormGroup>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label>Inline Radios</Label>
					</Col>
					<Col md="9">
						<FormGroup check className="form-check-inline">
							<Label check htmlFor="inline-radio1">
								<Input
									type="radio"
									id="inline-radio1"
									name="inline-radios"
									value="option1"
								/>{' '}
								One
							</Label>
							<Label check htmlFor="inline-radio2">
								<Input
									type="radio"
									id="inline-radio2"
									name="inline-radios"
									value="option2"
								/>{' '}
								Two
							</Label>
							<Label check htmlFor="inline-radio3">
								<Input
									type="radio"
									id="inline-radio3"
									name="inline-radios"
									value="option3"
								/>{' '}
								Three
							</Label>
						</FormGroup>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label>Checkboxes</Label>
					</Col>
					<Col md="9">
						<FormGroup check>
							<div className="checkbox">
								<Label check htmlFor="checkbox1">
									<Input
										type="checkbox"
										id="checkbox1"
										name="checkbox1"
										value="option1"
									/>{' '}
									Option 1
								</Label>
							</div>
							<div className="checkbox">
								<Label check htmlFor="checkbox2">
									<Input
										type="checkbox"
										id="checkbox2"
										name="checkbox2"
										value="option2"
									/>{' '}
									Option 2
								</Label>
							</div>
							<div className="checkbox">
								<Label check htmlFor="checkbox3">
									<Input
										type="checkbox"
										id="checkbox3"
										name="checkbox3"
										value="option3"
									/>{' '}
									Option 3
								</Label>
							</div>
						</FormGroup>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label>Inline Checkboxes</Label>
					</Col>
					<Col md="9">
						<FormGroup check className="form-check-inline">
							<Label check htmlFor="inline-checkbox1">
								<Input
									type="checkbox"
									id="inline-checkbox1"
									name="inline-checkbox1"
									value="option1"
								/>{' '}
								One
							</Label>
							<Label check htmlFor="inline-checkbox2">
								<Input
									type="checkbox"
									id="inline-checkbox2"
									name="inline-checkbox2"
									value="option2"
								/>{' '}
								Two
							</Label>
							<Label check htmlFor="inline-checkbox3">
								<Input
									type="checkbox"
									id="inline-checkbox3"
									name="inline-checkbox3"
									value="option3"
								/>{' '}
								Three
							</Label>
						</FormGroup>
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="file-input">File input</Label>
					</Col>
					<Col xs="12" md="9">
						<Input type="file" id="file-input" name="file-input" />
					</Col>
				</FormGroup>
				<FormGroup row>
					<Col md="3">
						<Label htmlFor="file-multiple-input">
							Multiple File input
						</Label>
					</Col>
					<Col xs="12" md="9">
						<Input
							type="file"
							id="file-multiple-input"
							name="file-multiple-input"
							multiple
						/>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}
