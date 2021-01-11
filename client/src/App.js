import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { listLogEntries } from "./Api";
import LogEntryForm from "./LogEntryForm";

function App() {
  const [viewport, setViewport] = useState({
    width: "100vm",
    height: "100vh",
    latitude: 28.6448,
    longitude: 77.216721,
    zoom: 4,
  });
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addLogEntry, setAddLogEntry] = useState(null);
  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);
  function showAddMarkerPopup(e) {
    const [longitude, latitude] = e.lngLat;
    setAddLogEntry({
      latitude,
      longitude,
    });
    //console.log(addLogEntry);
  }
  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      doubleClickZoom={false}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker longitude={entry.longitude} latitude={entry.latitude}>
            <div
              onClick={() => {
                setShowPopup({ [entry._id]: true });
                console.log(showPopup);
              }}
            >
              <svg
                className="marker yellow"
                style={{
                  height: `${6 * viewport.zoom}px `,
                  width: `${6 * viewport.zoom}px`,
                }}
                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
              >
                <g>
                  <g>
                    <path
                      d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                        c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                        c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </Marker>

          {showPopup[entry._id] ? (
            <Popup
              longitude={entry.longitude}
              latitude={entry.latitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setShowPopup({})}
            >
              <div className="popup">
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
                <small>
                  Visited on : {new Date(entry.visitDate).toLocaleDateString()}
                </small>
                {entry.image && <img src={entry.image} alt={entry.title} />}
              </div>
            </Popup>
          ) : null}
        </React.Fragment>
      ))}

      {addLogEntry ? (
        <>
          <Marker
            longitude={addLogEntry.longitude}
            latitude={addLogEntry.latitude}
          >
            <svg
              className="marker red"
              style={{
                height: `${6 * viewport.zoom}px `,
                width: `${6 * viewport.zoom}px`,
              }}
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
            >
              <g>
                <g>
                  <path
                    d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                        c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                        c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"
                  />
                </g>
              </g>
            </svg>
          </Marker>
          <Popup
            longitude={addLogEntry.longitude}
            latitude={addLogEntry.latitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setAddLogEntry(null)}
          >
            <div className="popup">
              <LogEntryForm
                location={addLogEntry}
                onClose={() => {
                  setAddLogEntry(null);
                  getEntries();
                }}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </ReactMapGL>
  );
}

export default App;
