import React , { useState, useContext }from "react";
import { Group, Badge, Text } from '@mantine/core';
import './PlaceItem.css';
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import AuthContext from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  }

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  }

  const confirmDeleteHandler = async () => {
    
    setShowConfirmModal(false);
    try {
    // Use sendRequest to send delete req
    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`, 'DELETE', null, {Authorization: 'Bearer ' + auth.token});
    // Calls onDelete property from the props forwarded from PlaceList
    props.onDelete(props.id);
    } catch (err) {
      console.log(err)
    };
  }
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
          footer={<Button onClick={closeMapHandler} >Close</Button>} 
        >
          <div className='map-container'>
            <Map center={props.coordinates} zoom={16} />
          </div>
        </Modal>
        <Modal 
        header="Are you sure?" 
        show={showConfirmModal} 
        onCancel={cancelDeleteHandler} 
        footerClass="place-item__modal-actions" 
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>Cancel</Button>
            <Button danger onClick={confirmDeleteHandler}>Delete</Button>
          </React.Fragment>
        }>
          <p>Do you want to proceed, and delete this place? Please note that it can't be undone.</p>
        </Modal>
      <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
          </div>
          <div className='place-item__info'>
            <Group position="apart">
              <h2>{props.title}</h2>
              {badgeHandler()}
            </Group>
            <Text align="left">{props.address}</Text>
            <br />
            <Text size="lg">{props.description}</Text>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler} >Open with Google</Button>
            {auth.userId === props.creatorId && (
            <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.userId === props.creatorId && (
            <Button danger onClick={showDeleteWarningHandler}>Delete</Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
}

export default PlaceItem;