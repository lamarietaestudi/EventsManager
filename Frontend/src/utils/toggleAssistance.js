import { updateAssistToEvents } from './updateAssistToEvents.js';
import { updateVisitors } from './updateVisitors.js';

export const toggleAssistance = async (
  assistanceCheck,
  eventId,
  user,
  token,
  assistanceList
) => {
  assistanceCheck.addEventListener('change', async () => {
    try {
      await updateAssistToEvents(assistanceCheck, eventId, user, token);
      await updateVisitors(eventId, token, assistanceList);
    } catch (error) {
      assistanceCheck.checked = !assistanceCheck.checked;
    }
  });
};
