import React, { Component } from 'react';
import firebase from './../../firebase';
import { Button, Col, FormGroup, Input, FormText } from 'reactstrap';


class Login extends Component {
  constructor(props){
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.handleLogin = this.handleLogin.bind(this);
      this.path = firebase.database().ref().child('Project01');

    this.state = {
        email:'',
        password:'',
    }
  }


  handleChange(e){
    this.setState({[e.target.name]:e.target.value});
  }


  handleLogin(e){
    if(this.state.email.toLocaleLowerCase() === 'parkingadmin@gmail.com' && this.state.password === 'password'){
      window.location='/admindashboard/currentreservations';
      return
    }
    firebase.auth()
    .signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((user)=>{
      e.preventDefault();
      localStorage.setItem('user',JSON.stringify(user.user));
      window.location = '/userdashboard'
      console.log(user.user)
     })

    .catch((e)=>{
      alert(e);
    })
  }


  render() {
      return (
        <div>
          <Col sm={{size:'10', offset:'1'}} md={{size:'6', offset:'3'}}>

            <div style={{margin:'10px auto', width:'80%'}}>
        <FormGroup>
          <h1 style={{fontWeight:'300', marginBottom:'30px', marginTop:'20px'}}>Login to continue</h1>
          <Input onChange={this.handleChange} value = {this.state.email} type="email" name="email" id="email" placeholder="Email" required/>
        </FormGroup>
        <FormGroup>
          <Input onChange={this.handleChange} value = {this.state.name} type="password" name="password" id="password" placeholder="Password" required />
        </FormGroup>
        
        <FormGroup className="text-right">
            <Button onClick={this.handleLogin}>Login</Button>
        </FormGroup>
        <FormGroup>
            <FormText inline>
            Don't have an account  
            </FormText>
            <Button color='link' onClick={()=> window.location = '/signup'}>Register Now</Button>
        </FormGroup>
      </div>
      </Col>

        </div>
    );
  }
}



export default Login;
