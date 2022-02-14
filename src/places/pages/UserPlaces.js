import React from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from 'react-router-dom';

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

const UserPlaces = () => {

  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return (
    <PlaceList items={loadedPlaces} />
  );
};

export default UserPlaces;