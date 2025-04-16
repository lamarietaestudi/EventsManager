export const toggleFavoriteEvent = async (eventId, likeEvent) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isCurrentlyFavorite = likeEvent.src.includes('like-full.png');
  const method = isCurrentlyFavorite ? 'DELETE' : 'PUT';
  const updatedFavorites = isCurrentlyFavorite
    ? user.favoriteEvents.filter((favEvent) => favEvent._id !== eventId)
    : [...new Set([...user.favoriteEvents, { _id: eventId }])];

  if (!token) {
    console.error('Autenticación incorrecta.');
    return;
  }

  likeEvent.src = isCurrentlyFavorite
    ? '/assets/like-empty.png'
    : '/assets/like-full.png';
  const originalFavorites = [...user.favoriteEvents];

  const updatedUserLocal = { ...user, favoriteEvents: updatedFavorites };
  localStorage.setItem('user', JSON.stringify(updatedUserLocal));

  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/users/${user._id}/favorites/${eventId}`,
      {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      const updatedUserFromServer = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUserFromServer));
      console.log(
        `Evento ${eventId} ${
          isCurrentlyFavorite ? 'eliminado' : 'añadido'
        } de favoritos.`
      );
    } else {
      console.error(
        `Error al ${
          isCurrentlyFavorite ? 'eliminar' : 'añadir'
        } el evento de favoritos.`
      );
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, favoriteEvents: originalFavorites })
      );
      likeEvent.src = isCurrentlyFavorite
        ? '/assets/like-full.png'
        : '/assets/like-empty.png';
    }
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
