document.addEventListener('DOMContentLoaded', () => {
  // Login form event listener
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await loginUser(email, password);
    });
  }

  // Check authentication and fetch data for index page
  checkAuthentication();
});

// Login user
async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:5000/login', {  // Update URL here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      document.cookie = `token=${data.access_token}; path=/`;
      window.location.href = 'index.html';
    } else {
      alert('Login failed: ' + response.statusText);
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

// Check user authentication and fetch places if authenticated
function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');
  const addReviewSection = document.getElementById('add-review');

  if (!token) {
    if (loginLink) loginLink.style.display = 'block';
    if (addReviewSection) window.location.href = 'index.html';
  } else {
    if (loginLink) loginLink.style.display = 'none';
    if (addReviewSection) addReviewSection.style.display = 'block';
    if (window.location.pathname.endsWith('index.html')) fetchPlaces(token);
  }
}

// Fetch places data
async function fetchPlaces(token) {
  try {
    const response = await fetch('http://localhost:5000/places', {  // Update URL here
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const places = await response.json();
      displayPlaces(places);
    } else {
      alert('Failed to fetch places: ' + response.statusText);
    }
  } catch (error) {
    alert('Failed to fetch places: ' + error.message);
  }
}

// Display places on index.html
function displayPlaces(places) {
  const placesList = document.getElementById('places-list');
  placesList.innerHTML = '';

  places.forEach((place) => {
    const placeCard = document.createElement('div');
    placeCard.className = 'place-card';
    placeCard.innerHTML = `
      <img src="${place.image}" alt="${place.name}" class="place-image">
      <h3>${place.name}</h3>
      <p>Price per night: $${place.price_per_night}</p>
      <p>Location: ${place.city_name}, ${place.country_name}</p>
      <a href="place.html?id=${place.id}" class="details-button">View Details</a>
    `;
    placesList.appendChild(placeCard);
  });
}

// Get a cookie value by its name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Extract place ID from URL
function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Submit review
async function submitReview(token, placeId, reviewText) {
  try {
    const response = await fetch(`http://localhost:5000/places/${placeId}/reviews`, {  // Update URL here
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ review: reviewText }),
    });

    if (response.ok) {
      alert('Review submitted successfully!');
      document.getElementById('review-form').reset();
    } else {
      alert('Failed to submit review: ' + response.statusText);
    }
  } catch (error) {
    alert('Failed to submit review: ' + error.message);
  }
}