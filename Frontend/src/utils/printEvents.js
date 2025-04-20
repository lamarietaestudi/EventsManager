import { toggleFavoriteEvent } from './toggleFavoriteEvent';
import { toggleAssistance } from './toggleAssistance';
import { updateVisitors } from './updateVisitors';

export const printEvents = (
  events,
  main,
  favoriteEvents = [],
  assistToEvents = [],
  token
) => {
  const eventsContainer = document.createElement('div');
  eventsContainer.classList.add('events-container');

  const user = token ? JSON.parse(localStorage.getItem('user')) : null;

  events.forEach((event) => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');

    const eventPoster = document.createElement('img');
    eventPoster.src = event.poster;
    eventPoster.alt = event.title;
    eventPoster.classList.add('event-poster');

    const eventInfo = document.createElement('div');
    eventInfo.classList.add('event-info');

    const eventHead = document.createElement('div');
    eventHead.classList.add('event-head');

    const eventTitle = document.createElement('h3');
    eventTitle.textContent = event.title;
    eventTitle.classList.add('event-title');

    eventHead.append(eventTitle);

    if (user) {
      const likeEvent = document.createElement('img');
      likeEvent.src = favoriteEvents.includes(event._id)
        ? '/assets/like-full.png'
        : '/assets/like-empty.png';
      likeEvent.classList.add('like-event');

      likeEvent.addEventListener('click', () =>
        toggleFavoriteEvent(event._id, likeEvent)
      );
      eventHead.append(likeEvent);
    }

    const eventLocation = document.createElement('p');
    eventLocation.textContent = event.location;
    eventLocation.classList.add('event-text');

    const eventDescription = document.createElement('p');
    eventDescription.textContent = event.description;
    eventDescription.classList.add('event-text');

    const assistanceContainer = document.createElement('div');
    assistanceContainer.classList.add('assistance-container');

    if (user) {
      const assistanceList = document.createElement('div');
      assistanceList.classList.add('assistance-list');

      const assistanceConfirmation = document.createElement('div');
      assistanceConfirmation.classList.add('assistance-confirmation');

      const assistanceLabel = document.createElement('label');
      assistanceLabel.textContent = 'Confirmar asistencia';
      assistanceLabel.classList.add('assistance-label');

      const assistanceCheck = document.createElement('input');
      assistanceCheck.type = 'checkbox';
      assistanceCheck.checked = assistToEvents.includes(event._id.toString());
      assistanceCheck.classList.add('assistance-check');

      assistanceConfirmation.append(assistanceLabel, assistanceCheck);
      assistanceContainer.append(assistanceList, assistanceConfirmation);

      toggleAssistance(assistanceCheck, event._id, user, token, assistanceList);

      updateVisitors(event._id, token, assistanceList);
    }

    eventInfo.append(
      eventHead,
      eventLocation,
      eventDescription,
      assistanceContainer
    );
    eventCard.append(eventPoster, eventInfo);
    eventsContainer.appendChild(eventCard);
  });

  main.appendChild(eventsContainer);
};
