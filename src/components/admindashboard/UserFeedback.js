import React, { Component } from 'react'
import {Container, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Input,
} from 'reactstrap';
import firebase from './../../firebase';

export class UserFeedback extends Component {

    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.sendReply = this.sendReply.bind(this);
        this.toggleReplyModal = this.toggleReplyModal.bind(this);
        this.path = firebase.database().ref();
        this.state = {
            msg:'',
            modal: false,            
            feedbacks:[],
            replyModal:false,
            replyMsg:''
        }
    }
   





    componentDidMount(){
        this.path.child('admin/feedback').on('value', (snap) =>{
            let data = [];
            if(snap.val()===null){
                console.log(snap.val())
                this.setState({warn:'No Feedbacks'})
            }
            for(let key in snap.val()){
               data.push(snap.val()[key])
            }
            this.setState({feedbacks:data})
        })
    }



    sendReply(uid){
        this.path.child(`users/${uid}/mailbox`).push({
            replyMsg:this.state.replyMsg,
            msg:this.state.msg.message,
            name:this.state.msg.name
        }).then(()=> this.setState({replyModal:false, modal:false, replyMsg:''}))
    }
    



    handleChange = (e)=>{
        this.setState({replyMsg:e.target.value})
    }



    toggle(pushKey){
        this.path.child(`admin/feedback/${pushKey}`).once('value', snap=>{
            this.setState({msg:snap.val(), modal:true})
            // console.log(this.state.msg)
        })
    }

    toggleReplyModal(){
        this.setState({replyModal:true})
    }

    
    closeModal = ()=>{
        this.setState({modal:false})
    }
    closeReplyModal = ()=>{
        this.setState({replyModal:false})    
    }
    delete = (pushKey)=>{
        this.path.child(`admin/feedback/${pushKey}`).remove()
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
              <Button color="info" onClick={this.toggleReplyModal}>Reply</Button>

            </ModalFooter>
          </Modal>
        </div>





        {/* reply modal */}

        <div>
          <Modal isOpen={this.state.replyModal} toggle={this.closeReplyModal} className={this.props.className}>
            <ModalHeader toggle={this.closeReplyModal}>{this.state.msg?'to: '+this.state.msg.email+';':''}</ModalHeader>
            <ModalBody>
                <Input type='textarea' onChange={this.handleChange} value={this.state.replyMsg} placeholder='Enter message...'/>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.sendReply.bind(this, this.state.msg.uid)}>Send</Button>
            </ModalFooter>
          </Modal>
        </div>





                <Col>
            <h1 style={{fontWeight:'300'}}>User's Feedbacks</h1>

                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    Email
                                </th>
                                <th>
                                    Message
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                                    {
                                        
                                        this.state.feedbacks.map((e,i)=>{
                                            return <tr key={i} style={{cursor:'pointer'}}> 
                                                <td onClick={this.toggle.bind(this,e.pushKey)}>{e.email}</td>
                                                <td onClick={this.toggle.bind(this,e.pushKey)}>{e.message.slice(0,50)} ......</td>
                                                <td onClick={this.toggle.bind(this,e.pushKey)}>{e.status}</td>
                                                <td onClick={this.delete.bind(this,e.pushKey)}><Button outline color='danger'>X</Button></td>

                                            </tr>
                                        })
                                    }
                        </tbody>
                    </Table>
                    {
                        this.state.warn && this.state.feedbacks.length === 0 ? <p 
                        style={{fontSize:'20px', textAlign:'center'}}
                        >
                            {
                                this.state.warn
                            }
                        </p>  : null
                    }
                </Col>
            </Row>
      </Container>
    )
  }
}





export default UserFeedback
