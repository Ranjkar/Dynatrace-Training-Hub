// @ts-check
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const catalogue = JSON.parse(
	readFileSync(fileURLToPath(new URL('./src/data/catalogue.json', import.meta.url)), 'utf-8'),
);

/** Build the Starlight sidebar directly from the recovered course catalogue. */
function buildSidebar() {
	return catalogue.courses.map((/** @type {any} */ course) => {
		if (course.tracks.length === 1) {
			// Single-track course: flatten, no nested track group. overview.md (sidebar.order: -1)
			// already lives in this directory, so autogenerate alone covers it — no duplicate entry.
			return {
				label: course.title,
				items: [{ autogenerate: { directory: course.slug } }],
			};
		}
		return {
			label: course.title,
			items: [
				{ label: 'Overview', slug: `${course.slug}/overview` },
				...course.tracks.map((/** @type {any} */ track) => ({
					label: track.title,
					collapsed: true,
					items: [{ autogenerate: { directory: `${course.slug}/${track.slug}` } }],
				})),
			],
		};
	});
}

const site = 'https://ranjkar.github.io';
const base = '/Dynatrace-Training-Hub';

// https://astro.build/config
export default defineConfig({
	site,
	base,
	integrations: [
		starlight({
			title: 'Dynatrace Training Hub',
			description:
				'8 courses, 108 modules: DQL, troubleshooting, dashboards, SRE & FinOps, Gen3 migration, Extensions 2.0, and Dynatrace Apps.',
			favicon: '/favicon.svg',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Ranjkar/Dynatrace-Training-Hub' },
			],
			editLink: {
				baseUrl: 'https://github.com/Ranjkar/Dynatrace-Training-Hub/edit/main/',
			},
			customCss: ['./src/styles/custom.css'],
			head: [{ tag: 'script', attrs: { src: `${base}/progress.js`, defer: true } }],
			expressiveCode: {
				shiki: {
					langAlias: { dql: 'sql' },
				},
			},
			sidebar: buildSidebar(),
		}),
	],
});
