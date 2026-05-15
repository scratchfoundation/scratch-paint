/* eslint-env jest */
/**
 * Regression coverage for the SVG sanitization step that paper-canvas.jsx's
 * `importSvg` runs before sending the SVG to the sandboxed iframe.
 * Paper.js's import path appends parsed SVG nodes into the document during
 * processing, which fires execution paths on `<foreignObject>`, event-handler
 * attributes, and similar features. The sanitize step (DOMPurify's SVG
 * profile) strips those shapes before the SVG reaches the iframe.
 *
 * Two layers of coverage: sanitizer-level assertions on hostile and
 * legitimate inputs, plus an integration assertion that `importSvg`
 * actually routes its input through the sanitizer before handing it to
 * the sandbox.
 */

import paper from '@scratch/paper';
import {sanitizeSvg} from '@scratch/scratch-svg-renderer';

import PaperCanvasConnected from '../../src/containers/paper-canvas';

const PaperCanvas = PaperCanvasConnected.WrappedComponent;

// Mock the paper-sandbox module to capture what gets sent to the sandbox.
// getPaperSandbox() now returns a Promise<Sandbox>. The send mock returns
// a never-resolving promise so the .then() chain doesn't execute (we only
// need to assert on the input sent to the sandbox, not the full import
// pipeline which requires layers, undo, etc.)
jest.mock('../../src/helper/paper-sandbox', () => {
    const sendMock = jest.fn(() => new Promise(() => {}));
    return {
        getPaperSandbox: () => Promise.resolve({send: sendMock}),
        __sendMock: sendMock
    };
});

const {__sendMock: sandboxSendMock} = require('../../src/helper/paper-sandbox');

const wrap = body =>
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">${body}</svg>`;

describe('sanitizeSvgText strips dangerous SVG shapes', () => {
    test('removes <foreignObject> with <img onerror>', () => {
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

    test('removes event-handler attributes on the <svg> root', () => {
        const hostile =
            '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)" viewBox="0 0 10 10">' +
            '<circle r="5"/>' +
            '</svg>';
        const sanitized = sanitizeSvg.sanitizeSvgText(hostile);
        expect(sanitized).not.toMatch(/onload/i);
    });

    test('removes event-handler attributes on a child element', () => {
        const sanitized = sanitizeSvg.sanitizeSvgText(
            wrap('<rect width="10" height="10" onclick="alert(1)"/>')
        );
        expect(sanitized).not.toMatch(/onclick/i);
    });

    test('removes <script> elements', () => {
        const sanitized = sanitizeSvg.sanitizeSvgText(
            wrap('<script>alert(1)</script><circle r="5"/>')
        );
        expect(sanitized).not.toMatch(/<script/i);
        expect(sanitized).not.toMatch(/alert\(/);
    });

    test('preserves legitimate shape content', () => {
        // Smoke check: a plain costume body should survive sanitization
        // intact enough to render — not stripped to an empty <svg>. Assert
        // through a parsed DOM so attribute serialization changes in the
        // sanitizer (quoting, whitespace, attribute order) don't make this
        // test flaky.
        const sanitized = sanitizeSvg.sanitizeSvgText(
            wrap('<g id="costume"><circle cx="50" cy="50" r="20" fill="red"/></g>')
        );
        const doc = new DOMParser().parseFromString(sanitized, 'image/svg+xml');
        const circle = doc.querySelector('circle');
        expect(circle).not.toBeNull();
        expect(circle.getAttribute('r')).toBe('20');
        expect(circle.getAttribute('fill')).toBe('red');
        expect(circle.getAttribute('cx')).toBe('50');
        expect(circle.getAttribute('cy')).toBe('50');
    });
});

describe('PaperCanvas.importSvg routes sanitized input to the sandbox', () => {
    let sanitizeSpy;

    beforeEach(() => {
        const canvas = document.createElement('canvas');
        paper.setup(canvas);
        sanitizeSpy = jest.spyOn(sanitizeSvg, 'sanitizeSvgText');
        sandboxSendMock.mockClear();
    });

    afterEach(() => {
        sanitizeSpy.mockRestore();
        while (paper.projects.length > 0) {
            paper.projects[paper.projects.length - 1].remove();
        }
    });

    const makeFakeThis = () => ({
        _importGeneration: 0,
        props: {changeFormat: jest.fn(), undoSnapshot: jest.fn(), updateViewBounds: jest.fn()},
        recalibrateSize: jest.fn(),
        queuedImport: null
    });

    test('sandbox receives input that has been through sanitizeSvgText', async () => {
        const fakeThis = makeFakeThis();
        const hostile =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">' +
            '<foreignObject width="10" height="10">' +
            '<img src="data:image/png;base64,nope" onerror="alert(\'xss\')"/>' +
            '</foreignObject>' +
            '<rect width="5" height="5" onclick="alert(1)"/>' +
            '</svg>';

        PaperCanvas.prototype.importSvg.call(fakeThis, hostile, 0, 0);

        // getPaperSandbox() returns a resolved Promise, so sandbox.send()
        // is called in a microtask. Flush it before asserting.
        await Promise.resolve();

        expect(sanitizeSpy).toHaveBeenCalledTimes(1);
        expect(sandboxSendMock).toHaveBeenCalledTimes(1);
        const svgSentToSandbox = sandboxSendMock.mock.calls[0][0].svg;
        expect(svgSentToSandbox).not.toMatch(/<foreignObject/i);
        expect(svgSentToSandbox).not.toMatch(/onerror/i);
        expect(svgSentToSandbox).not.toMatch(/onclick/i);
        expect(svgSentToSandbox).not.toMatch(/<img/i);
    });
});
