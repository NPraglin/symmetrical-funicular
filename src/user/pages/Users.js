import React, { useEffect, useState } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UserList from '../components/UserList';
import { useHttpClient } from '../../shared/components/hooks/http-hook';

const Users = () => {
  // Returns an object we can destructure
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const [loadedUsers, setLoadedUsers] = useState();

  // GET Req to get users whenever this page loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // By default sends a get request without a body nor headers
        const responseData = await sendRequest('http://localhost:5000/api/users');

        setLoadedUsers(responseData.users);
      } catch (err) {
        // Don't need to do anything, HttpReq hook manages error handling
        console.log(err)
      }
    };
    fetchUsers();
    // Needs to be a dependancy to handle a lot of our logic
  }, [sendRequest]);  

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
