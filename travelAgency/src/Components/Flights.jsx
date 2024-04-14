import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import planeIcon from '../assets/images/plane-icon.png';

const Flights = () => {
  return (
    <Container>
      <Row>
        <Col md={12}>
          <h2 className='customized-text'>My Timeline</h2>
          <div className="timeline-container">
            <div className="event">
              <div className="event-date customized-text">March 25, 2024</div>
              <div className="timeline-content">
                <img src={planeIcon} className='plane-icon'/>
                <h4>Albania &nbsp;</h4>
                <svg viewBox="0 0 33 12" role="img" className="svg-icon svg-fill icon__arrow--big--toright" style={{width: "40px", height: "20px", marginBottom: '4px'}}><path pid="0" d="m32.403 5.709.005-.008-2.84-4.944a.568.568 0 0 0-.77-.195.548.548 0 0 0-.198.757l2.34 4.11H1.063a.557.557 0 0 0-.562.553c0 .306.252.553.562.553h29.879l-2.343 4.138a.549.549 0 0 0 .199.757.567.567 0 0 0 .77-.196l2.841-4.971a.544.544 0 0 0-.006-.554z" fillRule="evenodd"></path></svg>
                <h4>&nbsp; Kosovo</h4>
              </div>
            </div>
          </div>
          <div className="timeline-container">
              <div className="event">
                <div className="event-date customized-text">March 25, 2024</div>
                <div className="timeline-content">
                  <img src={planeIcon} className='plane-icon'/>
                  <h4>Albania &nbsp;</h4>
                  <svg viewBox="0 0 33 12" role="img" className="svg-icon svg-fill icon__arrow--big--toright" style={{width: "40px", height: "20px", marginBottom: '4px'}}><path pid="0" d="m32.403 5.709.005-.008-2.84-4.944a.568.568 0 0 0-.77-.195.548.548 0 0 0-.198.757l2.34 4.11H1.063a.557.557 0 0 0-.562.553c0 .306.252.553.562.553h29.879l-2.343 4.138a.549.549 0 0 0 .199.757.567.567 0 0 0 .77-.196l2.841-4.971a.544.544 0 0 0-.006-.554z" fillRule="evenodd"></path></svg>
                  <h4>&nbsp; Kosovo</h4>
                </div>
              </div>
          </div>
          <div className="timeline-container">
              <div className="event">
                <div className="event-date customized-text">March 25, 2024</div>
                <div className="timeline-content">
                  <img src={planeIcon} className='plane-icon'/>
                  <h4>Albania &nbsp;</h4>
                  <svg viewBox="0 0 33 12" role="img" className="svg-icon svg-fill icon__arrow--big--toright" style={{width: "40px", height: "20px", marginBottom: '4px'}}><path pid="0" d="m32.403 5.709.005-.008-2.84-4.944a.568.568 0 0 0-.77-.195.548.548 0 0 0-.198.757l2.34 4.11H1.063a.557.557 0 0 0-.562.553c0 .306.252.553.562.553h29.879l-2.343 4.138a.549.549 0 0 0 .199.757.567.567 0 0 0 .77-.196l2.841-4.971a.544.544 0 0 0-.006-.554z" fillRule="evenodd"></path></svg>
                  <h4>&nbsp; Kosovo</h4>
                </div>
              </div>
          </div>
          <div className="timeline-container">
              <div className="event">
                <div className="event-date customized-text">March 25, 2024</div>
                <div className="timeline-content">
                  <img src={planeIcon} className='plane-icon'/>
                  <h4>Albania &nbsp;</h4>
                  <svg viewBox="0 0 33 12" role="img" className="svg-icon svg-fill icon__arrow--big--toright" style={{width: "40px", height: "20px", marginBottom: '4px'}}><path pid="0" d="m32.403 5.709.005-.008-2.84-4.944a.568.568 0 0 0-.77-.195.548.548 0 0 0-.198.757l2.34 4.11H1.063a.557.557 0 0 0-.562.553c0 .306.252.553.562.553h29.879l-2.343 4.138a.549.549 0 0 0 .199.757.567.567 0 0 0 .77-.196l2.841-4.971a.544.544 0 0 0-.006-.554z" fillRule="evenodd"></path></svg>
                  <h4>&nbsp; Kosovo</h4>
                </div>
              </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Flights;