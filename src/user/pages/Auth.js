import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import './Auth.css';
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/util/validators"
import { useForm } from "../../shared/components/hooks/form-hook";
import AuthContext from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/imageUpload";

// auth
const Auth = () => {
  const auth = useContext(AuthContext);

  // Some states to manage
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Input values for form state
  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }, false);

  // Switches from login to sign up
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
      {
        ...formState.inputs,
        name: undefined,
        image: undefined
      }, 
      formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        },
        image: {
          value: null,
          isValid: false
        }
      }, false);
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  // Handles our signing up and logging in
  const authSubmitHandler = async event => {
    event.preventDefault();
    // debug log to see if picked file is part of inputs
    console.log(formState.inputs)
    // Logging in?
    if (isLoginMode) {
        // Loading state true so we can render some loading status for users on the front end
        // Point to backend signup sending POST req and body
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + '/users/login', 
            'POST', 
            JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value
            }), 
            {'Content-Type': 'application/json'}
          );
        auth.login(responseData.userId, responseData.token);
        } catch (err) {
          // No need to handle error becuase custom hook handles that for us, this can be empty or just console.log
          console.log(err)
        }
  
    // Signing up?
    } else {
    try {
      // using formData we can refractor the auth rather than manually sending a POST body
      const formData = new FormData();
      formData.append('email', formState.inputs.email.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('password', formState.inputs.password.value);
      formData.append('image', formState.inputs.image.value);
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/users/signup', 
        'POST', 
        formData);
    
      auth.login(responseData.userId, responseData.token);
    } catch (err) {
      console.log(err);
      }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay={true}/>}
        <h2>Login Required</h2>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input 
              element='input' 
              id='name' 
              type='text' 
              label='Your Name' 
              validators={[VALIDATOR_REQUIRE()]} 
              errorText="Please enter a name" 
              onInput={inputHandler}
            />)}
            {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image." />}
          <Input 
            element='input' 
            id='email' 
            type='email' 
            label='E-Mail' 
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            onInput={inputHandler}  
          />
          <Input 
            element='input' 
            id='password' 
            type='password' 
            label='Password' 
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter a valid password of at least 5 characters'
            onInput={inputHandler}  
          />
          <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'Login' : 'SIGNUP'}</Button>
        </form>
        <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
      </Card>
    </React.Fragment>
  )
}

export default Auth;