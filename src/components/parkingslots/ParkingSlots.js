import React from 'react';
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Button,  Row, Col } from 'reactstrap';
import classnames from 'classnames';
import ParkingTimeForm from './ParkingTimeForm';
import firebase from './../../firebase';


export default class ParkingSlots extends React.Component {
constructor(props) {
    super(props);
    this.path = firebase.database().ref();
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.bookSlot = this.bookSlot.bind(this);
    this.changeSlotColor = this.changeSlotColor.bind(this);
    this.checkSlotAvailability = this.checkSlotAvailability.bind(this);

    this.state = {
      booked:[],
      activeTab: '1',
      showSlots:false,
      rSelected:'',
      date:'',
      time:'',
      hours:''
    };
}

style = {
  margin:{  
      margin:'10px 0px'
  }
}

disabledStyle = {
  backgroundColor:'yellow',
  color:'#000'
}

handleChange(e){
    this.setState({[e.target.name]:e.target.value, rSelected:''});
}


componentDidMount(){
  let uid = JSON.parse(localStorage.getItem('user')).uid;
  this.path.child(`users/${uid}/info`).once('value', snap=>{
    this.setState({info:snap.val()})
  })
  this.changeSlotColor()
  
}


  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  checkSlotAvailability(){
    let {rSelected}  = this.state;
    let uTime = this.state.time;
    let uDate = this.state.date;
    let uHours = this.state.hours;

    if(rSelected===''){
      alert('select a slot to proceed')
      return
    }

    if(!this.handleShowSlots()){
      return 
    }

    let uid = JSON.parse(localStorage.getItem('user')).uid;
    this.path.child(`slots/slot${rSelected}/bookings`).once('value', (snap)=>{
    let flag = false;

      if(snap.val()===null){
        alert('slot is available')
        flag = true;
      }
let data = [];

for(let key in snap.val()){
  for(let key2 in snap.val()[key]){
    data.push(snap.val()[key][key2]);
  }
}

for(let key in data){
  alert(data[key])
  if(data[key]===undefined){
    console.log('continuing')
    continue
  }
    // get slot's booking time form database
        let {time, date, hours} = data[key];
        let slotStartTime = new Date(`${date}T${time}:00`).getTime();
          
        // get end time
        let dd = time.split(':');
        let hh = hours.split(' ');
        let endHours = `${Number(dd[0])+Number(hh[0])}:${dd[1]}`
        endHours = endHours.split(':')[0].length<=1? `0${endHours}` : endHours;

        let slotEndTime = new Date(`${date}T${endHours}:00`).getTime(); 


        // get booking time for slot from user

        let userStartTime = new Date(`${uDate}T${uTime}:00`).getTime();

        // get end time
        let dd2 = uTime.split(':');
        let hh2 = uHours.split(' ');
        let userEndHours = `${Number(dd2[0])+Number(hh2[0])}:${dd2[1]}`
        userEndHours = userEndHours.split(':')[0].length<=1? `0${userEndHours}` : userEndHours;
        console.log(userEndHours)
        let userEndTime = new Date(`${uDate}T${userEndHours}:00`).getTime();


        
        if(userStartTime===slotStartTime){
          // alert('slot is not available for specified time  1')
          return
        }
        else if(userEndTime===slotEndTime){
          // alert('slot is not available for specified time   2')  
          return
        }
       
        else if(userStartTime>=slotStartTime&&userEndTime<=slotEndTime){
          // alert('slot is not available for specified time  3')          
          return
        }
        else if((userStartTime>slotStartTime&&userStartTime<slotEndTime) || (userEndTime>slotStartTime&&userEndTime<slotEndTime)){
          // alert('slot is not available for specified time 4')
          return
        }
        else if(userStartTime<slotStartTime && userEndTime>slotEndTime){
          // alert('slot is not available for specified time 5')
          return
        }

        else{
          alert('slot is available')
          flag = true
        } //else if ladder closed

    
 
}

  
      // if slot is available then reserve
      if(flag){ 
        
        let pushKey = this.path.child(`slots/slot${rSelected}/bookings/${uid}`).push().getKey();
        this.path.child(`/slots/slot${rSelected}/bookings/${uid}/${pushKey}`).set({
          time:this.state.time,
          hours:this.state.hours,
          date:this.state.date,
          booker:uid,
          pushKey:pushKey,
          booked:rSelected,
          name:this.state.info.fullName,
          email:this.state.info.email,
        });
        
           
        this.path.child(`users/${uid}/history`).push({
          id:rSelected,
          time:this.state.time,
          hours:this.state.hours,
          date:this.state.date,
          booked:rSelected,
          name:this.state.info.fullName,
          email:this.state.info.email,
        })
        .then(()=>window.location='/userdashboard')
      }
    })
  }

   bookSlot(){
    this.checkSlotAvailability();
  }
  //function closes here


  changeSlotColor(){
    let uid = JSON.parse(localStorage.getItem('user')).uid;
    // this.path.child(`slots/slot1/bookings/${uid}`).once('value', (snap)=>{
    //   console.log(snap.val())

    //   // get data from slots node
    // })//on ends here
    
    this.path.child('slots').on('value', s =>{
      let arr = [];
      for(let i=1; i<=18; i++){
        this.path.child(`slots/slot${i}/bookings/${uid}`).once('value', snap=>{
          if(snap.val() !== null){

            for(let key in snap.val()){

              // console.log(snap.val())
             // get current time and booking time for comparision
             let cTime = new Date();
             // cTime.setMilliseconds(0);
             cTime = cTime.getTime();

             let {date, time, hours} = snap.val()[key]
             
             let slotStartTime =  new Date(`${date}T${time}:00`).getTime();
             let dd = time ? time.split(':'): '';
             let hh = hours? hours.split(' '):'';
             let endHours = `${Number(dd[0])+Number(hh[0])}:${dd[1]}`
             endHours = endHours.split(':')[0].length <=1? `0${endHours}`: endHours;

             let slotEndTime = new Date(`${date}T${endHours}:00`).getTime();
           
             if(cTime>=slotStartTime && cTime<=slotEndTime){
               arr.push(i)
             }
             else{
               continue
             }

            }//for loop ends here
            
          }
        }) //once closed
      }// for loop closed
      this.setState({booked:arr});

    })// outer on closed


    // this.path.child(`slots/slot2/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(2)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here


    // //for slot 3

    // this.path.child(`slots/slot3/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(3)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here




    // //for slot 4

    // this.path.child(`slots/slot4/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(4)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here


    // // for slot 5

    // this.path.child(`slots/slot5/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(5)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here


    // // for slot 6

    // this.path.child(`slots/slot6/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(6)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here


    // // for slot 7

    // this.path.child(`slots/slot7/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(7)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here




    
    // // for slot 8

    // this.path.child(`slots/slot8/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(8)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here




    
    // // for slot 9

    // this.path.child(`slots/slot9/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(9)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here




    
    // // for slot 10

    // this.path.child(`slots/slot10/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(10)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here






    // // for slot 11

    // this.path.child(`slots/slot11/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(11)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here





    
    // // for slot 12

    // this.path.child(`slots/slot12/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(12)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here





    // // for slot 13

    // this.path.child(`slots/slot13/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(13)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here





    
    // // for slot 14

    // this.path.child(`slots/slot14/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(14)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here





    
    // // for slot 15

    // this.path.child(`slots/slot15/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(15)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here




    
    // // for slot 16

    // this.path.child(`slots/slot16/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(16)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here




    
    // // for slot 17

    // this.path.child(`slots/slot17/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(17)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here



    
    // // for slot 18

    // this.path.child(`slots/slot18/bookings`).once('value', (snap)=>{
    //   // console.log(snap.val())

    //   // get data from slots node
    //   for(let key in snap.val()){
    //     // get current time and booking time for comparision

    //     let cTime = new Date();
    //     cTime.setMinutes(0);
    //     cTime.setSeconds(0);
    //     cTime.setMilliseconds(0);
    //     cTime = cTime.getTime();
    //     let {date, time, hours} = snap.val()[key]
        
    //     let bTime = new Date(`${date}T${time}:00`).getTime()
    //     let diff = (bTime-cTime)
    //     let e = Number(hours.slice(0,2))
    //     let s = Number(time.slice(0,2))
    //     let makeTime = (e+s).toString().length>1?(e+s):`0${(e+s)}`;
        
        
    //     // get end time of booking
    //     let endTime = new Date(`${date}T${makeTime}:00:00`).getTime();
        
        
    //     if(diff<=0 && (cTime<endTime)){
    //     let arr = [...this.state.booked]
    //     arr.push(18)
    //       this.setState({booked:arr});
    //       break;
          
    //     } else if(diff>0){
    //       console.log('else if',diff)
    //     } 
    //       else{
    //         console.log('nothing')
    //       }
    //   }//for loop ends here
    // })//on ends here

  }//changeSlotColor() ends 


  onRadioBtnClick(rSelected) {
    this.setState({ rSelected });
  }


  handleShowSlots = () =>{
    // get hours in number format
    let selectedDate = new Date(`${this.state.date}T00:00:00`).getTime();
    let now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0)
    now.setMilliseconds(0)
    

    // get reservation expiration time
    let dd = this.state.time.split(':');
    let hh = this.state.hours.split(' ');
    let endHours = `${Number(dd[0])+Number(hh[0])}:${dd[1]}`


    let selectedDate2 = new Date(`${this.state.date}T${this.state.time}:00`).getTime();
    // if((new Date(`${this.state.date}T${this.state.time}`).getHours()+hours)>18){
    //   alert('Time cannot exceed 18:00')
    //   return false
    // }

    if((new Date(`${this.state.date}T${endHours}:00`).getTime())   >  (new Date(`${this.state.date}T18:00:00`)).getTime()){
      alert('Time cannot exceed 6:00 PM')
      return false
    }
    else if(!this.state.time || !this.state.hours || this.state.time === '-- --' || this.state.hours==='-- --'){
      alert('Please fillout all fields');
      return false
    }
    else if(selectedDate2 < (new Date().getTime()) ){
      alert('select current or future time')
      return false
    }
    else if(selectedDate < now.getTime()){
      alert('date should be now or future')
      return false
    }
    else{
      console.log('true')
      this.setState({showSlots:true})
      return true
    }
  }



  render() {
    return (
      <Container md='5' >
        <h1 style={{fontWeight:'300', marginBottom:'30px', marginTop:'20px'}}>Reserve Parking Space</h1>

          <ParkingTimeForm  
          showButton={!this.state.showSlots}
          // showButton={true}

          date={this.state.date}
          errorMessage = {this.state.errorMessage}
           onClick={this.handleShowSlots}
           handleChange={this.handleChange} 
          //  date={this.state.date}
           hours={this.state.hours}
           time={this.state.time}
           />
           {/* {true ? */}
          { this.state.showSlots ?
        <>
             <Nav tabs > 

          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Area 1
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Area 2
            </NavLink>
          </NavItem>
        
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              Area 3
            </NavLink>
          </NavItem>
        </Nav>


        
        <TabContent activeTab={this.state.activeTab} style={{border:'1px solid #ccc'}}>
          <TabPane tabId="1">
            <Row>
              <Col  md='5'>
                <Row style={this.style.margin}>
                    <Col>
                    <Button 
                     style={this.state.booked.indexOf(1)>=0?this.disabledStyle:{}}
                    //  disabled={this.state.booked.indexOf(1)>=0?true:false}
                     outline 
                     onClick={this.onRadioBtnClick.bind(this,1)}
                     active={this.state.rSelected === 1 }
                     color='primary'
                     >Slot 01
                     </Button>

                    </Col>
                    <Col>
                        <Button 
                         style={this.state.booked.indexOf(2)>=0?this.disabledStyle:{}}
                        //  disabled={this.state.booked.indexOf(2)>=0?true:false}
                        
                         outline
                         onClick={this.onRadioBtnClick.bind(this,2)}
                         active={this.state.rSelected === 2 }
                         color='primary'>Slot 02</Button>
                    </Col>
                </Row>

                <Row style={this.style.margin}>
                    <Col>
                        <Button 
                        style={this.state.booked.indexOf(3)>=0?this.disabledStyle:{}}                       
                         outline
                        // disabled={this.state.booked.indexOf(3)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,3)}
                        active={this.state.rSelected === 3 } 
                        color='primary'>Slot 03</Button>
                    </Col>
                    <Col>
                        <Button outline 
                        style={this.state.booked.indexOf(4)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(4)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,4)}
                        active={this.state.rSelected === 4 }
                        color='primary'>Slot 04</Button>
                    </Col>
                </Row>

                <Row style={this.style.margin}>
                    <Col>
                    <Button outline
                    style={this.state.booked.indexOf(5)>=0?this.disabledStyle:{}}
                    // disabled={this.state.booked.indexOf(5)>=0?true:false}
                    onClick={this.onRadioBtnClick.bind(this,5)}
                    active={this.state.rSelected === 5 }
                    color='primary'>Slot 05</Button>
                    </Col>
                    <Col>
                        <Button outline 
                        style={this.state.booked.indexOf(6)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(6)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,6)}
                        active={this.state.rSelected === 6 }
                        color='primary'>Slot 06</Button>
                    </Col>
                </Row>
              </Col>
            </Row>
          </TabPane>


          <TabPane tabId="2">
          <Row>
              <Col  md='5'>
                <Row style={this.style.margin}>
                    <Col>
                    <Button outline 
                    style={this.state.booked.indexOf(7)>=0?this.disabledStyle:{}}
                    // disabled={this.state.booked.indexOf(7)>=0?true:false}
                    onClick={this.onRadioBtnClick.bind(this,7)}
                    active={this.state.rSelected === 7 }
                    color='primary'>Slot 07</Button>
                    </Col>
                    <Col>
                        <Button outline 
                        style={this.state.booked.indexOf(8)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(8)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,8)}
                        active={this.state.rSelected === 8 }
                        color='primary'>Slot 08</Button>
                    </Col>
                </Row>

                <Row style={this.style.margin}>
                    <Col>
                        <Button outline 
                        style={this.state.booked.indexOf(9)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(9)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,9)}
                        active={this.state.rSelected === 9 }
                        color='primary'>Slot 09</Button>
                    </Col>
                    <Col>
                        <Button outline 
                        style={this.state.booked.indexOf(10)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(10)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,10)}
                        active={this.state.rSelected === 10 }
                        color='primary'>Slot 10</Button>
                    </Col>
                </Row>

                <Row style={this.style.margin}>
                    <Col>
                         <Button outline
                         style={this.state.booked.indexOf(11)>=0?this.disabledStyle:{}}
                        //  disabled={this.state.booked.indexOf(11)>=0?true:false}
                         onClick={this.onRadioBtnClick.bind(this,11)}
                         active={this.state.rSelected === 11 }
                         color='primary'>Slot 11</Button>
                    </Col>
                    <Col>
                        <Button outline
                        style={this.state.booked.indexOf(12)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(12)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,12)}
                        active={this.state.rSelected === 12 }
                        color='primary'>Slot 12</Button>
                    </Col>
                </Row>
              </Col>
            </Row>
          </TabPane>


          <TabPane tabId="3">
          <Row>
              <Col  md='5'>
                <Row style={this.style.margin}>
                    <Col>
                    <Button outline 
                    style={this.state.booked.indexOf(13)>=0?this.disabledStyle:{}}
                    // disabled={this.state.booked.indexOf(13)>=0?true:false}
                    onClick={this.onRadioBtnClick.bind(this,13)}
                    active={this.state.rSelected === 13 }
                    color='primary'>Slot 13</Button>
                    </Col>
                    <Col>
                        <Button outline 
                        style={this.state.booked.indexOf(14)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(14)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,14)}
                        active={this.state.rSelected === 14 }
                        color='primary'>Slot 14</Button>
                    </Col>
                </Row>

                <Row style={this.style.margin}>
                    <Col>
                        <Button outline 
                        style={this.state.booked.indexOf(15)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(15)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,15)}
                        active={this.state.rSelected === 15 }
                        color='primary'>Slot 15</Button>
                    </Col>
                    <Col>
                        <Button outline 
                        style={this.state.booked.indexOf(16)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(16)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,16)}
                        active={this.state.rSelected === 16 }
                        color='primary'>Slot 16</Button>
                    </Col>
                </Row>

                <Row style={this.style.margin}>
                    <Col>
                    <Button outline 
                        style={this.state.booked.indexOf(17)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(17)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,17)}
                        active={this.state.rSelected === 17 }
                        color='primary'>Slot 17</Button>
                    </Col>
                    <Col>
                        <Button outline 
                        style={this.state.booked.indexOf(18)>=0?this.disabledStyle:{}}
                        // disabled={this.state.booked.indexOf(18)>=0?true:false}
                        onClick={this.onRadioBtnClick.bind(this,18)}
                        active={this.state.rSelected === 18 }
                        color='primary'>Slot 18</Button>
                    </Col>
                </Row>
              </Col>
            </Row>
          </TabPane>
        </TabContent> 
        <Button onClick={this.bookSlot}>Book Slot</Button>
        </>
        : null}
      </Container>
    );
  }
}