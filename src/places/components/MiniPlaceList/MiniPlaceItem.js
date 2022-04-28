import React , { useState }from "react";
import { Card, Image, Text, Button, Badge, Group, useMantineTheme, Container } from '@mantine/core';
import './MiniPlaceItem.css';
import Modal from "../../../shared/components/UIElements/Modal";
import Map from "../../../shared/components/UIElements/Map";
import { useHttpClient } from "../../../shared/components/hooks/http-hook";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";


const MiniPlaceItem = props => {
  const theme = useMantineTheme();

  const secondaryColor = theme.colorScheme === 'dark'
    ? theme.colors.dark[1]
    : theme.colors.gray[7];
  const { isLoading, error, clearError } = useHttpClient();

  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  // Maps the badges onto each card..
  const badgeHandler = () => {
    if (props.badge === "1") {
      return <Badge color="pink" variant="light">Free Snacks/Drinks</Badge>
    } else if (props.badge === "2") {
      return <Badge color="pink" variant="light">🔥 Food</Badge>
    } else if (props.badge === "3") {
      return <Badge color="blue">Office</Badge>
    } else if (props.badge === "4") {
      return <Badge color="lime">Outdoors</Badge>
    } else {return null}
  }

  return (

    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
        <Modal 
          show={showMap} 
          onCancel={closeMapHandler} 
          header={props.address}
          contentClass='place-item__modal-content' 
          footerClass='place-item__modal-actions' 
          footer={<Button variant="light" color="red" onClick={closeMapHandler} >Close</Button>} 
        >
          <div className='map-container'>
            <Map center={props.coordinates} zoom={16} />
          </div>
        </Modal>
      <div style={{ width: 400, height: 400, maxHeight: 400, margin: 'auto' }}>
        <Card shadow="sm" p="lg">
          {isLoading && <LoadingSpinner asOverlay />}
          <div>
            <Image src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} height={160} />
          </div>
          <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
            <Text weight={500}>{props.title}</Text>
            {badgeHandler()}
            <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>{props.address}</Text>
            <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>{props.description}</Text>
          </Group>
          <Group position="center">
            <Button variant="light" color="red" fullWidth style={{ marginTop: 14 }} onClick={openMapHandler} >Open with Google</Button>
          </Group>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default MiniPlaceItem;