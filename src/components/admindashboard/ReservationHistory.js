import React, { Component } from 'react'
import {Container, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import firebase from './../../firebase';

export class ReservationHistory extends Component {
  constructor(props){
    super(props);
    this.toggle = this.toggle.bind(this)
    this.path = firebase.database().ref();
    this.state = {
        modal: false,            
        msg:'',
        history:[]
    }
}

componentDidMount(){
    // let uid = JSON.parse(localStorage.getItem('user')).uid
    this.path.child(`users`).on('value', (snap) =>{
        let data = [];
        for(let key in snap.val()){
           data.unshift(snap.val()[key].history)
        }
  
        let arr = []
        for(let key in data){
            for(let key2 in data[key]){
              arr.unshift(data[key][key2]);
            }
        }
        this.setState({history:arr})
        console.log(arr)
    })//on closed

}

toggle(pushKey){
    this.path.child(`admin/feedback/${pushKey}`).once('value', snap=>{
        this.setState({msg:snap.val(), modal:true})
        console.log(this.state.msg)
    })
}
closeModal = ()=>{
    this.setState({modal:false})
}

delete = (pushKey)=>{
    // this.path.child(`admin/feedback/${pushKey}`).remove()
}

render() {

return (
  <Container>
        <Row>
        <div>
      <Modal isOpen={this.state.modal} toggle={this.closeModal} className={this.props.className}>
        <ModalHeader toggle={this.closeModal}>{this.state.msg?this.state.msg.name:''}</ModalHeader>
        <ModalBody>
          {this.state.msg.message}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.closeModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
            <Col>
            <h1 style={{fontWeight:'300'}}>Users Parking History</h1>

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
                        </tr>
                    </thead>
                    <tbody>
                                {/* <tr>
                                    <td>dsd</td>
                                    <td>ssssd</td>
                                </tr> */}
                                {
                                    
                                    this.state.history ? this.state.history.map((e,i)=>{
                                      return <tr key={i} > 
                                          <td>{e.name}</td>
                                          <td>{e.email}</td>
                                          <td>{e.date}</td>
                                          <td>{e.time}</td>
                                          <td>{e.hours}</td>
                                          <td>{e.booked}</td>


                                      </tr>
                                  }) : null
                                }
                    </tbody>
                </Table>
            </Col>
        </Row>
  </Container>
)
}
}

export default ReservationHistory
