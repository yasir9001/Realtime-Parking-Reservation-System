import React, { Component } from 'react'
import ParkingSlots from './../parkingslots/ParkingSlots'
import {BrowserRouter, Route} from 'react-router-dom';
import NavBar  from './../navbar/NavBar';
import firebase from './../../firebase';
import Feedback from './Feedback';
import History from './History';
import Home from './Home'
import Mailbox from './Mailbox';
export class UserDashboard extends Component {
  render() {
    
    return (
      <BrowserRouter>
      <div>
        <Route path='/userdashboard' render={() => {
          return <NavBar
                  link1='Home' link1Target='/userdashboard'
                  link2='Reserve Parking' link2Target='/userdashboard/reserve'
                  link3='History' link3Target='/userdashboard/history'
                  link4='Feedback' link4Target='/userdashboard/feedback'
                  link6='Mail' link6Target='/userdashboard/mailbox'
                  link5='Logout' logout={()=>{firebase.auth().signOut().then(()=>window.location='/')}}
                  style={{cursor:'pointer'}}
           />
          }}  />
        <Route path='/userdashboard' render={()=> <Home />} exact/>
        <Route path='/userdashboard/reserve' render={()=> <ParkingSlots />} />
        <Route path='/userdashboard/mailbox' render={()=> <Mailbox />} />
        <Route path='/userdashboard/history' render={()=> <History />} />
        <Route path='/userdashboard/feedback' render={()=> <Feedback />} />

      </div>
      </BrowserRouter>
      
    )
  }
}

export default UserDashboard
