import './UserProfile.css';
import { Header } from '../../components/Header/Header';
import { Home } from '../Home/Home';
import { createForm } from '../../components/Forms/Forms';
import { createButton } from '../../components/Buttons/Buttons';
import { ConfirmMessage } from '../../components/ConfirmMessages/ConfirmMessages';
import { Loading } from '../../components/Loading/Loading';

export const UserProfile = async () => {
  const main = document.querySelector('main');
  main.innerHTML = ``;

  const profileContainer = document.createElement('div');
  profileContainer.id = 'profileContainer';

  const user = JSON.parse(localStorage.getItem('user'));

  const form = createForm([
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      placeholder: 'Tu correo electrónico',
      value: user.email,
      required: true,
      disabled: true
    },
    {
      label: 'Contraseña',
      type: 'password',
      name: 'password',
      placeholder: '**********',
      value: '**********',
      required: false,
      disabled: true
    }
  ]);

  profileContainer.appendChild(form);

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

  let isEditing = false;

  const editSaveButton = createButton('Editar', 'btn btn-primary', async () => {
    isEditing = !isEditing;
    const emailInput = form.querySelector('[name="email"]');
    const passwordInput = form.querySelector('[name="password"]');

    if (isEditing) {
      editSaveButton.textContent = 'Guardar cambios';
      emailInput.disabled = false;
      passwordInput.disabled = false;
      emailInput.classList.add('editable');
      passwordInput.classList.add('editable');
    } else {
      const token = localStorage.getItem('token');
      const userId = user._id;

      const updateData = {
        email: emailInput.value
      };

      if (
        passwordInput.value.trim() !== '' &&
        passwordInput.value !== '**********'
      ) {
        updateData.password = passwordInput.value;
      }
      const removeLoader = Loading(profileContainer);

      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/users/${userId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
          }
        );

        if (res.ok) {
          const updatedUser = await res.json();
          delete updatedUser.password;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          const message = ConfirmMessage(
            'success',
            'Cambios guardados correctamente.'
          );
          profileContainer.appendChild(message);
        } else {
          const message = ConfirmMessage(
            'failed',
            'Error al guardar los cambios.'
          );
          profileContainer.appendChild(message);
        }
      } finally {
        removeLoader();
      }

      editSaveButton.textContent = 'Editar';
    }
  });

  const logoutButton = createButton(
    'Cerrar sesión',
    'btn btn-secondary',
    () => {
      localStorage.clear();
      window.location.href = '/';
    }
  );

  const deleteButton = createButton(
    'Eliminar cuenta',
    'btn btn-delete',
    async () => {
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
    }
  );

  const separator = document.createElement('hr');
  separator.classList.add('separator');

  profileContainer.append(
    form,
    editSaveButton,
    labelFavorites,
    favoriteList,
    logoutButton,
    separator,
    deleteButton
  );

  main.append(profileContainer);
};
