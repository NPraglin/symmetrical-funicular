import React from 'react';
import UserList from '../components/UserList';

const Users = () => {
  const USERS = [{
    id: 'u1',
    name: 'Nathan Praglin',
    image: 'https://avatars.githubusercontent.com/u/2147533?v=4',
    places: 5
  }];

  return <UserList items={USERS} />;
};

export default Users;
