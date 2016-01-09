require('./css/reset.css')
require('./css/font-awesome.min.css')
require('./css/style.css')
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reducer from './reducer'
import {createStore, applyMiddleware } from 'redux'
import io from 'socket.io-client';

const socket = io('http://localhost:8090')

const socketIOMiddleware = store => next => action => {
  console.log('dispatching ', action)
  const result = next(action)
  if(action.type === 'SEND_MESSAGE'){
    console.log("senging message ");
    socket.emit('sending_message', action.message)
  }
  console.log('next state', store.getState());
  return result
}

let createStoreWithMiddleware = applyMiddleware(socketIOMiddleware)(createStore)

const store = createStoreWithMiddleware(reducer)

socket.on('friend_logged', (user) => {
  console.log("friend_logged", user);
    store.dispatch({type: 'FRIEND_LOGGED', user})
})

socket.on('friend_logged_out', (userId) => {
    console.log("friend_logged_out, state", store.getState().length);
    store.dispatch({type: 'FRIEND_LOGGED_OUT', userId})
})

socket.on('receiving_message', (message) => {
  console.log("receiving_message", message.from, store.getState().selectedUser.id)
  if(message.from != store.getState().selectedUser.id){
    new Audio('notif.mp3').play()
  }
  store.dispatch({type: 'RECEIVE_MESSAGE', message})
})

socket.on('state', ({state, username}) => {
  console.log("On state", state, username);
  store.dispatch({type: 'SET_STATE', state })
  store.dispatch({type: 'SET_LOGGED_USER', username: username})
  store.dispatch({type: 'SELECT_USER', userId: state.users.filter(u => u.name != username )[0].id })
  store.subscribe(render)
  render()
})

const username = localStorage.getItem("username")

if(username){
  emitLoggedIn(username)
}

function emitLoggedIn(username) {
  console.log("Emit Logged In", username);
  socket.emit('login', username)
  localStorage.setItem("username", username)
}

window.onbeforeunload = () => {
  socket.emit('logout')
}

render()

function render(){
  ReactDOM.render(
    <App {...store.getState()} sendMessage={ (message) => { store.dispatch({ type: 'SEND_MESSAGE', message })}  }
                               selectDispatcher={(userId) => { store.dispatch({type: 'SELECT_USER', userId})}}
                              dispatchLogin={emitLoggedIn}
                              searchDispatcher={ (value) => { store.dispatch({type: 'SEARCH_USER', value }) }}
                              />,
    document.getElementById('root')
  )
}
