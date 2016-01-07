import React from 'react'

const Search = () => {
  return (
    <div className="search">
      <input type="text" placeholder="search" />
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
    return (
      <div className="people-list" id="people-list">
        <Search />
        <List onSelectUser={this.props.selectDispatcher} {...this.props}/>
      </div>
    )
  }
}
