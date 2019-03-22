import React, { Component } from 'react'
import firebase from './../../firebase';
import {FormGroup, FormText, Col,  Input, Button} from 'reactstrap';

export class Signup extends Component {
    constructor(props){
        super(props);
        this.path = firebase.database().ref().child('users');
        this.handleChange = this.handleChange.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.state = {
            fullName:'',
            email:'',
            password:'',
            cnfrmPassword:'',
        }
    }

    handleChange(e){
        this.setState({[e.target.name]:e.target.value});
    }

    handleSignup(){
        firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user)=> {
            this.path.child(`${user.user.uid}`).set({
                info:{
                    fullName: this.state.fullName,
                    email: this.state.email,
                },
                selected:{
                    slotBooked:""
                }
            })
            window.location = '/'
        })
        .catch((error)=> alert(error))
    }
    render() {
    return (
        <Col sm={{size:'10', offset:'1'}} md={{size:'6', offset:'3'}}>

        <div style={{margin:'10px auto', width:'80%'}}>
        <h1 style={{fontWeight:'300', marginBottom:'30px', marginTop:'20px'}}>Create New Account</h1>
    <FormGroup>
        <Input onChange={this.handleChange} value = {this.state.fullName} type="text" name="fullName" placeholder="Full name" required/>
    </FormGroup>
    
    <FormGroup>
      <Input onChange={this.handleChange} value = {this.state.email} type="email" name="email" id="email" placeholder="Email" required/>
    </FormGroup>

    <FormGroup>
      <Input onChange={this.handleChange} value = {this.state.password} type="password" name="password" id="password" placeholder="Password" required />
    </FormGroup>

    <FormGroup>
      <Input onChange={this.handleChange} value = {this.state.cnfrmPassword} type="password" name="cnfrmPassword" id="cfrmpassword" placeholder="Confirm Password" required />
    </FormGroup>


    <FormGroup className="text-right">
        <Button onClick={this.handleSignup}>Register</Button>
    </FormGroup>

    <FormGroup>
        <FormText inline>
        Already  have an account  
        </FormText>
        <Button color='link' onClick={()=> window.location = '/'}>Login</Button>
    </FormGroup>
  </div>
    </Col>
    )
  }
}

export default Signup
