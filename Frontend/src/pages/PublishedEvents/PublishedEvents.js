import './PublishedEvents.css';
import { CreateEvent } from '../CreateEvent/CreateEvent';
import { createButton } from '../../components/Buttons/Buttons';
import { printPublishedEvents } from '../../utils/printPublishedEvents';
import { Loading } from '../../components/Loading/Loading';
import { fetchAPI } from '../../utils/fetchAPI';

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
    const events = await fetchAPI(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/events/me/events`,
      'GET',
      null,
      token
    );
    printPublishedEvents(events, main);
  } finally {
    removeLoader();
  }
};
