import { Router } from '@vaadin/router';

export function initRouter(root) {
	const router = new Router(root);
	router.setRoutes([
		{ path: '/', component: 'home-page' },
		{ path: '/verify-email', component: 'verify-email' },
		{ path: '/my-data', component: 'my-data' },
	]);
}
