import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';
import './PlaceForm.css';
import { useForm } from "../../shared/components/hooks/form-hook";

const DUMMY_PLACES =[
  {
    id: 'p1',
    title: 'The Bean',
    description: 'Tourist attraction in Chicago by User 1',
    imageUrl: 'https://cdn.choosechicago.com/uploads/2019/07/first-time-bean-1.jpg',
    address: '201 E Randolph St, Chicago, IL 60602',
    location: {
      lat: 41.882702,
      lng: -87.619392
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'The Bean',
    description: 'User 2 visited the Bean',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/Cloud_Gate_%28The_Bean%29_from_east%27.jpg/340px-Cloud_Gate_%28The_Bean%29_from_east%27.jpg',
    address: '201 E Randolph St, Chicago, IL 60602',
    location: {
      lat: 41.882702,
      lng: -87.619392
    },
    creator: 'u2'
  }
]

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;

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

  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {

    if (identifiedPlace) {
      setFormData({
        title: {
          value: identifiedPlace.title,
          isValid: true
        },
        description: {
          value: identifiedPlace.description,
          isValid: true
        }
      }, true);
      setIsLoading(false);
    }

  }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  }

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find place</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
    <div className="center">
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input 
        id='title' 
        element='input' 
        type='text' 
        label='Title' 
        validators={[VALIDATOR_REQUIRE()]} errorText='Please enter a valid title' 
        onInput={inputHandler}
        value={formState.inputs.title.value}
        valid={formState.inputs.title.isValid}
      />
      <Input 
        id='description'
        element='textarea'  
        label='Description' 
        validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please enter a valid description, at least 5 characters.' 
        onInput={inputHandler}
        value={formState.inputs.description.value}
        valid={formState.inputs.title.isValid}
      />
      <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>
  );
};

export default UpdatePlace;