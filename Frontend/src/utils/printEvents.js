import { toggleFavoriteEvent } from './toggleFavoriteEvent';

export const printEvents = (events, main, favoriteEvents = []) => {
  const eventsContainer = document.createElement('div');
  eventsContainer.classList.add('events-container');

  const user = JSON.parse(localStorage.getItem('user'));

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

    if (user) {
      const likeEvent = document.createElement('img');
      likeEvent.src = favoriteEvents.includes(event._id)
        ? '/assets/like-full.png'
        : '/assets/like-empty.png';
      likeEvent.classList.add('like-event');

      likeEvent.addEventListener('click', () =>
        toggleFavoriteEvent(event._id, likeEvent)
      );
      eventHead.append(eventTitle, likeEvent);
    } else {
      eventHead.append(eventTitle);
    }
    const eventLocation = document.createElement('p');
    eventLocation.textContent = `${event.location}`;
    eventLocation.classList.add('event-text');

    const eventDescription = document.createElement('p');
    eventDescription.textContent = `${event.description}`;
    eventDescription.classList.add('event-text');

    eventInfo.append(eventHead, eventLocation, eventDescription);

    eventCard.append(eventPoster, eventInfo);
    eventsContainer.appendChild(eventCard);
  });

  main.appendChild(eventsContainer);
};
