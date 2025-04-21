import { fetchAPI } from './fetchAPI';

export const updateVisitors = async (eventId, token, assistanceList) => {
  const url = `${
    import.meta.env.VITE_API_BASE_URL
  }/api/v1/events/visitors/${eventId}`;

  try {
    const visitors = await fetchAPI(url, 'GET', null, token);

    const validAssistants = visitors.filter((a) => a && a.email);
    const assistantEmails = validAssistants.map((a) => a.email);

    assistanceList.textContent = assistantEmails.length
      ? `Asistentes: ${assistantEmails.join(', ')}`
      : 'No hay asistentes confirmados.';
  } catch (error) {
    assistanceList.textContent = 'Error al cargar asistentes.';
  }
};
