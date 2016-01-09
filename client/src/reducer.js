
const INITIAL_STATE = {}

function updateConversation(stateMessages, selectedConversation, selectedUserId) {
  const messages =  stateMessages.filter( msg => msg.from === selectedUserId || msg.to === selectedUserId).map(msg => {
    msg.isRead = true
    return msg
  })
  if(! messages.length){
    return selectedConversation
  }
  return messages
}

function getUserMessages(msgs, selectedUserId, loggedUserId) {
  return msgs.filter( msg => (msg.from === selectedUserId && msg.to === loggedUserId) || (msg.from === loggedUserId && msg.to === selectedUserId) )
                        .map(msg => { msg.isRead = true; return msg } )

}

function sendMessage(state, newMessage) {
  const sentToUserId = (newMessage.from != state.loggedUser.id) ? newMessage.from : ( (newMessage.to != state.loggedUser.id) ? newMessage.to : '' )
  // const selectedUser = state.selectedUser
  const messages = state.messages.concat([newMessage])
  const selectedConversation = updateConversation(messages, state.selectedConversation, state.selectedUser.id)
  // TODO
  // const selectedConversation = getUserMessages(messages, state.loggedUser.id, state.selectedUser.id)
  const users = state.users.map( u => {
      if(u.id === sentToUserId && sentToUserId != state.selectedUser.id){
        u.hasMessagesUnread = true
      }
      return u
  })
  return Object.assign({}, state, { messages, users , selectedConversation})
}

function selectUser(state, userId) {
  const user = state.users.filter( user => user.id === userId )[0]
  const users = state.users.map( u => {
    if(u.id === userId){
      u.hasMessagesUnread = false
    }
    return u
  })
  const selectedConversation = getUserMessages(state.messages, userId, state.loggedUser.id)
  return Object.assign(
                {},
                state,
                { users },
                { selectedUser: user },
                { selectedConversation })
}

function setState(state) {
  console.log("setState", state)
  return Object.assign({}, state, {usersResult: [], selectedConversation: [] })
}

function setLoggedUser(state, username) {
  return Object.assign({}, state, { loggedUser: state.users.filter(u => u.name === username)[0] }, { users: state.users.filter(u => u.name != username ) } )
}

function friendLogged(state, user) {
  const users = state.users.map(u => {
    if(u.name === user.name){
      u.id = user.id
      u.status = "online"
    }
    return u
  })
  return Object.assign({},
                        state,
                        { users })
}

function friendLoggedOut(state, userId) {
  const users = state.users.map(u => {
    if(u.id === userId){
      u.status = "offline"
    }
    return u
  })
  return Object.assign({},
                  state,
                  { users })
}


function searchUsers(state, value) {
  const usersResult = state.users.filter(u => u.name.toLowerCase().indexOf(value.toLowerCase()) > -1 )
  return Object.assign({},
                      state,
                      {usersResult})
}

function readMessage(state, message) {
  const messages = state.messages.map( m => {
                      if(m.date === message.date){
                        m.isRead = true
                      }
                      return m
                    })
  return Object.assign({},
                state,
                { messages })
}


export default function(state = INITIAL_STATE, action){
  console.log("REDUCER", state, action)
  switch (action.type) {
    case 'READ_MESSAGE':
      return readMessage(state, action.message)
    case 'SET_LOGGED_USER':
      return setLoggedUser(state, action.username)
    case 'SEND_MESSAGE':
      return sendMessage(state, action.message)
    case 'RECEIVE_MESSAGE':
      return sendMessage(state, action.message)
    case 'SELECT_USER':
      return selectUser(state, action.userId)
    case 'FRIEND_LOGGED':
      return friendLogged(state, action.user)
    case 'FRIEND_LOGGED_OUT':
      return friendLoggedOut(state, action.userId)
    case 'SEARCH_USER':
      return searchUsers(state, action.value)
    case 'UPDATE_CONVERSATION':
      return updateConversation(state, action.message)
    case 'SET_STATE':
      return setState(action.state)
    default:
      return state
  }
}
