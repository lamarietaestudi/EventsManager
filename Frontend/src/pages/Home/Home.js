import './Home.css';
import { printEvents } from '../../utils/printEvents';
import { Loading } from '../../components/Loading/Loading';

export const Home = async () => {
  const main = document.querySelector('main');
  main.innerHTML = ``;
  const removeLoader = Loading(main);

  try {
    const res = await fetch('http://localhost:3000/api/v1/events');
    const events = await res.json();

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
