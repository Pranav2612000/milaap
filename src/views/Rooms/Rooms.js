import React, { Component, lazy, Suspense } from "react";
import "./Room.css";
import { store } from "react-notifications-component";
import { Container as DragContainer, Draggable } from "react-smooth-dnd";
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
      username: localStorage.getItem("uname"),
      roomName: roomName,
      vidList: props.videoHandler.videos,
    };
  }
  componentDidUpdate(prevProps) {
    let checker = (arr, target) => target.every((v) => arr.includes(v));
    if (
      !checker(prevProps.videoHandler.videos, this.props.videoHandler.videos)
    ) {
      //Once removal of dead videos is added, imlement functionality for the same here.
      this.setState({
        vidList: this.props.videoHandler.videos,
      });
    }

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

  switchContext = (e) => {
    try {
            let context = document.getElementById("context");
            context.srcObject = e.target.srcObject;
            context.play();
    }
    catch(err) {
            console.log("The selected stream is old");
    }
  };

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  swapArray = ({ removedIndex, addedIndex, payload, element }) => {
    let arr = this.state.vidList;
    var temp = arr[removedIndex];
    arr[removedIndex] = arr[addedIndex];
    arr[addedIndex] = temp;
    console.log(this.state.vidList, arr);
    this.setState({
      vidList: arr,
    });
  };

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    console.log(this.state.vidList);
    return (
      <Container className="m-0 p-0 animated fadeIn">
        <video id="context" autoPlay></video>
        <Row className="m-0 p-0" id="videos">
          <DragContainer
            onDrop={(dropResult) => this.swapArray(dropResult)}
            orientation="horizontal"
            lockAxis="x"
            dragBeginDelay={200}
            dragClass="dragClass"
            dropPlaceholder={{ className: "dropPlaceholder" }}
          >
            {this.props.videoHandler.videos.map((stream, i) => {
              return (
                <Draggable key={Math.random()}>
                  <video
                    key={Math.random()}
                    width="200px"
                    height="350px"
                    onClick={this.switchContext}
                    ref={(ref) => {
                      if (ref) ref.srcObject = stream;
                    }}
                    autoPlay
                  ></video>
                </Draggable>
              );
            })}
          </DragContainer>
        </Row>
      </Container>
    );
  }
}

export default Room;
