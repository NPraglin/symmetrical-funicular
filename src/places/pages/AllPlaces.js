import React, { useEffect, useState } from "react";
import MiniPlaceList from "../components/MiniPlaceList/MiniPlaceList";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

// TO DO LIST
// Make a mini place-item component and custom CSS to display multiple places

const AllPlaces = props => {
  const [loadedPlaces, setLoadedPlaces] = useState();

  // Extract these functions
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/all`);
        // Update state with the data from the backend
        setLoadedPlaces(responseData.places);
      } catch (err) {
        console.log(err)
      }
      
    };
    fetchPlaces();
  }, [sendRequest]);

  // Function that re-renders the loaded places after one is deleted. Forwarded to PlaceList via props
  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <MiniPlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
    </React.Fragment>
  );
}

export default AllPlaces;