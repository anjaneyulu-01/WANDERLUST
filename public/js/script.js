// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

// Star rating functionality with half-star support
document.addEventListener('DOMContentLoaded', function() {
  const starContainer = document.getElementById('ratingInput');
  if (!starContainer) return;
  
  const stars = starContainer.querySelectorAll('.star-form');
  const radios = starContainer.querySelectorAll('input[type="radio"]');
  
  function updateStars(rating) {
    stars.forEach((star, index) => {
      const starValue = index + 1;
      
      if (rating >= starValue) {
        // Full star
        star.classList.add('active');
        star.innerHTML = '<i class="fa-solid fa-star"></i>';
      } else if (rating > starValue - 1) {
        // Half star
        star.classList.add('active');
        star.innerHTML = '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        // Empty star
        star.classList.remove('active');
        star.innerHTML = '<i class="fa-regular fa-star"></i>';
      }
    });
  }
  
  stars.forEach((star, index) => {
    star.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const isLeftHalf = clickX < rect.width / 2;
      
      const starValue = index + 1;
      const rating = isLeftHalf ? starValue - 0.5 : starValue;
      
      // Set the radio button value
      const radio = starContainer.querySelector(`input[value="${rating}"]`);
      if (radio) {
        radio.checked = true;
      }
      
      updateStars(rating);
    });
    
    star.addEventListener('mouseenter', function() {
      const index = Array.from(stars).indexOf(this);
      updateStars(index + 1);
    });
  });
  
  starContainer.addEventListener('mouseleave', function() {
    const checked = starContainer.querySelector('input:checked');
    if (checked) {
      updateStars(parseFloat(checked.value));
    } else {
      updateStars(0);
    }
  });
  
  // Initialize with any pre-selected value
  const checked = starContainer.querySelector('input:checked');
  if (checked) {
    updateStars(parseFloat(checked.value));
  }
});

// Map Picker functionality for new listing form
let pickMapInstance = null;
let selectedMarker = null;
let selectedLat = null;
let selectedLng = null;

function toggleMapPicker() {
  const mapPicker = document.getElementById('mapPicker');
  
  if (mapPicker.style.display === 'none') {
    mapPicker.style.display = 'block';
    
    // Initialize map if not already done
    if (!pickMapInstance) {
      setTimeout(() => {
        initPickMap();
      }, 100);
    }
  } else {
    mapPicker.style.display = 'none';
  }
}

function initPickMap() {
  if (typeof L === 'undefined') {
    alert('Map library not loaded. Please refresh the page.');
    return;
  }

  // Default to India center
  pickMapInstance = L.map('pickMap').setView([23.1815, 79.9864], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(pickMapInstance);

  // Click event to select location
  pickMapInstance.on('click', function(e) {
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;

    // Remove previous marker if exists
    if (selectedMarker) {
      pickMapInstance.removeLayer(selectedMarker);
    }

    // Add new marker
    selectedMarker = L.marker([selectedLat, selectedLng]).addTo(pickMapInstance);

    // Reverse geocode to get address
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${selectedLat}&lon=${selectedLng}&format=json`)
      .then(response => response.json())
      .then(data => {
        const address = data.display_name || 'Selected Location';
        selectedMarker.bindPopup('<b>Selected Location</b><br>' + address).openPopup();
      })
      .catch(error => {
        console.error('Reverse geocoding error:', error);
        selectedMarker.bindPopup('<b>Selected Location</b><br>Lat: ' + selectedLat.toFixed(4) + ', Lng: ' + selectedLng.toFixed(4)).openPopup();
      });
  });
}

function confirmLocation() {
  if (selectedLat && selectedLng) {
    // Update hidden fields with coordinates
    document.getElementById('latitude').value = selectedLat;
    document.getElementById('longitude').value = selectedLng;

    // Fetch detailed address from coordinates (reverse geocoding)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${selectedLat}&lon=${selectedLng}&format=json&zoom=10&addressdetails=1`)
      .then(response => response.json())
      .then(data => {
        const address = data.address || {};
        
        // Extract CITY - try in priority order
        let city = address.city 
                   || address.town 
                   || address.village 
                   || address.municipality
                   || address.district
                   || address.county 
                   || address.state 
                   || '';
        
        // Extract COUNTRY
        const country = address.country || 'India';
        
        // If no city found, use the first part of display name
        if (!city && data.display_name) {
          const parts = data.display_name.split(',');
          city = parts[0].trim();
        }
        
        // Set the form fields
        if (city) {
          document.getElementById('location').value = city;
        }
        if (country) {
          document.querySelector('input[name="listing[country]"]').value = country;
        }
        
        console.log('Location geocoded - City:', city, 'Country:', country);
        alert('Location selected: ' + city + ', ' + country);
        toggleMapPicker();
      })
      .catch(error => {
        console.error('Error fetching address:', error);
        // Still save coordinates even if address fetch fails
        alert('Location coordinates saved. Address details could not be fetched.');
        toggleMapPicker();
      });
  } else {
    alert('Please click on the map to select a location first.');
  }
}
