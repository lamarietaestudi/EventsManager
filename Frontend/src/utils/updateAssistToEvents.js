export const updateAssistToEvents = async (
  assistanceCheck,
  eventId,
  user,
  token
) => {
  const previousState = assistanceCheck.checked;
  const method = assistanceCheck.checked ? 'PUT' : 'DELETE';

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
      throw new Error('Error al actualizar assistToEvents');
    }

    const updatedAssistToEvents = assistanceCheck.checked
      ? [...user.assistToEvents, eventId.toString()].filter(
          (id, index, self) => self.indexOf(id) === index
        )
      : user.assistToEvents.filter((id) => id !== eventId.toString());

    localStorage.setItem(
      'user',
      JSON.stringify({ ...user, assistToEvents: updatedAssistToEvents })
    );
  } catch (error) {
    console.error('Error en updateAssistToEvents:', error);
    assistanceCheck.checked = previousState;
  }
};
