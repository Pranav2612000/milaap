import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';
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
              <a href="https://forms.gle/WPCZh2JDyNfBTCJ47" target="_blank">
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
                    style={{ cursor: 'pointer' }}
                  />
                </CardBody>
                <h1
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    margin: '14px',
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
                margin: '10px',
                color: 'white',
                marginRight: '1%',
                marginLeft: '3%'
              }}>
              INTRODUCTION: The Distrideo Chat(“we” or “us”) values its visitors’
              privacy. This privacy policy is effective from 28/06/2020; it
              summarizes what information we might collect from a person who has
              registered for our events (competitions / workshops) or for events in
              which we provide services, or other visitor (“you”) before or during
              such events, or users of our online services and applications, and what
              we will and will not do with it. Please note that this privacy policy
              does not govern the collection and use of information by individuals,
              groups or companies that are not part of or controlled by The Distrideo
              Chat. If you visit a website that we mention or link to, be sure to
              review its privacy policy before providing the site with any
              information. WHAT WE DO WITH YOUR PERSONALLY IDENTIFIABLE INFORMATION
              It is always up to you whether to disclose personally identifiable
              information to us, although if you elect not to do so, we reserve the
              right not to register you as a participant/attendee or provide you with
              any products or services. “Personally identifiable information” means
              information that can be used to identify you as an individual, such as,
              for example: • your name, email address, phone number, course details,
              etc. If you do provide personally identifiable information to us,
              either directly or through one of our members, we will: • not
              sell/rent/share it to or with a third party without your permission —
              although unless you opt out (see below), we may use your contact
              information to provide you with information we believe you need to know
              or may find useful, such as (for example) news about our services and
              products and modifications to the Terms of Service and/or this Privacy
              Policy. • take reasonable precautions to protect the information from
              loss, misuse and unauthorized access, disclosure, alteration and
              destruction. • not use or disclose the information except: ◦ as
              necessary to provide services or products you have ordered or asked
              for, such as (for example) by providing it to one of our members
              in-charge of delivering products or services you have ordered. ◦ in
              other ways described in this privacy policy or to which you have
              otherwise consented. ◦ in the aggregate with other information in such
              a way so that your identity cannot reasonably be determined (for
              example, statistical compilations). ◦ as required by law, for example,
              in response to a subpoena or search warrant. ◦ to outside auditors who
              have agreed to keep the information confidential. ◦ as necessary to
              enforce the Terms of Service. ◦ as necessary to protect the rights,
              safety, or property of The Distrideo Chat, its users, or others; this
              may include (for example) exchanging information with other
              organizations for fraud protection and/or risk reduction. OTHER
              INFORMATION WE COLLECT We may collect other information that cannot be
              readily used to identify you, such as (for example) the domain name and
              IP address of your computer. We may use this information, individually
              or in the aggregate, for technical administration of our website(s);
              research and development; people and account administration; and to
              help us focus our marketing efforts more precisely. We may also collect
              visual information (in the form of photos/selfies/videos/snaps etc.),
              before or during our events/competitions as may be required by us for
              marketing and promotional purposes. All such created media is owned by
              The Distrideo Chat, and may be distributed by us, across our media
              channels online or offline. However, we shall try to ensure none of
              these can be used to trace you directly. If you have any issues with
              any media content owned by us, please raise a concern at
              milaap.techteam@gmail.com.   APP-SPECIFIC INFORMATION COLLECTED This
              section adheres to the information collected through our Attendance
              MIT-WPU Android application. Firebase Data collected: The application
              includes Firebase, with the following configured services: • Firebase
              Cloud Messaging - collects Instance IDs from your device, which is
              retained till we specifically delete it • Google Analytics (Firebase) -
              Google uses Google Analytics data to provide us with the Google
              Analytics measurement service. Identifiers such as cookies and app
              instance IDs are used to measure user interactions with a customer’s
              sites and/or apps, while IP addresses are used to provide and protect
              the security of the service, and to give us a sense of where in the
              world our users come from. ◦ First Party Cookies: Google Analytics
              collects first-party cookies, data related to the device/browser, IP
              address and on-site/app activities to measure and report statistics
              about user interactions on the websites and/or apps that use Google
              Analytics. ◦ IP Address: Google Analytics uses IP addresses to derive
              the geolocation of a visitor, and to protect our app service and
              provide security to us. We may apply IP masking so that Google
              Analytics uses only a portion of an IP address collected, rather than
              the entire address. In addition, we can override IPs at will using our
              IP Override feature. Non-Firebase Data collected: In the highly unusual
              scenario of a captcha resolution failure several times, we collect your
              PRN number (ERP username), captcha details along with the error page
              returned by the ERP server in order to track and resolve parsing issues
              on our side, if any. COOKIES The Distrideo Chat’s website(s) uses
              “cookies” to store personal data on your computer. We may also link
              information stored on your computer in cookies with personal data about
              specific individuals stored on servers rented, owned or controlled by
              The Distrideo Chat. If you set up your Web browser (for example,
              Internet Explorer or Firefox) so that cookies are not allowed, you
              might not be able to use some or all of the features of our website(s).
              EXTERNAL DATA STORAGE SITES We may store your data on servers provided
              by third party hosting vendors with whom we have contracted or
              use(d)for our administration. YOUR PRIVACY RESPONSIBILITIES To help
              protect your privacy, be sure: • not to share your unique codes with
              anyone • to take customary precautions to guard against “malware”
              (viruses, Trojan horses, bots, etc.), for example by installing and
              updating suitable anti-virus software. INFORMATION COLLECTED FROM
              CHILDREN You must be at least 13 years old to use The Distrideo Chat’s
              website(s) and service(s). The Distrideo Chatdoes not knowingly collect
              information from children under 13. CHANGES TO THIS PRIVACY POLICY We
              reserve the right to change this privacy policy as we deem necessary or
              appropriate because of legal compliance requirements or changes in our
              practices. If you have provided us with an email address, we will
              endeavour to notify you, by email to that address, of any material
              change to how we will use personally identifiable information, as may
              be necessary. QUESTIONS OR COMMENTS? If you have questions or comments
              about The Distrideo Chat’s privacy policy, send an email to
              milaap.techteam@gmail.com. Thank you for believing in The Distrideo
              Chat!
            </h5>
          </Row>
        </div>
      </div>
    );
  }
}

export default Privacy;
