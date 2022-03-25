import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from 'react-router-dom';
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';
import './PlaceForm.css';
import { useForm } from "../../shared/components/hooks/form-hook";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import AuthContext from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";



const UpdatePlace = () => {
  // Auth context to get login info
  const auth = useContext(AuthContext);
  // Http Requests loaded in
  const {isLoading, error, sendRequest, clearError} = useHttpClient();  
  // States for when the place is loaded
  const [loadedPlace, setloadedPlace] = useState();
  // Place ID
  const placeId = useParams().placeId;
  // Initializing history hook
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    }
  }, false);

  // hook to get the place per ID
  useEffect(() => {
    const fetchPlace = async () => {
      try { // Don't need error handling, our custom hook's function (sendRequest) handles that
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
        setloadedPlace(responseData.place);
        setFormData({
          title: {
            value: responseData.place.title,
            isValid: true
          },
          description: {
            value: responseData.place.description,
            isValid: true
          }
        }, true);
      } catch (err) {
        console.log(err)
      }
    };
    fetchPlace()
  },[sendRequest, placeId, setFormData]);

  // Front end function updating place
  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH', JSON.stringify({
      title: formState.inputs.title.value,
      description: formState.inputs.description.value
    }), {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + auth.token
    }
    );
    // Save that redirect
    history.push('/' + auth.userId + '/places');
  } catch (err) {
    console.log(err)
  }
  };

  if (isLoading) {
    return (
    <div className="center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <h2>Could not find place</h2>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
    {!isLoading && loadedPlace && (<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input 
        id='title' 
        element='input' 
        type='text' 
        label='Title' 
        validators={[VALIDATOR_REQUIRE()]} errorText='Please enter a valid title' 
        onInput={inputHandler}
        value={loadedPlace.title}
        valid={true}
      />
      <Input 
        id='description'
        element='textarea'  
        label='Description' 
        validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please enter a valid description, at least 5 characters.' 
        onInput={inputHandler}
        value={loadedPlace.description}
        valid={true}
      />
      <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>)}
    </React.Fragment>
  );
};

export default UpdatePlace;