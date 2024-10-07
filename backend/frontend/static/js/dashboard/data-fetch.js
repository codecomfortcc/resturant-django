document.addEventListener('DOMContentLoaded', () => {
  fetchReservations();
});

async function fetchReservations() {
  try {
      const response = await fetch('/api/reservations');
      const reservations = await response.json();
      displayReservations(reservations);
  } catch (error) {
      console.error('Error fetching reservations:', error);
  }
}

function displayReservations(reservations) {
  const container = document.getElementById('reservations-container');
  container.innerHTML = '';

  reservations.forEach(reservation => {
      const card = createReservationCard(reservation);
      container.appendChild(card);
  });
}

function createReservationCard(reservation) {
  const card = document.createElement('div');
  card.className = 'dashboard-reservation-card';
  card.innerHTML = `
      <div class="dashboard-card-header">
          <h2>${reservation.name}</h2>
      </div>
      <div class="dashboard-card-content">
          <p><strong>Date:</strong> ${reservation.date}</p>
          <p><strong>Time:</strong> ${reservation.time}</p>
          <p><strong>Guests:</strong> ${reservation.guests}</p>
          <p><strong>Phone:</strong> ${reservation.phone}</p>
          ${reservation.message ? `<p><strong>Message:</strong> ${reservation.message}</p>` : ''}
      </div>
  `;
  return card;
}

async function deleteReservation(id) {
  try {
      await fetch(`/api/reservations/${id}/`, { method: 'DELETE' });
      fetchReservations();
  } catch (error) {
      console.error('Error deleting reservation:', error);
  }
}


lucide.createIcons();
