import * as ReactDOMClient from 'react-dom/client';

import App from './App';

const rootElement = document.getElementById('asteroids');

if (!!rootElement) {
    const root = ReactDOMClient.createRoot(rootElement);
    root.render(<App />);
}
