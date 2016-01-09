import Server from 'socket.io'
import { createStore } from 'redux'
import reducer from './src/reducer'

const io = new Server().attach(8090)

const store = createStore(reducer)


io.on('connection', (socket) => {
  console.log("User connect :", socket.id);

  socket.on('login', (username) => {
    console.log("Logged", {id: socket.id, username } );
    store.dispatch({type: 'LOGGED_USER', user: {id: socket.id, username } })
    const user = store.getState().users.filter(u => u.name === username)[0]

    if(user){
      console.log("emit state");
      socket.emit('state', { state: store.getState(), username })
      socket.broadcast.emit('friend_logged', user)
    }
  })

  socket.on('sending_message', (message) => {
    console.log("sending_message", message);
    store.dispatch({type: 'ADD_MESSAGE', message})
    socket.to(message.to).emit('receiving_message', message)
  })

  socket.on('logout', () => {
    store.dispatch({type: 'LOGGEDOUT_USER', userId: socket.id })
    socket.broadcast.emit('friend_logged_out', socket.id )
  })

})
