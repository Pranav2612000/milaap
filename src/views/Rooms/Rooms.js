import React, { Component, lazy, Suspense } from "react";
import "./Room.css";
import { store } from "react-notifications-component";
import { Bar, Line } from "react-chartjs-2";
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Jumbotron,
  Progress,
  Row,
  Table,
} from "reactstrap";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import DefaultAside from "../../containers/DefaultLayout/DefaultAside";
import PeerHandler from "../../containers/DefaultLayout/peerHandler";

class Room extends Component {
  constructor(props) {
    super(props);
    console.log(props.match);
    let roomName = props.match.params.roomname;
    console.log(roomName);
    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      roomName: roomName,
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.roomname != prevProps.match.params.roomname) {
      this.setState(
        {
          roomName: this.props.match.params.roomname,
        },
        () => {
          store.addNotification({
            title: "Room changed",
            message: `Entered ${this.state.roomName} `,
            type: "success",
            // insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              pauseOnHover: true,
            },
          });
        }
      );
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    return (
      <Container className="m-0 p-0 animated fadeIn">
        {/* ROOM NAME {this.state.roomName} */}
        <video id="context" autoPlay></video>
        {/* <Jumbotron> */}
        <Row className="m-0 p-0" id="videos"></Row>
        {/* </Jumbotron> */}
        {/* <video autoPlay></video> */}
        {/*<PeerHandler />*/}
      </Container>
    );
  }
}

export default Room;
