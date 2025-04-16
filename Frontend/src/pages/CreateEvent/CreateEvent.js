import './CreateEvent.css';

export const CreateEvent = () => {
  const main = document.querySelector('main');
  main.innerHTML = '';

  const messageContainer = document.createElement('div');
  messageContainer.id = 'form-message';
  messageContainer.classList.add('create-event-message');

  const createEventContainer = document.createElement('div');
  createEventContainer.id = 'create-event-container';
  CreateEventForm(createEventContainer, messageContainer);

  main.append(messageContainer, createEventContainer);
};

const CreateEventForm = (formContainer) => {
  const formMessage = document.createElement('div');
  formMessage.id = 'form-message';
  formMessage.classList.add('create-event-message');

  const form = document.createElement('form');
  form.id = 'create-event-form';
  formContainer.append(formMessage, form);
  form.addEventListener('submit', handleSubmit);

  const titleElement = document.createElement('h2');
  titleElement.textContent = 'Crear Nuevo Evento';

  const labelTitle = document.createElement('label');
  labelTitle.setAttribute('for', 'title');
  labelTitle.textContent = 'Nombre del evento';
  labelTitle.classList.add('create-event-label');

  const inputTitle = document.createElement('input');
  inputTitle.type = 'text';
  inputTitle.id = 'title';
  inputTitle.name = 'title';
  inputTitle.required = true;
  inputTitle.classList.add('create-event-input');

  const labelLocation = document.createElement('label');
  labelLocation.setAttribute('for', 'location');
  labelLocation.textContent = 'Ubicación';
  labelLocation.classList.add('create-event-label');

  const inputLocation = document.createElement('input');
  inputLocation.type = 'text';
  inputLocation.id = 'location';
  inputLocation.name = 'location';
  inputLocation.required = true;
  inputLocation.classList.add('create-event-input');

  const labelDescription = document.createElement('label');
  labelDescription.setAttribute('for', 'description');
  labelDescription.textContent = 'Descripción';
  labelDescription.classList.add('create-event-label');

  const textareaDescription = document.createElement('textarea');
  textareaDescription.id = 'description';
  textareaDescription.name = 'description';
  textareaDescription.rows = 5;
  textareaDescription.required = true;
  textareaDescription.classList.add('create-event-textarea');

  const labelPoster = document.createElement('label');
  labelPoster.setAttribute('for', 'poster');
  labelPoster.textContent = 'Imagen del Poster';
  labelPoster.classList.add('create-event-label');

  const inputPoster = document.createElement('input');
  inputPoster.type = 'file';
  inputPoster.id = 'poster';
  inputPoster.name = 'poster';
  inputPoster.accept = 'image/*';
  inputPoster.required = true;
  inputPoster.classList.add('create-event-input');

  const createButton = document.createElement('button');
  createButton.type = 'submit';
  createButton.textContent = 'Publicar Evento';
  createButton.classList.add('create-event-button', 'primary');

  form.append(
    labelTitle,
    inputTitle,
    labelLocation,
    inputLocation,
    labelDescription,
    textareaDescription,
    labelPoster,
    inputPoster,
    createButton
  );
};
async function handleSubmit(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;
  const posterInput = document.getElementById('poster');
  const formMessage = document.getElementById('form-message');

  if (!title || !location || !description || !posterInput.files[0]) {
    formMessage.textContent = 'Por favor, completa todos los campos.';
    formMessage.classList.add('error');
    formMessage.classList.remove('success');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('location', location);
  formData.append('description', description);
  formData.append('poster', posterInput.files[0]);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    formMessage.textContent = 'No estás autorizado para crear eventos.';
    formMessage.classList.add('error');
    formMessage.classList.remove('success');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/v1/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      const eventSaved = await response.json();
      console.log('Evento creado:', eventSaved);
      formMessage.textContent = 'Evento creado con éxito.';
      formMessage.classList.add('success');
      formMessage.classList.remove('error');
      setTimeout(() => {
        formMessage.remove();
      }, 3000);
      document.getElementById('create-event-form').reset();
    } else {
      const errorData = await response.json();
      console.error('Error al crear evento:', errorData);
      formMessage.textContent = `Error al crear el evento: ${
        errorData.message || 'Error desconocido'
      }`;
      formMessage.classList.add('error');
      formMessage.classList.remove('success');
    }
  } catch (error) {
    console.error('Error de red:', error);
    formMessage.textContent = 'Error al intentar crear el evento.';
    formMessage.classList.add('error');
    formMessage.classList.remove('success');
  }
}
