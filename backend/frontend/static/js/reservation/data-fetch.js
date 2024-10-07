document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^0-9]/g, ''); // Only allow numbers
      
  });
  const state = {
      totalSeats: 80,
      remainingSeats: 80,
      timeSlots: [
          '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
          '01:00 PM', '02:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
          '08:00 PM', '09:00 PM', '10:00 PM'
      ],
      selectedDate: new Date().toISOString().split("T")[0],
      selectedTime: new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isLoading: false,
      isSuccess: false,
      showPopup: false
  };

  const seatCheckForm = document.getElementById('seatCheckForm');
  const reservationForm = document.getElementById('reservationForm');
  const selectedDateInput = document.getElementById('selectedDate');
  const selectedTimeSelect = document.getElementById('selectedTime');
  const reservationDateInput = document.getElementById('reservationDate');
  const reservationTimeSelect = document.getElementById('reservationTime');
  const guestsSelect = document.getElementById('guestsSelect');
  const seatGrid = document.getElementById('seatGrid');
  const availableSeatsSpan = document.getElementById('availableSeats');
  const bookedSeatsSpan = document.getElementById('bookedSeats');
  const popupOverlay = document.getElementById('popupOverlay');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const spinnerText = document.getElementById('spinner-text');
  const popupMessage = document.getElementById('popupMessage');
  const popupTitle = document.getElementById('popupTitle');
  const popupText = document.getElementById('popupText');
  const closePopupButton = document.getElementById('closePopup');
  updatePopup();
  function initializePage() {
      selectedDateInput.value = state.selectedDate;
      reservationDateInput.value = state.selectedDate;
      reservationDateInput.setAttribute('min', new Date().toISOString().split("T")[0]); // Prevent past dates
      populateTimeSlots();
      fetchSeatAvailability(state.selectedDate, state.selectedTime);
  }

  function populateTimeSlots() {
      const availableTimeSlots = getAvailableTimeSlots(state.selectedDate);
      [selectedTimeSelect, reservationTimeSelect].forEach(select => {
          select.innerHTML = '<option value="" disabled selected>Preferred Time</option>';
          availableTimeSlots.forEach(time => {
              const option = document.createElement('option');
              option.value = time;
              option.textContent = time;
              if (time === state.selectedTime) {
                  option.selected = true;
              }
              select.appendChild(option);
          });
      });
  }

  async function fetchSeatAvailability(date, time) {
      try {

          const response = await fetch(`/api/seat-availability/check-availability/?date=${date}&time=${time}`);
          
          const data = await response.json();
          console.log(data);
          const formattedData = data.filter( item => item.date === date && item.time === time );
          console.log(formattedData)
          if(formattedData.length === 0){
            state.totalSeats = 80;
            state.remainingSeats = 80;
            updateSeatGrid();
          }
          else{
          state.totalSeats = formattedData[0].total_seats || 80;
          state.remainingSeats = formattedData[0].remaining_seats || 80;
          updateSeatGrid();
          }
      } catch (error) {
          console.error("Error fetching seat availability:", error);
      }
  }

  function updateSeatGrid() {
      const bookedSeats = state.totalSeats - state.remainingSeats;
      const blocks = Math.ceil(state.totalSeats / 4);

      seatGrid.innerHTML = '';
      for (let i = 0; i < blocks; i++) {
          const block = document.createElement('div');
          block.className = 'seat-block';
          for (let j = 0; j < 2; j++) {
              const row = document.createElement('div');
              row.className = 'seat-row';
              for (let k = 0; k < 2; k++) {
                  const seatIndex = i * 4 + j * 2 + k;
                  const seat = document.createElement('div');
                  seat.className = `seat ${seatIndex < bookedSeats ? 'booked' : 'available'}`;
                  row.appendChild(seat);
              }
              block.appendChild(row);
          }
          seatGrid.appendChild(block);
      }

      availableSeatsSpan.textContent = state.remainingSeats;
      bookedSeatsSpan.textContent = state.totalSeats - state.remainingSeats;
      updateGuestsSelect();
  }

  function updateGuestsSelect() {
      const maxGuests = Math.min(state.remainingSeats, 7);
      guestsSelect.innerHTML = '<option value="" disabled selected>Number of Guests</option>';
      for (let i = 1; i <= maxGuests; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.textContent = `${i} Person${i !== 1 ? 's' : ''}`;
          guestsSelect.appendChild(option);
      }
  }

  function getAvailableTimeSlots(selectedDate) {
      const now = new Date();
      const isToday = selectedDate === now.toISOString().split("T")[0];

      if (!isToday) {
          return state.timeSlots;
      }

      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      return state.timeSlots.filter(slot => {
          const [hours, minutes, period] = slot.match(/(\d+):(\d+) (\w+)/).slice(1);
          const slotHours = parseInt(hours) + (period === 'PM' && hours !== '12' ? 12 : 0);
          const slotMinutes = parseInt(minutes);
          return (slotHours > currentHour) || (slotHours === currentHour && slotMinutes > currentMinutes);
      });
  }

  seatCheckForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
  
      const selectedDate = formData.get('selectedDate');
      const selectedTime = formData.get('selectedTime');
      
      if (selectedDate && selectedTime) {
          state.selectedDate = selectedDate;
          state.selectedTime = selectedTime;
          await fetchSeatAvailability(selectedDate, selectedTime);
      } else {
          alert("Please select a date and time.");
      }
  });

  reservationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const errorMessageField = document.getElementById('error-message');
      errorMessageField.textContent = ''; 
      const reservationData = {
          name: formData.get('name'),
          phone: formData.get('phone'),
          guests: formData.get('person'),
          date: formData.get('reservation-date'),
          time: formData.get('time'),
          message: formData.get('message'),
      };
      // validate reservation data
    
    // Validate phone number - only allow numbers
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(reservationData.phone)) {
        errorMessageField.textContent = 'Phone must be numbers only.';
        return;
    }
    if (reservationData.phone.length !== 10) {
      errorMessageField.textContent = 'Phone number must be 10 digits.';
      return;
  }
    // Validate the number of guests (max 7 persons)
    if (reservationData.guests > 7) {
        errorMessageField.textContent = 'Max 7 guests allowed.';
        return;
    }

    // Validate date - no previous dates allowed
    const currentDate = new Date();
    const selectedDate = new Date(reservationData.date);
    
    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
        errorMessageField.textContent = 'Date must be in the future.';
        return;
    }

    // Validate time for today's date - no over slots
    const selectedTime = reservationData.time.split(':');
    const currentTime = new Date().getHours();

    if (selectedDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0) && selectedTime[0] <= currentTime) {
        errorMessageField.textContent = 'Time already passed.';
        return;
    }
      state.isLoading = true;
      state.showPopup = true;
      updatePopup();

      try {
          const response = await fetch('/api/reservations/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken')
              },
              body: JSON.stringify(reservationData)
          });
          
          if (!response.ok) {
              throw new Error('Reservation failed');
          }

          state.isLoading = false;
          state.isSuccess = true;
          updatePopup();
          e.target.reset();
      } catch (error) {
          console.error('Reservation failed:', error);
          state.isLoading = false;
          state.isSuccess = false;
          updatePopup();
      }
  });

  function updatePopup() {
      popupOverlay.style.display = state.showPopup ? 'flex' : 'none';
      popupMessage.style.display = !state.isLoading ? 'block' : 'none';
      loadingSpinner.style.display = state.isLoading ? 'block' : 'none';
      spinnerText.style.display = state.isLoading ? 'block' : 'none';

      if (!state.isLoading) {
          popupTitle.textContent = state.isSuccess ? "Table Booked Successfully!" : "Booking Failed";
          popupText.textContent = state.isSuccess ? "We look forward to serving you." : "Please try again later.";
      }
  }

  closePopupButton.addEventListener('click', function() {
      state.showPopup = false;
      state.isSuccess = false;
      updatePopup();
  });

  [selectedDateInput, reservationDateInput].forEach(input => {
      input.addEventListener('change', function() {
          state.selectedDate = this.value;
          populateTimeSlots();
      });
  });

  function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }

  initializePage();
});
