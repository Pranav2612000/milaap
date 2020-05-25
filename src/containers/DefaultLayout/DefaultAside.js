import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
	Nav, NavItem, NavLink, Progress, TabContent, TabPane, ListGroup,
	ListGroupItem,
} from "reactstrap";
import PropTypes from "prop-types";
import classNames from "classnames";
import { AppSwitch } from "@coreui/react";
import MessageView from "../../views/MessageList/index";
import Controls from "../../views/Connection/Controls";
import {
	Button, ButtonGroup, Badge, Card, CardBody, CardFooter, CardHeader, Col,
	Container, Row, Collapse, Fade,
} from "reactstrap";

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {};

function getRoomFromLocation(location_string) {
	let room = "";
	let lastslash = location_string.lastIndexOf("/");
	room = location_string.slice(lastslash + 1);
	console.log(room);
	return room;
}

class DefaultAside extends Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: "1",
			change: false,
			roomName: getRoomFromLocation(props.location.pathname),
			path: props.location.pathname,
		};
	}
	componentDidUpdate(prevProps) {
		if (this.props.location.pathname != prevProps.location.pathname) {
			this.setState({
				roomName: getRoomFromLocation(this.props.location.pathname),
			});
			this.setState({ change: !this.state.change });
		}
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab,
			});
		}
	}

	render() {
		// eslint-disable-next-line
		const { children, ...attributes } = this.props;

		return (
			<React.Fragment>
				<Nav tabs>
					<NavItem>
						<NavLink
							className={classNames({ active: this.state.activeTab === "1" })}
							onClick={() => {
								this.toggle("1");
							}}
						>
							<i className="icon-list"></i>
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classNames({ active: this.state.activeTab === "2" })}
							onClick={() => {
								this.toggle("2");
							}}
						>
							<i className="icon-speech"></i>
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							className={classNames({ active: this.state.activeTab === "3" })}
							onClick={() => {
								this.toggle("3");
							}}
						>
							<i className="icon-settings"></i>
						</NavLink>
					</NavItem>
				</Nav>
				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId="1">
						<Controls roomName={this.state.roomName} />
					</TabPane>

					<TabPane tabId="2" className="p-3" key={this.state.change}>
						<MessageView roomName={this.state.roomName} />
					</TabPane>

					<TabPane tabId="3" className="p-3">
						<h6>Settings</h6>

						<div className="aside-options">
							<div className="clearfix mt-4">
								<small>
									<b>Option 1</b>
								</small>
								<AppSwitch
									className={"float-right"}
									variant={"pill"}
									label
									color={"success"}
									defaultChecked
									size={"sm"}
								/>
							</div>
							<div>
								<small className="text-muted">
									Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
								</small>
							</div>
						</div>

						<div className="aside-options">
							<div className="clearfix mt-3">
								<small>
									<b>Option 2</b>
								</small>
								<AppSwitch
									className={"float-right"}
									variant={"pill"}
									label
									color={"success"}
									size={"sm"}
								/>
							</div>
							<div>
								<small className="text-muted">
									Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
								</small>
							</div>
						</div>

						<div className="aside-options">
							<div className="clearfix mt-3">
								<small>
									<b>Option 3</b>
								</small>
								<AppSwitch
									className={"float-right"}
									variant={"pill"}
									label
									color={"success"}
									defaultChecked
									size={"sm"}
									disabled
								/>
								<div>
									<small className="text-muted">Option disabled.</small>
								</div>
							</div>
						</div>

						<div className="aside-options">
							<div className="clearfix mt-3">
								<small>
									<b>Option 4</b>
								</small>
								<AppSwitch
									className={"float-right"}
									variant={"pill"}
									label
									color={"success"}
									defaultChecked
									size={"sm"}
								/>
							</div>
						</div>
						{/* 
            <hr />
            <h6>System Utilization</h6>

            <div className="text-uppercase mb-1 mt-4">
              <small>
                <b>CPU Usage</b>
              </small>
            </div>
            <Progress className="progress-xs" color="info" value="25" />
            <small className="text-muted">348 Processes. 1/4 Cores.</small>

            <div className="text-uppercase mb-1 mt-2">
              <small>
                <b>Memory Usage</b>
              </small>
            </div>
            <Progress className="progress-xs" color="warning" value="70" /> */}
						{/* <small className="text-muted">11444GB/16384MB</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>SSD 1 Usage</b></small>
            </div>
            <Progress className="progress-xs" color="danger" value="95" />
            <small className="text-muted">243GB/256GB</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>SSD 2 Usage</b></small>
            </div>
            <Progress className="progress-xs" color="success" value="10" />
            <small className="text-muted">25GB/256GB</small> */}
					</TabPane>
				</TabContent>
			</React.Fragment>
		);
	}
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

export default withRouter(DefaultAside);
