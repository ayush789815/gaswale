// components/GoogleMapView.js
import React from "react";
import GoogleMapReact from "google-map-react";

const GoogleMapView = ({
  apiKey,
  center = { lat: 28.6139, lng: 77.209 }, // Default: New Delhi
  zoom = 14,
}) => {
  const createMapOptions = (maps) => ({
    mapTypeId: maps.MapTypeId.HYBRID, // HYBRID = Satellite + Labels
    zoomControl: true,
    fullscreenControl: true,
    streetViewControl: false,
    mapTypeControl: false,
  });

  return (
    <div className="h-[500px] w-full rounded-md overflow-hidden border border-gray-300">
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={center}
        defaultZoom={zoom}
        options={createMapOptions}
      />
    </div>
  );
};

export default GoogleMapView;
