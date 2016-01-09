import React from 'react'
import ReactDOM from 'react-dom'


const ChatHeader = ({
  avatar,
  name,
  messagesCount
}) => {
  return (
    <div className="chat-header clearfix">
      <img src={avatar} alt="avatar" />

      <div className="chat-about">
        <div className="chat-with">Chat with {name}</div>
        <div className="chat-num-messages">already {messagesCount} messages</div>
      </div>
      <i className="fa fa-star"></i>
    </div>
  )
}

const OutMessage = ({
  user,
  message
}) => {
  const {content, date, from } = message
  return (
    <li className="clearfix">
      <div className="message-data align-right">
        <span className="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;
        <span className="message-data-name" >{user.name}</span> <i className="fa fa-circle me"></i>

      </div>
      <div className="message other-message float-right">
        {content}
      </div>
    </li>
  )
}
const InMessage = ({
  user,
  message
}) => {
  const {content, date, from } = message
  return (
    <li>
      <div className="message-data">
        <span className="message-data-name"><i className="fa fa-circle online"></i> {user.name}</span>
        <span className="message-data-time">10:12 AM, Today</span>
      </div>
      <div className="message my-message">
        {content}
      </div>
    </li>
  )
}

const Message = ({
  out,
  message,
  user
}) => {
      if(out)
        return <OutMessage {...{ message, user } } />
      return <InMessage {...{ message, user } }  />
}

const MessageWriting = ({

}) => {
  return (
    <li>
      <div className="message-data">
        <span className="message-data-name"><i className="fa fa-circle online"></i> Vincent</span>
        <span className="message-data-time">10:31 AM, Today</span>
      </div>
      <i className="fa fa-circle online"></i>
      <i className="fa fa-circle online"></i>
      <i className="fa fa-circle online"></i>
    </li>
  )
}

let ChatHistory = React.createClass({
  componentDidMount: function() {
    this.scrollToButtom()
  },
  componentWillReceiveProps: function(){
    this.scrollToButtom()
  },
  scrollToButtom: function () {
    let chatHistory = ReactDOM.findDOMNode(this)
    console.log(chatHistory)
    console.log(chatHistory.scrollHeight)
    chatHistory.scrollTop = chatHistory.scrollHeight
  },
  render: function() {
    let { selectedConversation, loggedUser, selectedUser } = this.props
    return (
      <div className="chat-history">

        <ul>
          {selectedConversation.map( (message, index) => {
            const out = message.from === loggedUser.id
            const fromUser = (out) ? loggedUser : selectedUser
            return (<Message key={index} out={out} message={message} user={fromUser}/>) } )
          }
        </ul>
      </div>
    )
  }
})


let MessageInput = React.createClass({
  messageSendDelegate: function(e) {
    e.preventDefault()
    const msg = this.refs.content.value
    this.refs.content.value = ''
    this.refs.content.focus()
    this.props.onSendHandler(msg)
  },
  render: function(){
    return (
      <div className="chat-message clearfix">
        <textarea name="message-to-send" id="message-to-send" placeholder ="Type your message" rows="3" ref="content" onKeyUp={ (e) => { if(e.which === 13) this.messageSendDelegate(e) }}></textarea>

        <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
        <i className="fa fa-file-image-o"></i>

        <button onClick={this.messageSendDelegate}>Send</button>

      </div>
    )
  }
})


export default class Chat extends React.Component {
  messageSend (message) {
      const {selectedUser, loggedUser } = this.props
      const msg = {content: message, date: +new Date(), from: loggedUser.id, to: selectedUser.id, isRead: false }
      this.props.dispatchSendMessage(msg)
  }
  render() {
    const {loggedUser, selectedUser, selectedConversation} = this.props
    return (
      <div className="chat">
        <ChatHeader {...selectedUser} />
        <ChatHistory ref="chatHistory" {...{loggedUser, selectedUser, selectedConversation}}/>
        <MessageInput onSendHandler={c => this.messageSend(c) } />
      </div>
    )
  }
}
