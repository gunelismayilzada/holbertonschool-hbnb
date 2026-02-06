document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const reviewForm = document.getElementById('review-form');

    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
      return null;
    }
  
    function getPlaceIdFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get('placeId');
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
  
        try {
          const res = await fetch('https://your-api-url/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
          });
  
          if (res.ok) {
            const data = await res.json();
            document.cookie = `token=${data.access_token}; path=/`;
            window.location.href = 'index.html';
          } else {
            alert('Login failed: ' + res.statusText);
          }
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
    }

    const loginLink = document.getElementById('login-link');
    const placesList = document.getElementById('places-list');
    const priceFilter = document.getElementById('price-filter');
    const token = getCookie('token');
  
    if (loginLink) {
      if (token) loginLink.style.display = 'none';
      else loginLink.style.display = 'block';
    }
  
    async function fetchPlaces() {
      if (!placesList) return;
      try {
        const res = await fetch('https://your-api-url/places', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await res.json();
        displayPlaces(data);
      } catch (err) {
        console.error(err);
      }
    }
  
    function displayPlaces(places) {
      if (!placesList) return;
      placesList.innerHTML = '';
      places.forEach(place => {
        const div = document.createElement('div');
        div.className = 'place-card';
        div.dataset.price = place.price;
        div.innerHTML = `
          <h2>${place.name}</h2>
          <p>Price per night: $${place.price}</p>
          <a href="place.html?placeId=${place.id}" class="details-button">View Details</a>
        `;
        placesList.appendChild(div);
      });
    }
  
    if (priceFilter) {
      priceFilter.addEventListener('change', () => {
        const max = priceFilter.value;
        const cards = document.querySelectorAll('.place-card');
        cards.forEach(card => {
          const price = parseFloat(card.dataset.price);
          card.style.display = (max === 'All' || price <= max) ? 'block' : 'none';
        });
      });
    }
  
    fetchPlaces();

    const placeDetails = document.getElementById('place-details');
    const addReviewSection = document.getElementById('add-review');
    const placeId = getPlaceIdFromURL();
  
    async function fetchPlaceDetails() {
      if (!placeDetails || !placeId) return;
      try {
        const res = await fetch(`https://your-api-url/places/${placeId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const place = await res.json();
        displayPlaceDetails(place);
      } catch (err) {
        console.error(err);
      }
    }
  
    function displayPlaceDetails(place) {
      if (!placeDetails) return;
      placeDetails.innerHTML = `
        <h1>${place.name}</h1>
        <p>Host: ${place.host}</p>
        <p>Price: $${place.price}/night</p>
        <p>Description: ${place.description}</p>
        <p>Amenities: ${place.amenities.join(', ')}</p>
        <h3>Reviews:</h3>
        <div>${place.reviews.map(r => `
          <div class="review-card">
            <p>User: ${r.user}</p>
            <p>Rating: ${'⭐'.repeat(r.rating)}</p>
            <p>Comment: ${r.comment}</p>
          </div>
        `).join('')}</div>
      `;
      if (addReviewSection) {
        addReviewSection.style.display = token ? 'block' : 'none';
      }
    }
  
    fetchPlaceDetails();

    if (reviewForm) {
      if (!token) window.location.href = 'index.html';
      reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const comment = reviewForm.comment.value;
        const rating = reviewForm.rating.value;
  
        try {
          const res = await fetch(`https://your-api-url/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ comment, rating })
          });
  
          if (res.ok) {
            alert('Review submitted successfully!');
            reviewForm.reset();
          } else {
            alert('Failed to submit review.');
          }
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
    }
  });
  