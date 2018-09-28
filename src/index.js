import App from './App.html';

const app = new App({
    target: document.getElementById('root'),
    data: {
        name: 'world',
    },
});

window.app = app;

export default app;
