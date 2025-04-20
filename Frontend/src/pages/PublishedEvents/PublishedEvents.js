import './PublishedEvents.css';
import { CreateEvent } from '../CreateEvent/CreateEvent';
import { createButton } from '../../components/Buttons/Buttons';
import { printPublishedEvents } from '../../utils/printPublishedEvents';
import { Loading } from '../../components/Loading/Loading';

export const PublishedEvents = async () => {
  const main = document.querySelector('main');
  main.innerHTML = ``;

  const createNewEvent = createButton(
    'Añadir nuevo Evento',
    'btn btn-primary',
    () => {
      CreateEvent();
    }
  );

  main.appendChild(createNewEvent);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const removeLoader = Loading(main);

  try {
    const res = await fetch('http://localhost:3000/api/v1/events/me/events', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.error(`Error al obtener eventos publicados: ${res.status}`);
      return;
    }

    const events = await res.json();
    printPublishedEvents(events, main);
  } finally {
    removeLoader();
  }
};
