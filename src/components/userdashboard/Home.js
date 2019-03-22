import React, { Component } from 'react'
import firebase from './../../firebase';
import {Container, Row, Col, Card, CardBody ,CardText,Button} from 'reactstrap';
export class home extends Component {
  constructor(props){
    super(props);
    this.cancelReservation = this.cancelReservation.bind(this);
    this.path = firebase.database().ref();
    this.state = {
        bookings:[]
    }
}

cancelReservation(pushKey, id){
  let uid = JSON.parse(localStorage.getItem('user')).uid;
  this.path.child(`slots/slot${id}/bookings/${uid}/${pushKey}`).remove()
}

 componentDidMount(){
  
    let uid = JSON.parse(localStorage.getItem('user')).uid;
    
    this.path.child(`slots/`).on('value', s =>{
   
      const arr =  [];

      for(let i = 1; i<=18; i++){
        this.path.child(`slots/slot${i}/bookings/${uid}`).once('value', snap=>{

          if(snap.val()!==null){

            for(let key in snap.val()){

              let {date, time, hours, booked, booker, pushKey} = snap.val()[key];

              // let slotStartTime = new Date(`${date}T${time}:00`).getTime();

              let dd = time ? time.split(':'): '';
              let hh = hours? hours.split(' '):'';
              let endHours = `${Number(dd[0])+Number(hh[0])}:${dd[1]}`
              endHours = endHours.split(':')[0].length <=1? `0${endHours}`: endHours;
              // console.log(snap.val()[key])
              let slotEndTime = new Date(`${date}T${endHours}:00`).getTime();
              console.log(new Date(slotEndTime))
              let now = new Date().getTime();

              if(now>=slotEndTime){
                this.path.child(`slots/slot${booked}/bookings/${booker}/${pushKey}`).remove()
              }
              else{
                arr.push(snap.val()[key])
              }



              // console.log(snap.val()[key])
            }
          }// if closed
          else{
            this.setState({msg:'You have not reserved any slots'})
          }
          
        })//once closed
      }//for closed
      this.setState({bookings:arr})
      console.log(this.state.bookings)

    })// outer on closed
     

}//function  closed


  render() {
    
    return (
      <Container >
        <h1 style={{fontWeight:'300', marginBottom:'30px', marginTop:'20px'}}>Current Bookings</h1>
        <Row>
          {
            this.state.bookings ? this.state.bookings.map((e,i)=>{
              let {booked, date, time, hours } = e;
              let dd = time.split(':');
              let hh = hours.split(' ');
              let endHours = `${Number(dd[0])+Number(hh[0])}:${dd[1]}`
              endHours = endHours.split(':')[0].length<=1? `0${endHours}` : endHours;
            return  <Col key={i}>
             <div  className='text-center' style={{margin:'10px 0'}}>
                <Card>
                  <CardBody>
                    <CardText>
                        You have booked slot{booked} in Area{booked<=6?'1 ':(booked>=7&&booked<=12?'2 ':'3 ')} 
                        your time start from {time} and ends at {endHours} on {new Date(`${date}T${time}:00`).toDateString()}
                    </CardText>


                    <CardText className='text-center'>
                      <Button outline color='danger'
                        onClick={this.cancelReservation.bind(this, e.pushKey, e.booked)}
                      >Cancel Reservation</Button>
                    </CardText>


                  </CardBody>
                </Card>
              </div>

          </Col>
            }) :null
          }
          
          { this.state.msg && this.state.bookings.length===0?
                    
                    <Col>
                      <Card className='text-center'>
                        <CardBody>
                          <CardText style={{fontSize:'20px'}}>
                            {this.state.msg}
                          </CardText>
                          <CardText>
                            <Button color='success' onClick={()=> window.location='/userdashboard/reserve'}>
                                Reserve Now!
                            </Button>
                          </CardText>
                        </CardBody>
                      </Card>
                    </Col>
                    :null
                  }
        </Row>
      </Container>
    )
  }
}

export default home;


