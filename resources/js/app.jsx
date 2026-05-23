import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route as ziggyRoute } from 'ziggy-js';
import { Ziggy } from './ziggy';

const ziggyConfig = Object.assign({}, Ziggy, window.Ziggy ?? {});

window.Ziggy = ziggyConfig;
globalThis.Ziggy = ziggyConfig;

window.route = (name, params, absolute, config) =>
    ziggyRoute(name, params, absolute ?? true, config ?? ziggyConfig);

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#e84393',
    },
});
