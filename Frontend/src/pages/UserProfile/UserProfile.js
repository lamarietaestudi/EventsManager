import './UserProfile.css';
import { Header } from '../../components/Header/Header';

export const UserProfile = async () => {
  const main = document.querySelector('main');
  main.innerHTML = ``;

  const profilePanel = document.createElement('div');
  profilePanel.id = 'profilePanel';

  const user = JSON.parse(localStorage.getItem('user'));

  const labelEmail = document.createElement('label');
  labelEmail.textContent = 'Email';
  labelEmail.classList.add('form-label');

  const inputEmail = document.createElement('input');
  inputEmail.type = 'email';
  inputEmail.value = user.email;
  inputEmail.disabled = true;
  inputEmail.classList.add('form-input');

  const labelPassword = document.createElement('label');
  labelPassword.textContent = 'Contraseña';
  labelPassword.classList.add('form-label');

  const inputPassword = document.createElement('input');
  inputPassword.type = 'password';
  inputPassword.value = '**********';
  inputPassword.disabled = true;
  inputPassword.classList.add('form-input');

  const labelFavorites = document.createElement('label');
  labelFavorites.textContent = 'Mis eventos favoritos';
  labelFavorites.classList.add('form-label');

  const favoriteList = document.createElement('ul');
  favoriteList.classList.add('favorites-list');

  const renderFavoriteList = (favorites) => {
    favoriteList.innerHTML = '';
    if (favorites && favorites.length > 0) {
      favorites.forEach((event) => {
        const li = document.createElement('li');
        li.dataset.id = event._id;
        const title = document.createElement('h3');
        title.textContent = event.title;
        title.classList.add('event-title');
        li.append(title);
        favoriteList.appendChild(li);
      });
    } else {
      const noFavorites = document.createElement('p');
      noFavorites.textContent = 'No tienes eventos favoritos.';
      favoriteList.appendChild(noFavorites);
    }
  };

  renderFavoriteList(user.favoriteEvents);

  const editSaveButton = document.createElement('button');
  editSaveButton.textContent = 'Editar';
  editSaveButton.classList.add('form-button', 'primary');

  const logoutButton = document.createElement('button');
  logoutButton.textContent = 'Cerrar sesión';
  logoutButton.classList.add('logout-button');

  const separator = document.createElement('hr');
  separator.classList.add('separator');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Eliminar cuenta';
  deleteButton.classList.add('delete-button');

  const message = document.createElement('p');
  message.classList.add('profile-message');
  message.textContent = '';

  let isEditing = false;

  editSaveButton.addEventListener('click', async () => {
    isEditing = !isEditing;
    if (isEditing) {
      editSaveButton.textContent = 'Guardar cambios';
      inputEmail.disabled = false;
      inputPassword.disabled = false;
      inputEmail.classList.add('editable');
      inputPassword.classList.add('editable');
      message.textContent = '';
    } else {
      const token = localStorage.getItem('token');
      const userId = user._id;

      const updateData = {
        email: inputEmail.value
      };

      if (
        inputPassword.value.trim() !== '' &&
        inputPassword.value !== '**********'
      ) {
        updateData.password = inputPassword.value;
      }

      const res = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        delete updatedUser.password;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        message.textContent = 'Cambios guardados correctamente.';
        message.classList.remove('error');
        message.classList.add('success');
        inputEmail.disabled = true;
        inputPassword.disabled = true;
        inputEmail.classList.remove('editable');
        inputPassword.classList.remove('editable');
      } else {
        message.textContent = 'Error al guardar los cambios.';
        message.classList.remove('success');
        message.classList.add('error');
      }
      editSaveButton.textContent = 'Editar';
    }
  });

  logoutButton.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/';
  });

  deleteButton.addEventListener('click', async () => {
    const confirmDelete = confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

    if (confirmDelete) {
      const userId = user._id;
      const token = localStorage.getItem('token');

      const res = await fetch(
        `http://localhost:3000/api/v1/users/delete/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        localStorage.clear();
        alert('Cuenta eliminada con éxito');
        Header();
        Home();
      } else {
        alert('Hubo un error al eliminar tu cuenta');
      }
    }
  });

  profilePanel.append(
    labelEmail,
    inputEmail,
    labelPassword,
    inputPassword,
    labelFavorites,
    favoriteList,
    editSaveButton,
    message,
    logoutButton,
    separator,
    deleteButton
  );

  main.append(profilePanel);
};
