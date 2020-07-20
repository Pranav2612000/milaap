import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import logo from '../../../assets/img/brand/logo.png';

class Privacy extends Component {
  render() {
    return (
      <div style={{ overflow: 'hidden', overflowX: 'hidden', overflowY: 'hidden' }}>
        <div style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
          <br />
          <br />
          <Row>
            <Col>
              <Link to="/about-us">
                <h5 style={{ color: 'white', textAlign: 'left', marginLeft: '2%' }}>
                  About Us
                </h5>
              </Link>
            </Col>
            <Col>
              <Link to="/landing">
                <h5 style={{ color: 'white', textAlign: 'center' }}> Home </h5>
              </Link>
            </Col>
            <Col>
              <a
                href="https://forms.gle/WPCZh2JDyNfBTCJ47"
                target="_blank"
                rel="noopener noreferrer">
                <h5
                  style={{ color: 'white', textAlign: 'right', marginRight: '2%' }}>
                  Report a Bug
                </h5>
              </a>
            </Col>
          </Row>
        </div>
        <div
          className="app flex-row align-items-center"
          style={{ overflow: 'hidden' }}>
          <Container>
            <Row
              className="justify-content-center"
              style={{ margin: '0%', height: '15%' }}>
              <Card
                className="text-white bg-transparent py-5 d-md-down"
                style={{ width: '59%', backgroundColor: 'transparent', border: 0 }}>
                <CardBody
                  className="text-center"
                  style={{ backgroundColor: 'transparent', border: 0 }}>
                  <img
                    src={logo}
                    onClick={() => this.props.history.push('landing')}
                    style={{ cursor: 'pointer', height: '120px' }}
                    className="mx-auto"
                    alt="milaap"
                  />
                </CardBody>
                <h1
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    color: 'white'
                  }}>
                  Privacy Policy
                </h1>
                <br />
              </Card>
            </Row>
          </Container>
          <Row>
            <h5
              style={{
                textAlign: 'justify',
                width: '100%',
                fontSize: '13.5px',
                color: 'white',
                marginRight: '3%',
                marginLeft: '3%'
              }}>
              INTRODUCTION: The Milaap(“we” or “us”) values its visitors’ privacy.
              This privacy policy is effective from 28/06/2020; it summarizes what
              information we might collect from a person who has registered for our
              events (competitions / workshops) or for events in which we provide
              services, or other visitor (“you”) before or during such events, or
              users of our online services and applications, and what we will and
              will not do with it. Please note that this privacy policy does not
              govern the collection and use of information by individuals, groups or
              companies that are not part of or controlled by The Milaap. If you
              visit a website that we mention or link to, be sure to review its
              privacy policy before providing the site with any information. <br />{' '}
              <br />
              WHAT WE DO WITH YOUR PERSONALLY IDENTIFIABLE INFORMATION It is always
              up to you whether to disclose personally identifiable information to
              us, although if you elect not to do so, we reserve the right not to
              register you as a participant/attendee or provide you with any products
              or services. “Personally identifiable information” means information
              that can be used to identify you as an individual, such as, for
              example: your username, password. If you do provide personally
              identifiable information to us, either directly or through one of our
              members, we will: • not sell/rent/share it to or with a third party
              without your permission — although unless you opt out , we may use your
              contact information to provide you with information we believe you need
              to know or may find useful, • take reasonable precautions to protect
              the information from loss, misuse and unauthorized access, disclosure,
              alteration and destruction. • not use or disclose the information
              except: ◦ as necessary to provide services or products you have ordered
              or asked for. ◦ as required by law, for example, in response to a
              subpoena or search warrant. ◦ to outside auditors who have agreed to
              keep the information confidential. ◦ as necessary to enforce the Terms
              of Service. ◦ as necessary to protect the rights, safety, or property
              of The Milaap, its users, or others; this may include (for example)
              exchanging information with other organizations for fraud protection
              and/or risk reduction. All such created media is owned by The Milaap,
              and may be distributed by us, across our media channels online or
              offline. However, we shall try to ensure none of these can be used to
              trace you directly. If you have any issues with any media content owned
              by us, please raise a concern at milaap.techteam@gmail.com.
              <br />  <br />
              APP-SPECIFIC INFORMATION COLLECTED. Uses audio and video with
              permission. COOKIES The Milaap’s website(s) uses “cookies” to store
              personal data on your computer. We may also link information stored on
              your computer in cookies with personal data about specific individuals
              stored on servers rented, owned or controlled by The Milaap. If you set
              up your Web browser (for example, Internet Explorer or Firefox) so that
              cookies are not allowed, you might not be able to use some or all of
              the features of our website(s). EXTERNAL DATA STORAGE SITES We may
              store your data on servers provided by third party hosting vendors with
              whom we have contracted or use(d)for our administration.
              <br /> <br /> YOUR PRIVACY RESPONSIBILITIES To help protect your
              privacy, be sure: • not to share your unique codes with anyone • to
              take customary precautions to guard against “malware” (viruses, Trojan
              horses, bots, etc.), for example by installing and updating suitable
              anti-virus software.
              <br />
              <br /> INFORMATION COLLECTED FROM CHILDREN You must be at least 13
              years old to use The Milaap’s website(s) and service(s). The Milaap
              does not knowingly collect information from children under 13.
              <br /> <br />
              CHANGES TO THIS PRIVACY POLICY We reserve the right to change this
              privacy policy as we deem necessary or appropriate because of legal
              compliance requirements or changes in our practices. If you have
              provided us with an email address, we will endeavour to notify you, by
              email to that address, of any material change to how we will use
              personally identifiable information, as may be necessary.
              <br />
              <br /> QUESTIONS OR COMMENTS? If you have questions or comments about
              The Milaap's privacy policy, send an email to{' '}
              <b>milaap.techteam@gmail.com</b>. Thank you for believing in The
              Milaap!
            </h5>
          </Row>
        </div>
      </div>
    );
  }
}

export default Privacy;
