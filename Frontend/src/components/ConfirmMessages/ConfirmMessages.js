import './ConfirmMessages.css';

export const ConfirmMessage = (type, text) => {
  let message = document.createElement('p');
  message.classList.add('confirm-message', 'disabled');
  message.textContent = text;
  setTimeout(() => {
    message.classList.remove('disabled');
    message.classList.add(`confirm-message-${type}`);
  }, 0);
  if (type === 'success') {
    setTimeout(() => {
      message.classList.add('disabled');
    }, 5000);
  }

  return message;
};
