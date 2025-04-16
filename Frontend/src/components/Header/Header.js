import { Home } from '../../pages/Home/Home';
import { CreateEvent } from '../../pages/CreateEvent/CreateEvent';
import { PublishedEvents } from '../../pages/PublishedEvents/PublishedEvents';
import { LoginRegister } from '../../pages/LoginRegister/LoginRegister';
import { UserProfile } from '../../pages/UserProfile/UserProfile';
import './Header.css';

export const Header = () => {
  const header = document.querySelector('header');
  header.innerHTML = '';
  const navbar = document.createElement('nav');

  const user = JSON.parse(localStorage.getItem('user'));

  const routes = [{ text: 'Home', function: Home }];

  if (user) {
    routes.push({ text: 'Publicar Evento', function: CreateEvent });
    routes.push({ text: 'Eventos Publicados', function: PublishedEvents });
    routes.push({ text: 'Tu cuenta', function: UserProfile });
  } else {
    routes.push({ text: 'Acceso | Registro', function: LoginRegister });
  }

  for (const route of routes) {
    const link = document.createElement('a');
    link.classList.add('navbar-link');
    link.innerHTML = route.text;
    link.addEventListener('click', () => {
      const main = document.querySelector('main');
      main.innerHTML = '';
      route.function();
    });
    navbar.appendChild(link);
  }
  header.appendChild(navbar);
};
