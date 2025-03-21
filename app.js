// Initialize the map
const map = L.map('map').setView([0, 0], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Connect to the Socket.IO server
const socket = io();

// Function to get the user's location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Function to display the user's location on the map
function showPosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  // Send location data to the server
  socket.emit('location', { latitude: lat, longitude: lng });

  // Update the map view
  map.setView([lat, lng], 15);

  // Add a marker at the user's location
  L.marker([lat, lng]).addTo(map);
}

// Function to handle errors
function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

// Listen for real-time location updates from the server
socket.on('updateLocation', (data) => {
  const { latitude, longitude } = data;

  // Update the map view
  map.setView([latitude, longitude], 15);

  // Add a marker at the updated location
  L.marker([latitude, longitude]).addTo(map);
});