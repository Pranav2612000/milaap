import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import ReactNotification, { store } from "react-notifications-component";
import { Redirect } from 'react-router-dom';
class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			repassword: '',
			redirect: false
		};
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleRepasswordChange = this.handleRepasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleUsernameChange(e) {
		this.setState({
			username: e.target.value
		});
	}
	handlePasswordChange(e) {
		this.setState({
			password: e.target.value
		});
	}
	handleRepasswordChange(e) {
		this.setState({
			repassword: e.target.value
		});
	}
	handleSubmit(e) {
		e.preventDefault();
		console.log(this.state);
		axios.post(
			'http://localhost:5000/api/register/',
			{
				username: this.state.username,
				password: this.state.password
			}
		)
			.then(res => {
				console.log(res);
				this.setState({ redirect: true });
				console.log(res);
			})
			.catch(err => {
				store.addNotification({
					title: "Some Error Occured",
					message: `Please Try Again`,
					type: "warning",
					// insert: "top",
					container: "top-right",
					animationIn: ["animated", "fadeIn"],
					animationOut: ["animated", "fadeOut"],
					dismiss: {
						duration: 3000,
						pauseOnHover: true,
					},
				});
				console.log(err);
			});
		return;
	}
	render() {
		return (
			<>
				{this.state.redirect && <Redirect to={{ pathname: "/login", register: true }} />}

				<div className="app flex-row align-items-center" >
					<ReactNotification />
					<Container>
						<Row className="justify-content-center">
							<Col md="9" lg="7" xl="6">
								<Card className="mx-4">
									<CardBody className="p-4">
										<Form onSubmit={this.handleSubmit}>
											<h1>Register</h1>
											<p className="text-muted">Create your account</p>
											<InputGroup className="mb-3">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-user"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input type="text" placeholder="Username" autoComplete="username"
													value={this.state.username} onChange={this.handleUsernameChange} />
											</InputGroup>
											<InputGroup className="mb-3">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-lock"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input type="password" placeholder="Password" autoComplete="new-password"
													value={this.state.password} onChange={this.handlePasswordChange} />
											</InputGroup>
											<InputGroup className="mb-4">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-lock"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input type="password" placeholder="Repeat password" autoComplete="new-password"
													value={this.state.repassword} onChange={this.handleRepasswordChange} />
											</InputGroup>
											<Button color="success" block>Create Account</Button>
										</Form>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</Container>
				</div >
			</>
		);
	}
}

export default Register;
