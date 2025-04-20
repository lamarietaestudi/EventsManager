import './Home.css';
import { printEvents } from '../../utils/printEvents';
import { Loading } from '../../components/Loading/Loading';
import { fetchAPI } from '../../utils/fetchAPI';

export const Home = async () => {
  const main = document.querySelector('main');
  main.innerHTML = ``;
  const removeLoader = Loading(main);

  try {
    const events = await fetchAPI('http://localhost:3000/api/v1/events', 'GET');
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const favoriteEvents = Array.isArray(user?.favoriteEvents)
      ? user.favoriteEvents.map((event) => event._id)
      : [];

    const assistToEvents = Array.isArray(user?.assistToEvents)
      ? user.assistToEvents.map((event) => event.toString())
      : [];

    printEvents(events, main, favoriteEvents, assistToEvents, token);
  } finally {
    removeLoader();
  }
};
