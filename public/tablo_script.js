async function fetchFlightData() {
    const contentDiv = document.getElementById('content');

    try {
        // Запрос к вашему серверу
        const response = await fetch('http://localhost:3000/api/flights');
        const data = await response.json();

        if (!data.success || !data.data || data.data.length === 0) {
            return;
        }

        let tableHTML = `
          <table>
            <tr>
              <th>Reis</th>
              <th>Baǵyt</th>
              <th>Áue kompaniyasy</th>
              <th>Mártebesi</th>
              <th>Uaqyt</th>
            </tr>
        `;

        data.data.forEach(flight => {
            let statusClass = '';
            if (flight.status.includes('По расписанию')) {
                statusClass = 'status-scheduled';
            } else if (flight.status.includes('Задерживается')) {
                statusClass = 'status-delayed';
            } else if (flight.status.includes('Вылетел')) {
                statusClass = 'status-departed';
            } else if (flight.status.includes('Отменен')) {
                statusClass = 'status-cancelled';
            }

            tableHTML += `
            <tr>
              <td>${flight.flight}</td>
              <td>${flight.destination}</td>
              <td>${flight.airline}</td>
              <td class="status ${statusClass}">${flight.status}</td>
              <td>${flight.time}</td>
            </tr>
          `;
        });

        tableHTML += '</table>';
        contentDiv.innerHTML = tableHTML;

    } catch (error) {
        console.error('Ошибка:', error);
        contentDiv.innerHTML = `<div class="error">Ошибка загрузки данных: ${error.message}</div>`;
    }
}

fetchFlightData();
setInterval(fetchFlightData, 30000); // Обновление каждые 30 секунд