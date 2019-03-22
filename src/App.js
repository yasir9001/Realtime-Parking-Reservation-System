import React, { Component } from 'react';
// import './App.css'
// import firebase from 'firebase'
import NavBar from './components/navbar/NavBar';
import Signup from './components/signup/Signup'
import {BrowserRouter, Route} from 'react-router-dom';
import Login from './components/login/Login'
import UserDashboard from './components/userdashboard/UserDashboard'
import AdminDashboard from './components/admindashboard/AdminDashboard';
class App extends Component {
  render() {
    return (
      <div className="App">
      <BrowserRouter>
        <>
          <Route path='/'  render={() => <NavBar />}  exact/>
          <Route path='/signup' render={() => <Signup />}  exact/>
          <Route path='/' render={() => <Login />} exact />
          <Route path='/userdashboard' render={() => <UserDashboard />}  />
          <Route path='/admindashboard' render={()=> <AdminDashboard />} />
        </>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
