// Client-side lesson progress tracking. Pure localStorage, no dependencies.
(function () {
	'use strict';
	var STORE_KEY = 'dt-hub-progress';

	function load() {
		try {
			return new Set(JSON.parse(localStorage.getItem(STORE_KEY) || '[]'));
		} catch (e) {
			return new Set();
		}
	}

	function save(set) {
		try {
			localStorage.setItem(STORE_KEY, JSON.stringify(Array.from(set)));
		} catch (e) {
			/* storage unavailable (private mode, quota) — fail silently */
		}
	}

	function renderDots(done) {
		document.querySelectorAll('.progress-dot[data-progress-key]').forEach(function (dot) {
			var key = dot.getAttribute('data-progress-key');
			dot.textContent = done.has(key) ? '✅' : '⬜';
		});
	}

	function renderCourseCounters(done) {
		document.querySelectorAll('.course-progress[data-course-slug]').forEach(function (el) {
			var course = el.getAttribute('data-course-slug');
			var total = parseInt(el.getAttribute('data-total'), 10) || 0;
			var completed = 0;
			done.forEach(function (key) {
				if (key.indexOf(course + '__') === 0) completed++;
			});
			el.textContent = completed + ' / ' + total + ' modules complete';
		});
	}

	function renderLessonToggle(done) {
		var meta = document.querySelector('.lesson-meta[data-progress-key]');
		if (!meta) return;
		var key = meta.getAttribute('data-progress-key');

		var wrapper = document.createElement('div');
		wrapper.className = 'lesson-progress';

		var checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = 'lesson-complete-toggle';
		checkbox.checked = done.has(key);

		var label = document.createElement('label');
		label.setAttribute('for', 'lesson-complete-toggle');
		label.textContent = 'Mark this lesson complete';

		var status = document.createElement('span');
		status.setAttribute('role', 'status');
		status.className = 'sr-only-status';

		checkbox.addEventListener('change', function () {
			var current = load();
			if (checkbox.checked) {
				current.add(key);
				status.textContent = 'Lesson marked complete.';
			} else {
				current.delete(key);
				status.textContent = 'Lesson marked incomplete.';
			}
			save(current);
			renderDots(current);
			renderCourseCounters(current);
		});

		wrapper.appendChild(checkbox);
		wrapper.appendChild(label);
		wrapper.appendChild(status);
		meta.insertAdjacentElement('afterend', wrapper);
	}

	function init() {
		var done = load();
		renderLessonToggle(done);
		renderDots(done);
		renderCourseCounters(done);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
	// Starlight uses client-side view transitions between pages.
	document.addEventListener('astro:page-load', init);
})();
