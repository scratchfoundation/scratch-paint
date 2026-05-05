/* eslint-env jest */
/**
 * Regression coverage for the SVG sanitization step that paper-canvas.jsx's
 * `importSvg` runs before `paper.project.importSVG`. Paper.js calls into
 * `appendChild` during SVG import, which fires execution paths on
 * `<foreignObject>`, event-handler attributes, and similar — features that
 * the published scratch-paint XSS PoC (https://muffin.ink/blog/paperjs-xss/)
 * relies on. `sanitizeSvg.sanitizeSvgText` uses DOMPurify's SVG profile,
 * which strips them.
 *
 * These tests exercise sanitizeSvgText directly against the disclosed PoC
 * shapes. The wire-up itself (the `sanitizeSvg.sanitizeSvgText(svg)` call
 * in `importSvg`) is read off the diff.
 */

import {sanitizeSvg} from '@scratch/scratch-svg-renderer';

const wrap = body =>
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">${body}</svg>`;

describe('sanitizeSvgText neutralizes the published paper.js SVG XSS payloads', () => {
    test('strips <foreignObject> with <img onerror>', () => {
        const hostile = wrap(
            '<foreignObject width="10" height="10">' +
            '<img src="data:image/png;base64,nope" onerror="alert(\'xss\')"/>' +
            '</foreignObject>' +
            '<circle r="5"/>'
        );
        const sanitized = sanitizeSvg.sanitizeSvgText(hostile);
        expect(sanitized).not.toMatch(/<foreignObject/i);
        expect(sanitized).not.toMatch(/onerror/i);
        expect(sanitized).not.toMatch(/<img/i);
    });

    test('strips event-handler attributes on the <svg> root', () => {
        const hostile =
            '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)" viewBox="0 0 10 10">' +
            '<circle r="5"/>' +
            '</svg>';
        const sanitized = sanitizeSvg.sanitizeSvgText(hostile);
        expect(sanitized).not.toMatch(/onload/i);
    });

    test('strips event-handler attributes on a child element', () => {
        const sanitized = sanitizeSvg.sanitizeSvgText(
            wrap('<rect width="10" height="10" onclick="alert(1)"/>')
        );
        expect(sanitized).not.toMatch(/onclick/i);
    });

    test('strips <script> elements', () => {
        const sanitized = sanitizeSvg.sanitizeSvgText(
            wrap('<script>alert(1)</script><circle r="5"/>')
        );
        expect(sanitized).not.toMatch(/<script/i);
        expect(sanitized).not.toMatch(/alert\(/);
    });

    test('preserves legitimate shape content', () => {
        // Smoke check: a plain costume body should survive sanitization
        // intact enough to render — not stripped to an empty <svg>.
        const sanitized = sanitizeSvg.sanitizeSvgText(
            wrap('<g id="costume"><circle cx="50" cy="50" r="20" fill="red"/></g>')
        );
        expect(sanitized).toMatch(/<circle/i);
        expect(sanitized).toMatch(/r="20"/);
        expect(sanitized).toMatch(/fill="red"/);
    });
});
