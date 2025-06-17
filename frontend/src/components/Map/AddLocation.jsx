import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_MAP_BOX_ACCESS_TOKEN = import.meta.env.VITE_MAP_BOX_ACCESS_TOKEN;

const AddLocation = ({ onLocationChange }) => {
  const [location, setLocation] = useState({ lng: 0, lat: 0 });
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 8,
  });
  const mapRef = useRef();

  useEffect(() => {
    if (!location.lng && !location.lat) {
      fetch(`${VITE_API_BASE_URL}/ipapi`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch location data");
          return response.json();
        })
        .then((data) => {
          const { longitude, latitude } = data;
          const newLocation = { lng: longitude, lat: latitude };
          setLocation(newLocation);
          setViewState({
            longitude,
            latitude,
            zoom: 8,
          });
          onLocationChange(newLocation);
        })
        .catch((error) => console.error(error));
    }
  }, [location.lng, location.lat, onLocationChange]);

  useEffect(() => {
    if (mapRef.current) {
      const mapboxInstance = mapRef.current.getMap();
      const geocoder = new MapBoxGeocoder({
        accessToken: VITE_MAP_BOX_ACCESS_TOKEN,
        marker: false,
        mapboxgl,
      });

      mapboxInstance.addControl(geocoder, "top-left");

      geocoder.on("result", (e) => {
        const coords = e.result.geometry.coordinates;
        const newLocation = { lng: coords[0], lat: coords[1] };
        setLocation(newLocation);
        setViewState({
          longitude: coords[0],
          latitude: coords[1],
          zoom: 12,
        });
        onLocationChange(newLocation);
      });

      return () => {
        mapboxInstance.removeControl(geocoder);
      };
    }
  }, [onLocationChange]);

  const handleDragEnd = (e) => {
    const newLocation = { lng: e.lngLat.lng, lat: e.lngLat.lat };
    setLocation(newLocation);
    onLocationChange(newLocation);
  };

  const handleGeolocate = (position) => {
    const { longitude, latitude } = position.coords;
    const newLocation = { lng: longitude, lat: latitude };

    setLocation(newLocation);
    setViewState({
      longitude,
      latitude,
      zoom: 12,
    });

    onLocationChange(newLocation);
  };

  return (
    <Box
      sx={{
        height: 610,
        width: 830,
        position: "relative",
      }}
    >
      <ReactMapGL
        ref={mapRef}
        mapboxAccessToken={VITE_MAP_BOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker
          latitude={location.lat}
          longitude={location.lng}
          draggable
          onDragEnd={handleDragEnd}
        />
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          onGeolocate={handleGeolocate}
        />
      </ReactMapGL>
    </Box>
  );
};

export default AddLocation;
