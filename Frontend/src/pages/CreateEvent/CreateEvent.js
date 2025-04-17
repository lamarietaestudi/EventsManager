import './CreateEvent.css';
import { createForm } from '../../components/Forms/Forms';
import { createButton } from '../../components/Buttons/Buttons';
import { ConfirmMessage } from '../../components/ConfirmMessages/ConfirmMessages';
import { Loading } from '../../components/Loading/Loading';

export const CreateEvent = () => {
  const main = document.querySelector('main');
  main.innerHTML = '';

  const createEventContainer = document.createElement('div');
  createEventContainer.id = 'create-event-container';

  const form = createForm([
    {
      label: 'Título del evento',
      type: 'text',
      name: 'title',
      placeholder: 'Escribe el título del evento',
      required: true
    },
    {
      label: 'Ubicación',
      type: 'text',
      name: 'location',
      placeholder: 'Escribe la ubicación del evento',
      required: true
    },
    {
      label: 'Descripción',
      type: 'textarea',
      name: 'description',
      placeholder: 'Escribe una descripción del evento',
      required: true
    },
    {
      label: 'Póster del evento',
      type: 'file',
      name: 'poster',
      required: true
    }
  ]);

  const submitButton = createButton(
    'Publicar Evento',
    'btn btn-primary',
    async (e) => {
      e.preventDefault();

      const removeLoader = Loading(document.querySelector('main'));

      const existingMessage =
        createEventContainer.querySelector('.confirm-message');
      if (existingMessage) {
        existingMessage.remove();
      }

      const title = form.querySelector('[name="title"]').value;
      const location = form.querySelector('[name="location"]').value;
      const description = form.querySelector('[name="description"]').value;
      const posterInput = form.querySelector('[name="poster"]');

      if (!title || !location || !description || !posterInput.files[0]) {
        const message = ConfirmMessage(
          'failed',
          'Por favor, completa todos los campos.'
        );
        createEventContainer.appendChild(message);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('location', location);
      formData.append('description', description);
      formData.append('poster', posterInput.files[0]);

      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:3000/api/v1/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (res.ok) {
          const message = ConfirmMessage('success', 'Evento creado con éxito.');
          createEventContainer.appendChild(message);
          form.reset();
        } else {
          const errorData = await res.json();
          const message = ConfirmMessage(
            'failed',
            `Error al crear el evento: ${
              errorData.message || 'Error desconocido'
            }`
          );
          createEventContainer.appendChild(message);
        }
      } catch (error) {
        const message = ConfirmMessage(
          'failed',
          'Error al intentar crear el evento.'
        );
        createEventContainer.appendChild(message);
      } finally {
        removeLoader();
      }
    }
  );

  form.appendChild(submitButton);
  createEventContainer.appendChild(form);
  main.appendChild(createEventContainer);
};
