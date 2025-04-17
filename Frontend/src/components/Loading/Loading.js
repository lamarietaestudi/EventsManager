import './Loading.css';
export const Loading = (main) => {
  const loader = document.createElement('div');
  loader.classList.add('loading-message');
  loader.textContent = 'Cargando...';
  main.prepend(loader);

  return () => {
    loader.remove();
  };
};
