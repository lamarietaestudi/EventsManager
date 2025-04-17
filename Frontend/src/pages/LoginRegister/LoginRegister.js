import './LoginRegister.css';
import { Home } from '../Home/Home.js';
import { Header } from '../../components/Header/Header.js';
import { createForm } from '../../components/Forms/Forms.js';
import { createButton } from '../../components/Buttons/Buttons.js';
import { ConfirmMessage } from '../../components/ConfirmMessages/ConfirmMessages.js';
import { Loading } from '../../components/Loading/Loading.js';

export const LoginRegister = () => {
  const main = document.querySelector('main');
  main.innerHTML = ``;

  const LoginRegisterContainer = document.createElement('div');
  Login(LoginRegisterContainer);
  LoginRegisterContainer.id = 'LogReg-container';

  main.append(LoginRegisterContainer);
};

const Login = (formContainer) => {
  const form = createForm([
    {
      label: 'Email',
      type: 'text',
      name: 'email',
      placeholder: 'Escribe tu email',
      required: true
    },
    {
      label: 'Contraseña',
      type: 'password',
      name: 'password',
      placeholder: 'Escribe tu contraseña',
      required: true
    }
  ]);

  const formButton = createButton('Acceder', 'btn btn-primary', (event) => {
    event.preventDefault();
    const email = form.querySelector('[name="email"]').value;
    const password = form.querySelector('[name="password"]').value;
    SubmitEvent(email, password, form);
  });

  const infoText = document.createElement('p');
  infoText.textContent =
    'Si no tienes cuenta no te preocupes, se creará automáticamente al clicar en "Acceder".';
  infoText.classList.add('form-info');

  form.append(formButton, infoText);
  formContainer.append(form);
};

const SubmitEvent = async (email, password, form) => {
  const specifications = {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'content-type': 'application/json' }
  };

  const existingMessage = form.querySelector('.confirm-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const removeLoader = Loading(document.querySelector('main'));

  try {
    const res = await fetch(
      'http://localhost:3000/api/v1/users/auth',
      specifications
    );
    const response = await res.json();

    if (res.ok) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      Header();
      Home();
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    const message = ConfirmMessage(
      'failed',
      error.message || 'Error en autenticación'
    );
    form.append(message);
  } finally {
    removeLoader();
  }
};
