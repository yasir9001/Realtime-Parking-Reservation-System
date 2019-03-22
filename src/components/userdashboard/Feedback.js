import React, { Component } from 'react'
import firebase from './../../firebase';
import {Container, Row, Col, FormGroup, Input,Label, Button} from 'reactstrap';
export class Feedback extends Component {
  constructor(props){
    super(props);
    this.path = firebase.database().ref();
    this.state = {
      choice:'',
      message:'',
      info:''
    }
}

componentDidMount(){
  let uid = JSON.parse(localStorage.getItem('user')).uid;
  this.path.child('users/'+uid+'/info').once('value', (snap)=>{
    this.setState({info:snap.val()})
  })
}
handleChange = (e) =>{
  this.setState({[e.target.name]:e.target.value})
  console.log(this.state.choice)
}

handleSubmit = () =>{
  let uid = JSON.parse(localStorage.getItem('user')).uid;
  let key = this.path.child('admin/feedback').push().getKey();
  this.path.child('admin/feedback/'+key).update({
   status:this.state.choice,
   message:this.state.message,
   pushKey:key,
   uid:uid, 
  name:this.state.info.fullName,
  email:this.state.info.email
  }).then((e)=>{
    // this.setState({choice:'',message:''})
    // alert('Submitted Successfully')
    window.location='/userdashboard';
  })
}

  render() {
    return (
      <Container >
      <Row>
        <h1 style={{fontWeight:'200'}}>Give Feedback</h1>

      </Row>

        <Row>          
          <Col>
          <h5>Overall how you feel about the service you received</h5>
          </Col>
          <Col xs ={11} md={11} style={{ margin:'0px auto'}}>
          
          <FormGroup>
            <Label htmlFor='n1'>
              <Input  id='n1' onChange={this.handleChange} value ='Very satisfied' type="radio" name="choice"/>
              Very satisfied
           </Label>
             <br />

            <Label htmlFor='n2'>
              <Input  id='n2' onChange={this.handleChange} value = "Satisfied" type="radio" name="choice" placeholder="Full name" required/>
                 Satisfied
           </Label>
             
           <br />

            <Label htmlFor='n3'>
              <Input  id='n3' onChange={this.handleChange} value =" Neither satisfied or dissatisfied" type="radio" name="choice" placeholder="Full name" required/>
              Neither satisfied or dissatisfied
           </Label>
             
           <br />

            <Label htmlFor='n4'>
              <Input  id='n4' onChange={this.handleChange} value = " Dissatisfied" type="radio" name="choice" placeholder="Full name" required/>
              Dissatisfied
           </Label>
           <br />

            <Label htmlFor='n5'>
              <Input  id='n5' onChange={this.handleChange} value ="Very dissatisfied" type="radio" name="choice" placeholder="Full name" required/>
              Very dissatisfied
           </Label>
          </FormGroup>
          </Col>
        </Row>



        <Row>
          <Col>
            <h5>How Could we improve this service</h5>
          </Col>

          <Col  xs ={11} md={11} style={{ margin:'0px auto'}}>
            <FormGroup>
            <Input
                style={{minHeight:'200px'}} 
                type='textarea'
                value={this.state.message}
                placeholder='Type your message here...'
                name='message' onChange={this.handleChange}/>
            </FormGroup>
              
          </Col>
        </Row>

        <Row  xs ={11} md={11} style={{ margin:'0px auto'}}  >
        <FormGroup >
          <div style={{textAlign:'center'}}>
            <Button color='success' onClick={this.handleSubmit}>Submit</Button>
          </div>
        </FormGroup>
        </Row>


      </Container>
    )
  }
}

export default Feedback
