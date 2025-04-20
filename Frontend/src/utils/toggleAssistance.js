export const toggleAssistance = async (
  assistanceCheck,
  eventId,
  user,
  token,
  assistToEvents,
  assistanceList
) => {
  assistanceCheck.addEventListener('change', async () => {
    const previousState = assistanceCheck.checked;
    const method = assistanceCheck.checked ? 'PUT' : 'DELETE';

    const originalAssistToEvents = [...assistToEvents];
    if (assistanceCheck.checked) {
      assistToEvents.push(eventId.toString());
    } else {
      assistToEvents = assistToEvents.filter((id) => id !== eventId.toString());
    }
    localStorage.setItem('user', JSON.stringify({ ...user, assistToEvents }));

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/users/${
          assistanceCheck.checked
            ? `confirm-assistance/${user._id}/${eventId}`
            : `cancel-assistance/${user._id}/${eventId}`
        }`,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        throw new Error('Error en la solicitud');
      }

      updateAssistants(eventId, token, user, assistToEvents, assistanceList);
    } catch (error) {
      console.error('Error en toggleAssistance:', error);

      assistanceCheck.checked = previousState;
      assistToEvents = originalAssistToEvents;
      localStorage.setItem('user', JSON.stringify({ ...user, assistToEvents }));
    }
  });
};
