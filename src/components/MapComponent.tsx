// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const MapComponent = ({ locations }) => {
//   const defaultPosition = [20, 0]; // Default position if no data
//   const zoomLevel = 2;

//   return (
//     <div className="w-full h-96 rounded-lg shadow-md overflow-hidden">
//       <MapContainer center={defaultPosition} zoom={zoomLevel} className="w-full h-full">
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         /> 
//         {locations?.map((loc, index) => (
//           <Marker key={index} position={[loc.latitude, loc.longitude]}>
//             <Popup>
//               <strong>{loc.name}</strong>
//               <br />
//               {loc.count} Users
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// export default MapComponent;
