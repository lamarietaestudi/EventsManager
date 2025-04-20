export const updateAssistants = async (
  eventId,
  token,
  user,
  assistToEvents,
  assistanceList
) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/events/visitors/${eventId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!res.ok) {
      throw new Error('Error al obtener asistentes');
    }

    const visitors = await res.json();

    if (!Array.isArray(visitors)) {
      throw new Error('El formato de los datos no es válido');
    }

    const validAssistants = visitors.filter((a) => a && a.email);
    const assistantEmails = validAssistants.map((a) => a.email);

    assistanceList.textContent = assistantEmails.length
      ? `Asistentes: ${assistantEmails.join(', ')}`
      : 'No hay asistentes confirmados.';
  } catch (error) {
    assistanceList.textContent = 'Error al cargar asistentes.';
    console.error('Error en updateAssistants:', error);
  }
};
