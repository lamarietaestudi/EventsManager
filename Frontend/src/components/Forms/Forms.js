import './Forms.css';

export function createForm(fields) {
  const form = document.createElement('form');
  form.classList.add('form');

  fields.forEach((field) => {
    const label = document.createElement('label');
    label.textContent = field.label;
    label.setAttribute('for', field.name);
    label.classList.add('form-label');

    const input = document.createElement('input');
    input.type = field.type || 'text';
    input.name = field.name;
    input.id = field.name;
    input.placeholder = field.placeholder || '';
    input.required = field.required || false;
    input.disabled = field.disabled || false;
    if (field.value) {
      input.value = field.value;
    }
    input.classList.add('form-input');

    form.append(label, input);
  });

  return form;
}
