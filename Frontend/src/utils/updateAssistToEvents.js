import { fetchAPI } from './fetchAPI';

export const updateAssistToEvents = async (
  assistanceCheck,
  eventId,
  user,
  token
) => {
  const method = assistanceCheck.checked ? 'PUT' : 'DELETE';
  const url = `http://localhost:3000/api/v1/users/${
    assistanceCheck.checked
      ? `confirm-assistance/${user._id}/${eventId}`
      : `cancel-assistance/${user._id}/${eventId}`
  }`;

  try {
    await fetchAPI(url, method, null, token);

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
    assistanceCheck.checked = !assistanceCheck.checked;
  }
};
