import React, { useEffect, useRef } from "react";
import MiniPlaceItem from "./MiniPlaceItem";
import Card from "../../../shared/components/UIElements/Card";
import Button from "../../../shared/components/FormElements/Button";
import { Input, Container, SimpleGrid, Chips, Chip } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { useHttpClient } from "../../../shared/components/hooks/http-hook";

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

    return (
    <React.Fragment>
      <Container size="xs" px="xs">
        <Input
        size="sm"
        icon={<IconSearch />}
        placeholder="Search by your address"
        />
        <br />
        <Chips variant="filled" multiple>
          <Chip value="free">Free Snacks/Drinks</Chip>
          <Chip value="food">🔥 Food</Chip>
          <Chip value="office">Office</Chip>
          <Chip value="outdoors">Outdoors</Chip>
        </Chips>
      </Container>
      <br />
      <SimpleGrid cols={3} spacing="xs">
        {props.items.map(place => (
          <MiniPlaceItem 
            key={place.id} 
            badge={place.badge} //1
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
      </SimpleGrid>
    </React.Fragment>
    );
}

export default MiniPlaceList;