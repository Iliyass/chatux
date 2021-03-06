const INITIAL_STATE = {
  users:[{
      id: 1,
      name: 'Iliyass',
      avatar: "chat_avatar_01.jpg",
  },{
    id: 2,
    name: 'Hamza',
    avatar: "chat_avatar_02.jpg",
    status: 'offline'
  },{
    id: 3,
    name: 'Abdp',
    avatar: "chat_avatar_03.jpg",
    status: 'offline'
  },{
    id: 4,
    name: 'Simo',
    avatar: "chat_avatar_04.jpg",
    status: 'offline'
  }],
  messages:[]
}
function loggedUser(state, user) {
  const users = state.users.map(u => {
    if(u.name === user.username){
      u.id = user.id
      u.status = "online"
    }
    return u
  })

    return Object.assign({},
              state,
              { users } )
}

function addMessage(state, message){
  return Object.assign({}, state, { messages: state.messages.concat([message]) })
}

function changeStatus(state, userId) {
  return Object.assign({}, state,
            { users: state.users.map( u => {
              if(u.id === userId){
                u.status = "offline"
              }
              return u
            })})
}


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'LOGGED_USER':
      return loggedUser(state, action.user)
    case 'ADD_MESSAGE':
      return addMessage(state, action.message)
    case "LOGGEDOUT_USER":
      return changeStatus(state, action.userId)
    default:
      return state
  }
}
