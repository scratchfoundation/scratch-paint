/**
 * Drop `data-paper-data` attributes whose value isn't valid JSON. Paper.js
 * synchronously calls JSON.parse on this attribute during importSVG and
 * throws on malformed values, taking down the whole import. The attribute
 * is paper's own serialization metadata; if it can't parse, paper wouldn't
 * have been able to use it.
 * @param {string} svgString - SVG markup.
 * @returns {string} markup with invalid data-paper-data attributes removed.
 */
const stripInvalidPaperData = function (svgString) {
    if (!svgString.includes('data-paper-data')) return svgString;
    const doc = new DOMParser().parseFromString(svgString, 'text/xml');
    let modified = false;
    const els = doc.querySelectorAll('[data-paper-data]');
    for (let i = 0; i < els.length; i++) {
        try {
            JSON.parse(els[i].getAttribute('data-paper-data'));
        } catch {
            els[i].removeAttribute('data-paper-data');
            modified = true;
        }
    }
    if (!modified) return svgString;
    return new XMLSerializer().serializeToString(doc);
};

export {stripInvalidPaperData};
