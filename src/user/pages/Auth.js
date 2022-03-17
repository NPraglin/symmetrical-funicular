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
        name: undefined
      }, 
      formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }
      }, false);
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  // Handles our signing up and logging in
  const authSubmitHandler = async event => {
    event.preventDefault();
    // Logging in?
    if (isLoginMode) {
        // Loading state true so we can render some loading status for users on the front end
        // Point to backend signup sending POST req and body
        try {
          await sendRequest(
            'http://localhost:5000/api/users/login', 
            'POST', 
            JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value
            }), 
            {'Content-Type': 'application/json'}
          );
        auth.login();
        } catch (err) {
          // No need to handle error becuase custom hook handles that for us, this can be empty or just console.log
          console.log(err)
        }
  
    // Signing up?
    } else {
    try {
      // Loading state true so we can render some loading status for users on the front end
      // Point to backend signup sending POST req and body
      await sendRequest(
        'http://localhost:5000/api/users/signup', 
        'POST', 
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }), 
        {'Content-Type': 'application/json'});
    
      auth.login();
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
            validators={[VALIDATOR_MINLENGTH(5)]}
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