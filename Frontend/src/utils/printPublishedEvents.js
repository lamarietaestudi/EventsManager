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

    const eventHead = document.createElement('div');
    eventHead.classList.add('event-head');

    const eventTitle = document.createElement('h3');
    eventTitle.textContent = event.title;
    eventTitle.classList.add('event-title');
    eventTitle.contentEditable = false;

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('event-controls');

    const editSaveButton = document.createElement('button');
    editSaveButton.textContent = 'Editar';
    editSaveButton.classList.add('edit-button', 'form-button', 'primary');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('delete-button', 'form-button');

    controlsContainer.append(editSaveButton, deleteButton);
    eventHead.append(eventTitle, controlsContainer);

    const eventLocation = document.createElement('p');
    eventLocation.textContent = `${event.location}`;
    eventLocation.classList.add('event-text', 'event-location');
    eventLocation.contentEditable = false;

    const eventDescription = document.createElement('p');
    eventDescription.textContent = `${event.description}`;
    eventDescription.classList.add('event-text', 'event-description');
    eventDescription.contentEditable = false;

    const message = document.createElement('p');
    message.classList.add('event-message');
    message.textContent = '';

    let isEditing = false;

    editSaveButton.addEventListener('click', async () => {
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
        message.textContent = '';
      } else {
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

        const res = await fetch(
          `http://localhost:3000/api/v1/events/${eventId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          }
        );

        if (res.ok) {
          const updatedEvent = await res.json();
          eventPoster.src = updatedEvent.poster;
          message.textContent = 'Cambios guardados correctamente.';
          message.classList.remove('error');
          message.classList.add('success');
          eventTitle.contentEditable = false;
          eventLocation.contentEditable = false;
          eventDescription.contentEditable = false;
          eventTitle.classList.remove('editable');
          eventLocation.classList.remove('editable');
          eventDescription.classList.remove('editable');
          fileInput?.remove();
        } else {
          message.textContent = 'Error al guardar los cambios.';
          message.classList.remove('success');
          message.classList.add('error');
        }
        editSaveButton.textContent = 'Editar';
      }
    });

    deleteButton.addEventListener('click', async () => {
      const confirmDelete = confirm(
        '¿Estás seguro de que quieres eliminar este evento?'
      );
      if (confirmDelete) {
        const token = localStorage.getItem('token');
        const eventId = event._id;
        const res = await fetch(
          `http://localhost:3000/api/v1/events/${eventId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.ok) {
          eventCard.remove();
          alert('Evento eliminado con éxito.');
        } else {
          const errorData = await res.json();
          alert(
            `Error al eliminar el evento: ${
              errorData.message || 'Error desconocido'
            }`
          );
        }
      }
    });

    eventInfo.append(eventLocation, eventDescription, message);
    eventCard.append(eventPosterContainer, eventHead, eventInfo);
    eventsContainer.appendChild(eventCard);
  });
  main.appendChild(eventsContainer);
};
