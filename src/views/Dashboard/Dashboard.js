import React, { Component, lazy, Suspense } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Redirect } from 'react-router-dom';
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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import DefaultAside from '../../containers/DefaultLayout/DefaultAside';
const axios = require('axios');
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.username
    };
  }

  componentDidMount() {
    /* Can be changed by getting the username when user logs in. */
    axios
      .get('http://localhost:5000/api/user/getUserName', {
        headers: {
          'milaap-auth-token': localStorage.getItem('milaap-auth-token')
        }
      })
      .then((resp) => {
        console.log(resp.data.username);
        this.setState({ username: resp.data.username });
      })
      .catch((err) => {
        console.log(err, 'Error in Verifying JWT');
        this.setState({ username: false });
        // browserHistory.push('/login');
        // redirectTo('/login');
      });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  render() {
    if (this.state.username === false) {
      return <Redirect to="/login" />;
    }
    return (
      <>
        <div className="animated fadeIn ">
          <center>
            <h1>Dashboard</h1>
          </center>
        </div>
      </>
    );
  }
}

export default Dashboard;
