import { fetchAPI } from './fetchAPI';

export const toggleFavoriteEvent = async (eventId, likeEvent) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isCurrentlyFavorite = likeEvent.src.includes('like-full.png');
  const method = isCurrentlyFavorite ? 'DELETE' : 'PUT';
  const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${
    user._id
  }/favorites/${eventId}`;

  if (!token) {
    console.error('Autenticación incorrecta.');
    return;
  }

  const originalFavorites = [...user.favoriteEvents];
  const updatedFavorites = isCurrentlyFavorite
    ? user.favoriteEvents.filter((favEvent) => favEvent._id !== eventId)
    : [...new Set([...user.favoriteEvents, { _id: eventId }])];

  likeEvent.src = isCurrentlyFavorite
    ? '/assets/like-empty.png'
    : '/assets/like-full.png';

  localStorage.setItem(
    'user',
    JSON.stringify({ ...user, favoriteEvents: updatedFavorites })
  );

  try {
    const updatedUserFromServer = await fetchAPI(url, method, null, token);
    localStorage.setItem('user', JSON.stringify(updatedUserFromServer));
  } catch (error) {
    console.error('Error en la solicitud:', error);
    localStorage.setItem(
      'user',
      JSON.stringify({ ...user, favoriteEvents: originalFavorites })
    );
    likeEvent.src = isCurrentlyFavorite
      ? '/assets/like-full.png'
      : '/assets/like-empty.png';
  }
};
