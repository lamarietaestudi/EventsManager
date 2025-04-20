import { createButton } from '../components/Buttons/Buttons';
import { ConfirmMessage } from '../components/ConfirmMessages/ConfirmMessages';
import { Loading } from '../components/Loading/Loading';
import { fetchAPI } from './fetchAPI';

export const printPublishedEvents = (events, main) => {
  const eventsContainer = document.createElement('div');
  eventsContainer.classList.add('published-events-container');

  events.forEach((event) => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');
    eventCard.dataset.eventId = event._id;

    const eventPosterContainer = document.createElement('div');
    eventPosterContainer.classList.add('event-poster-container');

    const eventPoster = document.createElement('img');
    eventPoster.src = event.poster;
    eventPoster.alt = event.title;
    eventPoster.classList.add('event-poster');

    eventPosterContainer.append(eventPoster);

    const eventInfo = document.createElement('div');
    eventInfo.classList.add('event-info');

    const eventTitle = document.createElement('h3');
    eventTitle.textContent = event.title;
    eventTitle.classList.add('event-title');
    eventTitle.contentEditable = false;

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('event-controls');

    let isEditing = false;

    const editSaveButton = createButton(
      'Editar',
      'btn btn-secondary',
      async () => {
        isEditing = !isEditing;
        if (isEditing) {
          editSaveButton.textContent = 'Guardar cambios';
          eventTitle.contentEditable = true;
          eventLocation.contentEditable = true;
          eventDescription.contentEditable = true;
          eventTitle.classList.add('editable');
          eventLocation.classList.add('editable');
          eventDescription.classList.add('editable');

          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.classList.add('edit-poster-input');
          fileInput.accept = 'image/*';
          eventPosterContainer.appendChild(fileInput);
          const existingMessage = eventCard.querySelector('.confirm-message');
          if (existingMessage) existingMessage.remove();
        } else {
          const removeLoader = Loading(eventCard);
          const token = localStorage.getItem('token');
          const eventId = event._id;
          const formData = new FormData();
          formData.append('title', eventTitle.textContent);
          formData.append('location', eventLocation.textContent);
          formData.append('description', eventDescription.textContent);

          const fileInput =
            eventPosterContainer.querySelector('.edit-poster-input');
          if (fileInput?.files[0]) {
            formData.append('poster', fileInput.files[0]);
          }

          try {
            const updatedEvent = await fetchAPI(
              `http://localhost:3000/api/v1/events/${eventId}`,
              'PUT',
              formData,
              token
            );

            const existingMessage = eventCard.querySelector('.confirm-message');
            if (existingMessage) existingMessage.remove();

            eventPoster.src = updatedEvent.poster;
            const message = ConfirmMessage(
              'success',
              'Cambios guardados correctamente.'
            );
            eventCard.appendChild(message);
            eventTitle.contentEditable = false;
            eventLocation.contentEditable = false;
            eventDescription.contentEditable = false;
            eventTitle.classList.remove('editable');
            eventLocation.classList.remove('editable');
            eventDescription.classList.remove('editable');
            fileInput?.remove();
          } catch (error) {
            const message = ConfirmMessage(
              'failed',
              'Error al intentar guardar los cambios.'
            );
            eventCard.appendChild(message);
          } finally {
            removeLoader();
          }
          editSaveButton.textContent = 'Editar';
        }
      }
    );

    const deleteButton = createButton(
      'Eliminar',
      'btn btn-delete',
      async () => {
        const confirmDelete = confirm(
          '¿Estás seguro de que quieres eliminar este evento?'
        );
        if (confirmDelete) {
          const removeLoader = Loading(eventCard);
          const token = localStorage.getItem('token');
          const eventId = event._id;

          try {
            await fetchAPI(
              `http://localhost:3000/api/v1/events/${eventId}`,
              'DELETE',
              null,
              token
            );

            const existingMessage = eventCard.querySelector('.confirm-message');
            if (existingMessage) existingMessage.remove();

            eventCard.remove();
            const message = ConfirmMessage(
              'success',
              'Evento eliminado con éxito.'
            );
            eventsContainer.appendChild(message);
          } catch (error) {
            const message = ConfirmMessage(
              'failed',
              'Error al intentar eliminar el evento.'
            );
            eventCard.appendChild(message);
          } finally {
            removeLoader();
          }
        }
      }
    );

    controlsContainer.append(editSaveButton, deleteButton);

    const eventLocation = document.createElement('p');
    eventLocation.textContent = `${event.location}`;
    eventLocation.classList.add('event-text', 'event-location');
    eventLocation.contentEditable = false;

    const eventDescription = document.createElement('p');
    eventDescription.textContent = `${event.description}`;
    eventDescription.classList.add('event-text', 'event-description');
    eventDescription.contentEditable = false;

    const eventFooter = document.createElement('div');
    eventFooter.classList.add('event-footer');
    eventFooter.append(controlsContainer);

    eventInfo.append(eventTitle, eventLocation, eventDescription);
    eventCard.append(eventPosterContainer, eventInfo, eventFooter);
    eventsContainer.appendChild(eventCard);
  });
  main.appendChild(eventsContainer);
};
