import React from 'react'
import {Col,Row,  Button,FormGroup, Input, Label} from 'reactstrap';
function ParkingTimeForm(props) {
  return (
    <>
        <Row>
            <Col md={{size:5}} style={{margin:'0px auto'}} > 
                <FormGroup inline>
                    <Label  for='date'>Booking for</Label>
                    <Input type='date'  name='date' id='id' onChange={props.handleChange}/> 
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col md={{size:5}} style={{margin:'0px auto'}}>
            <FormGroup>
          <Label for="time">Select Time</Label>
          {/* <Input value={props.time} type="select" name="time" id="time" onChange={props.handleChange}>
            <option >-- --</option>
            <option>06:00</option>
            <option>07:00</option>
            <option>08:00</option>
            <option>09:00</option>
            <option>10:00</option>
            <option>11:00</option>
            <option>12:00</option>
            <option>13:00</option>
            <option>14:00</option>
            <option>15:00</option>
            <option>16:00</option>
            <option>17:00</option>
            <option>18:00</option>
          </Input> */}

          <Input type='time' value={props.time} name='time' id='time' onChange={props.handleChange} />
        </FormGroup>


        <FormGroup>
          <Label for="hours">Select Hours</Label>
             {/* <Input value={props.hours} type="time" name="hours" id="hours" onChange={props.handleChange} /> */}
                



          <Input value={props.hours} type="select" name="hours" id="hours" onChange={props.handleChange}>
            <option >-- --</option>
            <option>01 hours</option>
            <option>02 hours</option>
            <option>03 hours</option>
            <option>04 hours</option>
            <option>05 hours</option>
            <option>06 hours</option>
          </Input>
        </FormGroup>
            </Col>
        </Row>
        {props.showButton?<Row>
            <Col  md={{size:5}} style={{margin:'0px auto', textAlign:'center'}}>
            <span style={{color:'red'}}>{props.errorMessage}</span>
            <br />
            <Button color='success' onClick={props.onClick}>Choose Slot</Button>
            </Col>
        </Row> : null}
    </>
  )
}

export default ParkingTimeForm
