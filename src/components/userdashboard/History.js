// @ts-nocheck

import React, { Component } from 'react'
import {Table} from 'reactstrap';
import firebase from './../../firebase';
import {Container} from 'reactstrap'
export class History extends Component {
    constructor(props){
        super(props);
        this.path = firebase.database().ref();
        this.state = {
            history:[]
        }
    }
    
    componentDidMount(){
        let uid = JSON.parse(localStorage.getItem('user')).uid;
        this.path.child(`users/${uid}/history`).on('value',(snap)=>{
            let data = [];
            for(let key in snap.val()){
                data.unshift(snap.val()[key]);
            }
            this.setState({history:data});
            console.log(this.state.history);

        })
    }
  render() {
    return (
        <Container>
        <h1 style={{fontWeight:'300', marginBottom:'30px', marginTop:'20px'}}>All Time Parking History</h1>
      <Table>
          <thead>
              <tr>
                  <th>Area</th>
                  <th>Slot</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
              </tr>
          </thead>
          <tbody>
          {
            this.state.history.map((e,i)=>{
                return <tr key={i}>
                    <td>Area{(e.id>=0&&e.id<=6)?'1':((e.id>=7&&e.id<=12) ? '2':'3')}</td>
                    <td>slot {e.id}</td>
                    <td>{e.date}</td>
                    <td>{e.time}</td>
                    <td>{e.hours}</td>
                </tr>
            })
        }
          </tbody>
        
      </Table>
     </Container> 
    )
  }
}

export default History