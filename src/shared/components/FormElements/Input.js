import React, { useReducer } from "react";
import MainHeader from "../Navigation/MainHeader";
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: true
      };
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, disptch] = useReducer(inputReducer, {value: '', isValid: false});

  const changeHandler = event => {
    dispatchEvent({})
  };
  
  const element = 
    props.element === 'input' ? (
      <input id={props.id} type={props.type} placeholder={props.placeholder} />
    ) : (
      <textrea id={props.id} rows={props.rows || 3} />
    );

  return (
    <div className={`form-control`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
    </div>
  );
};

export default Input;