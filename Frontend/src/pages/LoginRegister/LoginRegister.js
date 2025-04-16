import './LoginRegister.css';
import { Home } from '../Home/Home.js';
import { Header } from '../../components/Header/Header.js';

export const LoginRegister = () => {
  const main = document.querySelector('main');
  main.innerHTML = ``;

  const LoginRegisterContainer = document.createElement('div');
  Login(LoginRegisterContainer);
  LoginRegisterContainer.id = 'LogReg-container';

  main.append(LoginRegisterContainer);
};

const Login = (formContainer) => {
  const form = document.createElement('form');

  const inputEmail = document.createElement('input');
  inputEmail.type = 'text';
  inputEmail.placeholder = 'Escribe tu email';
  inputEmail.classList.add('form-input');

  const labelEmail = document.createElement('label');
  labelEmail.textContent = 'Email';
  labelEmail.classList.add('form-label');

  const inputPassword = document.createElement('input');
  inputPassword.type = 'password';
  inputPassword.placeholder = 'Escribe tu contraseña';
  inputPassword.classList.add('form-input');

  const labelPassword = document.createElement('label');
  labelPassword.textContent = 'Contraseña';
  labelPassword.classList.add('form-label');

  const formButton = document.createElement('button');
  formButton.type = 'submit';
  formButton.textContent = 'Acceder';
  formButton.classList.add('form-button');

  const infoText = document.createElement('p');
  infoText.textContent =
    'Si no tienes cuenta no te preocupes, se creará automáticamente al hacer clic en "Acceder".';
  infoText.classList.add('form-info');

  form.append(
    labelEmail,
    inputEmail,
    labelPassword,
    inputPassword,
    formButton,
    infoText
  );
  formContainer.append(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    SubmitEvent(inputEmail.value, inputPassword.value, form);
  });
};

const SubmitEvent = async (email, password, form) => {
  const specifications = {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'content-type': 'application/json' }
  };

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
    const SubmitError = document.createElement('p');
    SubmitError.textContent = error.message || 'Error en autenticación';
    SubmitError.classList.add('form-error');
    form.append(SubmitError);
  }
};
