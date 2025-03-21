import { supabase } from './supabase.js';

// Initialize the map
const map = L.map('map').setView([0, 0], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Connect to the Socket.IO server
const socket = io();

// Sign Up
async function signUp() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const name = document.getElementById('signup-name').value; // Optional field

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
  } else {
    // Save user data in the profiles table
    const { data, error: dbError } = await supabase
      .from('profiles')
      .insert([{ user_id: user.id, email: user.email, name }]);

    if (dbError) {
      alert(dbError.message);
    } else {
      alert('User signed up and data saved successfully!');
    }
  }
}

// Login
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { user, error } = await supabase.auth.signIn({ email, password });

  if (error) {
    alert(error.message);
  } else {
    alert('User logged in successfully!');
    fetchProfile(user.id);
  }
}

// Logout
async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert(error.message);
  } else {
    alert('User logged out successfully!');
  }
}

// Fetch User Profile
async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    alert(error.message);
  } else {
    console.log('User profile:', data);
  }
}

// Track Location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

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

// Check if the user is logged in
async function checkAuth() {
  const { user, error } = await supabase.auth.getUser();

  if (user) {
    console.log('User is logged in:', user.email);
    fetchProfile(user.id);
  } else {
    console.log('User is logged out');
  }
}

// Check authentication status on page load
checkAuth();
