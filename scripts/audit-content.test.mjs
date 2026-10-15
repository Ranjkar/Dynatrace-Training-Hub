// Route & content-completeness audit. Run with `npm test`.
// Verifies the recovered catalogue is fully represented on disk as substantive content,
// matches the mandated 8-course / 108-module inventory, and carries no dependency on the
// original source domain.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS = path.join(ROOT, 'src', 'content', 'docs');
const catalogue = JSON.parse(readFileSync(path.join(ROOT, 'src', 'data', 'catalogue.json'), 'utf-8'));

const EXPECTED_MODULE_COUNTS = {
	'zero-to-hero': 21,
	'dql-cookbook': 10,
	troubleshooting: 8,
	dashboards: 7,
	'sre-finops': 6,
	migration: 25,
	extensions: 16,
	apps: 15,
};

test('catalogue has exactly 8 courses', () => {
	assert.equal(catalogue.courses.length, 8);
});

test('catalogue has exactly 108 modules in total', () => {
	const total = catalogue.courses.reduce(
		(sum, c) => sum + c.tracks.reduce((n, t) => n + t.modules.length, 0),
		0,
	);
	assert.equal(total, 108);
});

test('every course matches its mandated module count', () => {
	for (const course of catalogue.courses) {
		const count = course.tracks.reduce((n, t) => n + t.modules.length, 0);
		assert.equal(
			count,
			EXPECTED_MODULE_COUNTS[course.slug],
			`${course.title} (${course.slug}) expected ${EXPECTED_MODULE_COUNTS[course.slug]}, got ${count}`,
		);
	}
});

test('every module has a corresponding substantive content file', () => {
	for (const course of catalogue.courses) {
		for (const track of course.tracks) {
			for (const mod of track.modules) {
				const filePath = path.join(
					DOCS,
					course.slug,
					track.slug || '',
					`${mod.slug}.md`,
				);
				assert.ok(existsSync(filePath), `missing content file for ${mod.route}`);
				const raw = readFileSync(filePath, 'utf-8');
				const body = raw.replace(/^---[\s\S]*?---/, '').trim();
				assert.ok(
					body.length > 300,
					`${mod.route} looks like a placeholder (${body.length} chars of body)`,
				);
				assert.ok(raw.includes('title:'), `${mod.route} is missing frontmatter title`);
			}
		}
	}
});

test('no module route is duplicated', () => {
	const routes = new Set();
	for (const course of catalogue.courses) {
		for (const track of course.tracks) {
			for (const mod of track.modules) {
				assert.ok(!routes.has(mod.route), `duplicate route: ${mod.route}`);
				routes.add(mod.route);
			}
		}
	}
});

test('no shipped content references the original source domain', () => {
	const files = readdirSync(path.join(ROOT, 'src'), { recursive: true, withFileTypes: true })
		.filter((e) => e.isFile())
		.map((e) => path.join(e.parentPath ?? e.path, e.name));
	for (const file of files) {
		const text = readFileSync(file, 'utf-8');
		assert.ok(!/apmlabs/i.test(text), `${path.relative(ROOT, file)} references the original source domain`);
	}
});
