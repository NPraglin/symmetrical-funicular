import React from "react";
import MiniPlaceItem from "./MiniPlaceItem";
import Card from "../../../shared/components/UIElements/Card";
import Button from "../../../shared/components/FormElements/Button";
import { Input, Container } from '@mantine/core';
import { IconSearch } from '@tabler/icons';

const MiniPlaceList = props => {
  
    if (props.items.length === 0) {
      return (
      <div className='place-list-center'>
        <Card>
          <h2>No places found. Maybe create one.</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
      );
    }

    return <ul className='place-list'>
      <Container size="xs" px="xs">
        <Input
        size="sm"
        icon={<IconSearch />}
        placeholder="Search by your address"
        />
      </Container>
    <br />
      {props.items.map(place => (
        <MiniPlaceItem 
          key={place.id} 
          id={place.id} 
          image={place.image} 
          title={place.title} 
          description={place.description} 
          address={place.address} 
          creatorId={place.creator} 
          coordinates={place.location} 
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>;
}

export default MiniPlaceList;