import React, { Component } from 'react'
import PeopleList from './components/PeopleList'
import Chat from './components/Chat'


class Login extends Component {
  render() {
    return (
      <div className="chat-history chat login">
        <div className="chat-message clearfix">
          <input name="message-to-send" placeholder ="Type your name"  ref={ (username) => this.username = username }  />
          <button onClick={() => this.props.login(this.username.value) }>Login</button>

        </div>
      </div>
    )
  }
}

export default class App extends Component {
  dispatchSendMessage(message) {
    this.props.sendMessage(message)
  }
  dispatchLogin(username){
    this.props.login(username)
  }
  render() {
    const {users, loggedUser, selectedConversation, selectedUser, dispatchLogin, usersResult} = this.props
    return (
      <div className="container clearfix">
        {
          (loggedUser) ?
          ( <div>
            <PeopleList selectDispatcher={this.props.selectDispatcher}  searchDispatcher={this.props.searchDispatcher} {...{users, selectedUser, usersResult}}/>
            <Chat {...{loggedUser, selectedConversation, selectedUser}} dispatchSendMessage={(m) => { this.dispatchSendMessage(m) }}  />
          </div> )
          :
          ( <Login login={dispatchLogin} /> )
        }
      </div>
    )
  }
}
