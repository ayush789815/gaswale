// components/LocationPicker.js
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Sub-component to handle map click
const LocationMarker = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

// Component to center map on a new position
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position]);
  return null;
};

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([20.5937, 78.9629]); // Default to India

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const latlng = [latitude, longitude];
          setPosition(latlng);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          onLocationSelect({
            lat: latitude,
            lng: longitude,
            address: data?.display_name,
            data: data,
          });
        },
        (err) => {
          console.error("Location permission denied:", err.message);
        }
      );
    }
  }, []);

  const handleSelect = async (latlng) => {
    setPosition([latlng.lat, latlng.lng]);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
    );
    const data = await response.json();

    onLocationSelect({
      lat: latlng.lat,
      lng: latlng.lng,
      address: data?.display_name,
      data: data,
    });
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%" }}
    >
      {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
      {/* <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/">Esri</a> Satellite Imagery'
      /> */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/">Esri</a> Satellite Imagery'
      />
      <TileLayer
        url="https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        attribution="Labels © Esri"
      />
      <Marker position={position} />
      <RecenterMap position={position} />
      <LocationMarker onSelect={handleSelect} />
    </MapContainer>
  );
};

export default LocationPicker;

// // components/LocationPicker.js
// import React, { useEffect, useState } from "react";
// // import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

// const LocationMarker = ({ onSelect }) => {
//   useMapEvents({
//     click(e) {
//       onSelect(e.latlng);
//     },
//   });

//   return null;
// };

// const LocationPicker = ({ onLocationSelect }) => {
//   const [position, setPosition] = useState([20.5937, 78.9629]); // Default to India

//   const handleSelect = async (latlng) => {
//     setPosition([latlng.lat, latlng.lng]);

//     // Optional: use fetch API for reverse geocoding (you can use Google Maps API or OpenStreetMap)
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
//     );
//     const data = await response.json();
//     onLocationSelect({
//       lat: latlng.lat,
//       lng: latlng.lng,
//       address: data?.display_name,
//     });
//   };

//   return (
//     <MapContainer
//       center={position}
//       zoom={13}
//       style={{ height: "300px", width: "100%" }}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <Marker position={position} />
//       <LocationMarker onSelect={handleSelect} />
//     </MapContainer>
//   );
// };

// export default LocationPicker;
