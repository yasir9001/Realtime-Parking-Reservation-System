import React from 'react'
import Navbar from './../navbar/NavBar';
import {BrowserRouter, Route} from 'react-router-dom';
import firebase from 'firebase';
import CurrentReservations from './CurrentReservations'
import ReservationHistory from './ReservationHistory'
import UserFeedback from './UserFeedback'


export default function AdminDashboard() {
  return (
    
    <BrowserRouter>
    <div>
      <Route path='/admindashboard' render={() => {
        return <Navbar
                // link1='Home' link1Target='/admindashboard'
                link2='Reservations' link2Target='/admindashboard/currentreservations'
                link3='History' link3Target='/admindashboard/reservationhistory'
                link4='Feedbacks' link4Target='/admindashboard/userfeedback'
                link5='Logout' logout={()=>{firebase.auth().signOut().then(()=>window.location='/')}}
                style={{cursor:'pointer'}}
         />
        }}  />

        <Route path='/admindashboard/currentreservations'   render={()=> <CurrentReservations />} />
        <Route path='/admindashboard/reservationhistory'    render={()=> <ReservationHistory />} />
        <Route path='/admindashboard/userfeedback'          render={()=> <UserFeedback />} />

    </div>
    </BrowserRouter>
  )
}
