import React, { Component } from 'react'
import { Button,Container, Modal, ModalHeader, ModalBody, ModalFooter,} from 'reactstrap';
import firebase from './../../firebase';


export class Mailbox extends Component {
constructor(props){
  super(props);
  this.toggle = this.toggle.bind(this)
  this.path = firebase.database().ref();
  this.state = {
    mails:[],
    modal:false,
    show:true
      }
  }


  componentDidMount(){
    let uid = JSON.parse(localStorage.getItem('user')).uid;

    this.path.child(`users/${uid}/mailbox`).on('value', (snap)=>{
        let data = [];
        if(snap.val()===null){
          this.setState({msg:'Mail box is empty'})
        }
      for(let key in snap.val()){
        data.unshift(snap.val()[key])
      }
      this.setState({mails:data})
      console.log(this.state.mails)
    })
  }


  showText = ()=>{
    this.setState({show:false})
  }
  toggle(data){
      this.setState({modal:true, current:data})
      // console.log(data)
  } 
    

  closeModal = ()=>{
    this.setState({modal:false})
}

  render() {
    let icon = <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
    return (
      
      <Container >
        <div>
          <Modal isOpen={this.state.modal} toggle={this.closeModal} className={this.props.className}>
            <ModalHeader toggle={this.closeModal}>from : System Admin</ModalHeader>
            <ModalBody>
              Hey 
               {this.state.current ? ' '+this.state.current.name :'user'},
            </ModalBody>
            
            <ModalBody>
              {this.state.current ? this.state.current.replyMsg:''}
            </ModalBody>

            <ModalBody>
              <Button color='link' disabled block>in reply to your feedback ... </Button>
              {this.state.current&&this.state.show ? (this.state.length<=50?this.state.current.msg:this.state.current.msg.slice(0,50)):null}
              {this.state.show?<Button color='link' onClick={this.showText}>view more</Button>:null}
              {!this.state.show?this.state.current.msg:null}
            </ModalBody>

            <ModalFooter>
              <Button color="secondary" onClick={this.closeModal}>Close</Button>
            </ModalFooter>
          </Modal>
        </div>

        <div >
        <h1 style={{fontWeight:'300', marginBottom:'30px', marginTop:'20px'}}>Mails By Admin</h1>
          <div>
                {
                  this.state.mails? this.state.mails.map((e,i)=>{
                    return <>
                    <p key={i}
                    onClick={this.toggle.bind(this, e)}
                     style={{cursor:'pointer', border:'1px solid #ccc', padding:'10px', borderRadius:'5px'}}>
                        {
                    								
                    <><span>{icon}</span><span>{e.replyMsg.slice(0,30)}</span></>
                        } . . . 
                    </p></>
                  }) : ''
                }
              
          </div>
        </div>
        {
          this.state.msg && this.state.mails.length === 0 ? 
          <p style={{fontSize:'20px'}}>{this.state.msg}</p> : null
        }
      </Container>
    )
  }
}

export default Mailbox
