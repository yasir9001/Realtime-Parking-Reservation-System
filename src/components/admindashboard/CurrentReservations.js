import React, { Component } from 'react'
import {Container, Row, Col, Table, Button} from 'reactstrap';
import firebase from './../../firebase';

export class CurrentReservations extends Component {
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this)
        this.path = firebase.database().ref();
        this.state = {
            modal: false,  
            reservations:[]          
        }
    }
    
    componentDidMount(){
        this.path.child(`slots`).on('value', snap =>{
            let arr = [];
            for(let key in snap.val()){
                for(let key2 in snap.val()[key]){
                    for(let key3 in snap.val()[key][key2]){
                        for(let key4 in snap.val()[key][key2][key3]){
                            
                            let slot = snap.val()[key][key2][key3][key4]
                            if(slot.booker!==undefined){

                            let {date, time, hours, booked, booker, pushKey} = slot;

                            let dd = time ? time.split(':'): '';
                            let hh = hours? hours.split(' '):'';
                            let endHours = `${Number(dd[0])+Number(hh[0])}:${dd[1]}`
                            endHours = endHours.split(':')[0].length <=1? `0${endHours}`: endHours;

                            let slotEndTime = new Date(`${date}T${endHours}:00`).getTime();
                            console.log(new Date(slotEndTime))
                            let now = new Date().getTime();
                            
                                if(now>=slotEndTime){
                                    this.path.child(`slots/slot${booked}/bookings/${booker}/${pushKey}`).remove();
                                }   
                                else{
                                    arr.unshift(slot)
                                    this.setState({msg:null})
                                }
                            }//outer if closed
                            else{
                                this.setState({msg:'No Active Reservations'})
                            }
                        }
                    }
                }
            }
            this.setState({reservations:arr})
        })// on closes here
    
    }
    
    toggle(pushKey){
        
    }
    closeModal = ()=>{
        // this.setState({modal:false})
    }
    
    delete = (booker, id)=>{
        this.path.child(`users/${booker}/selected`).set({slotBooked:""})
        this.path.child(`slots/slot${id}/bookings/${booker}`).remove()
    }
    
    render() {
    
    return (
      <Container>
            <Row>
            {/* <div>
          <Modal isOpen={this.state.modal} toggle={this.closeModal} className={this.props.className}>
            <ModalHeader toggle={this.closeModal}>{this.state.msg?this.state.msg.name:''}</ModalHeader>
            <ModalBody>
              {this.state.msg.message}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.closeModal}>Close</Button>
            </ModalFooter>
          </Modal>
        </div> */}
                <Col md xs={11}>
            <h1 style={{fontWeight:'300'}}>Active Reservations</h1>

                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    Name
                                </th>
                                <th>
                                    Email
                                </th>
                                <th>
                                    Date
                                </th>
                                <th>
                                    Time
                                </th>
                                <th>
                                    Hours
                                </th>
                                <th>
                                  Slot ID
                                </th>
                                <th>
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                                    {/* <tr>
                                        <td>dsd</td>
                                        <td>ssssd</td>
                                    </tr> */}
                                    {
                                        
                                        this.state.reservations ? this.state.reservations.map((e,i)=>{
                                          return <tr key={i} > 
                                              <td>{e.name}</td>
                                              <td>{e.email}</td>
                                              <td>{e.date}</td>
                                              <td>{e.time}</td>
                                              <td>{e.hours}</td>
                                              <td>{e.booked}</td>
                                              <td><Button onClick={this.delete.bind(this,e.booker,e.booked)}outline color='danger'>X</Button></td>
    
                                          </tr>
                                      }) : null
                                    }
                        </tbody>

                        
                    </Table>
                    {
                            this.state.msg&&this.state.reservations.length===0 ? <p 
                                style={{fontSize:'20px', textAlign:'center'}}
                            >
                                {this.state.msg} 
                            </p> : null
                        }
                </Col>
            </Row>
      </Container>
    )
    }
}

export default CurrentReservations
