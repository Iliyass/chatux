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
  if(action.type === 'SEND_MESSAGE'){
    socket.emit('sending_message', action.message)
  }
  const result = next(action)
  console.log('next state', store.getState());
  return result
}

let createStoreWithMiddleware = applyMiddleware(socketIOMiddleware)(createStore)

const store = createStoreWithMiddleware(reducer)

socket.on('friend_logged', (user) => {
  store.dispatch({type: 'FRIEND_LOGGED', user})
})

socket.on('friend_logged_out', (userId) => {
  store.dispatch({type: 'FRIEND_LOGGED_OUT', userId})
})

socket.on('receiving_message', (message) => {
  store.dispatch({type: 'SEND_MESSAGE', message})
})

socket.on('state', ({state, username}) => {
  console.log("On state", state, username);
  store.dispatch({type: 'SET_STATE', state })
  store.dispatch({type: 'SET_LOGGED_USER', username: username})
  store.dispatch({type: 'SELECT_USER', userId: state.users.filter(u => u.name != username )[0].id })
  store.subscribe(render)
  render()
})

function emitLoggedIn(username) {
  console.log("Emit Logged In", username);
  socket.emit('login', username)
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
