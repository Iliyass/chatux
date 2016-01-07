import React from 'react'

const Search = ({
  onKeyUpHandler
}) => {
  return (
    <div className="search">
      <input type="text" placeholder="search" onKeyUp={(e) => {onKeyUpHandler(e.target.value)}} />
      <i className="fa fa-search"></i>
    </div>
  )
}

const Status = ({
  status = "offline",
  timeLeft
}) => {
  return (
    <div className="status">
      <i className={`fa fa-circle ${status}`}></i> {status}
    </div>
  )
}

const User = ({
  user,
  active,
  onClick
}) => {
  const { id, avatar, name, status } = user
  const className = (active) ? 'active' : ''
  console.log(avatar)
  return (
    <li onClick={onClick} className={`clearfix ${className}`}>
      <img src={avatar} alt="avatar" />
      <div className="about">
        <div className="name">{name}</div>
        <Status status={status}/>
      </div>
    </li>
  )
}

const List = ({
  users,
  selectedUser,
  onSelectUser
}) => {
  return (
    <ul className="list">
      {users.map( (user, index) => ( <User active={user.id === selectedUser.id} onClick={() => onSelectUser(user.id)} key={index} {...{user}} /> ) )}
    </ul>
  )
}


export default class PeopleList extends React.Component {
  render() {
    const users = (this.props.usersResult.length) ? this.props.usersResult : this.props.users
    console.log(users)
    const props = Object.assign({}, this.props, { users })
    return (
      <div className="people-list" id="people-list">
        <Search onKeyUpHandler={this.props.searchDispatcher} />
        <List onSelectUser={this.props.selectDispatcher} {...props} />
      </div>
    )
  }
}
