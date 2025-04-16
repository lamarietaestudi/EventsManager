import './Home.css';
import { printEvents } from '../../utils/printEvents';

export const Home = async () => {
  const main = document.querySelector('main');
  main.innerHTML = ``;

  const res = await fetch('http://localhost:3000/api/v1/events');
  const events = await res.json();

  const user = JSON.parse(localStorage.getItem('user'));
  const favoriteEvents = Array.isArray(user?.favoriteEvents)
    ? user.favoriteEvents.map((event) => event._id)
    : [];
  printEvents(events, main, favoriteEvents);
};
