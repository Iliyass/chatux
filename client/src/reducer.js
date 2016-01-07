
const INITIAL_STATE = {}

function updateConversation(messages, userId) {
  return messages.filter( msg => {
          return msg.from === userId || msg.to === userId
      } )}

function sendMessage(state, newMessage) {
  const selectedUser = (newMessage.from != state.loggedUser.id) ? newMessage.from : ( (newMessage.to != state.loggedUser.id) ? newMessage.to : '' )
  const messages = state.messages.concat([newMessage])
  const selectedConversation = updateConversation(messages, selectedUser)
  const dd = Object.assign({}, state, { messages, selectedConversation })
  console.log(dd)
  return dd
}

function selectUser(state, userId) {
  const user = state.users.filter( user => user.id === userId )[0]
  const selectedConversation = updateConversation(state.messages, user.id)
  return Object.assign(
                {},
                state,
                { selectedUser: user },
                { selectedConversation })
}

function setState(state) {
  console.log("setState", state)
  return Object.assign({}, state, {usersResult: [] })
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
  // const query = `/${value}.*/`
  const usersResult = state.users.filter(u => u.name.toLowerCase().indexOf(value.toLowerCase()) > -1 )
  console.log(usersResult);
  return Object.assign({},
                      state,
                      {usersResult})
}
export default function(state = INITIAL_STATE, action){
  console.log("REDUCER", state, action)
  switch (action.type) {
    case 'SET_LOGGED_USER':
      return setLoggedUser(state, action.username)
    case 'SEND_MESSAGE':
      return sendMessage(state, action.message)
    case 'SELECT_USER':
      return selectUser(state, action.userId)
    case 'FRIEND_LOGGED':
      return friendLogged(state, action.user)
    case 'FRIEND_LOGGED_OUT':
      return friendLoggedOut(state, action.userId)
    case 'SEARCH_USER':
      return searchUsers(state, action.value)
    case 'SET_STATE':
      return setState(action.state)
    default:
      return state
  }
}
