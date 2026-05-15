/**
 * Build the script string that runs inside a sandboxed iframe to perform
 * Paper.js SVG import and JSON export.
 *
 * The returned script evaluates Paper.js inside the iframe, sets up a
 * project with a canvas, and defines `window.onSandboxMessage` to handle
 * SVG import requests. The entire `paper.project.importSVG` call — which
 * appends parsed SVG nodes into the iframe's DOM — executes within the
 * iframe's opaque origin. Any code execution triggered by DOM insertion
 * (the attack vector described in the paperjs-xss analysis) is contained
 * to the sandboxed context and cannot reach the parent origin.
 *
 * @param {string} paperJsSource The full source text of Paper.js
 *     (e.g. the contents of `@scratch/paper/dist/paper-full.min.js`).
 *     The source is evaluated inside the iframe via indirect eval.
 * @returns {string} Script source to pass to `new Sandbox(script)`.
 */
const createPaperImportScript = paperJsSource => {
    const paperSourceLiteral = JSON.stringify(paperJsSource);

    // The script is eval'd inside the sandboxed iframe. It must use only
    // ES5-compatible syntax (no arrow functions, no const/let in loops)
    // for maximum browser compatibility, since the iframe runs whatever
    // the browser ships natively — no transpilation.
    return `(function () {
    // Evaluate Paper.js; it declares a global 'paper' variable via its
    // UMD wrapper: var paper = function(...){...}.call(this, ...)
    (0, eval)(${paperSourceLiteral});

    // Create a canvas for Paper.js to operate on. Paper needs a canvas
    // to set up its project and coordinate system, even though we only
    // use the SVG import/JSON export — not any visual rendering.
    var canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    document.body.appendChild(canvas);
    paper.setup(canvas);

    window.onSandboxMessage = function (payload) {
        var svg = payload.svg;

        // Clear previous project state so successive imports don't
        // accumulate items from prior calls.
        paper.project.clear();

        // Extract viewBox from the SVG DOM.
        var viewBox = null;
        var parser = new DOMParser();
        var doc = parser.parseFromString(svg, 'image/svg+xml');
        var svgEl = doc.documentElement;
        var viewBoxAttr = svgEl.getAttribute('viewBox');
        if (viewBoxAttr) {
            var parts = viewBoxAttr.match(/\\S+/g);
            if (parts) {
                viewBox = [];
                for (var i = 0; i < parts.length; i++) {
                    viewBox.push(parseFloat(parts[i]));
                }
            }
        }

        // importSVG parses the SVG via DOMParser and then appends the
        // parsed node into document.body during processing. This is the
        // operation that must run inside the sandbox — any code execution
        // triggered by DOM insertion is contained to the opaque origin.
        //
        // We use the onLoad callback to wait for embedded raster images
        // (base64 data URIs in <image> elements) to finish loading before
        // exporting JSON.
        return new Promise(function (resolve, reject) {
            paper.project.importSVG(svg, {
                expandShapes: true,
                onLoad: function (imported) {
                    if (!imported) {
                        reject(new Error('SVG import failed'));
                        return;
                    }

                    // Export just the imported item's JSON (not the whole
                    // project). The parent will use activeLayer.importJSON()
                    // to re-create this single item.
                    var paperJSON = imported.exportJSON({asString: true});

                    resolve({paperJSON: paperJSON, viewBox: viewBox});
                },
                onError: function (message) {
                    reject(new Error('SVG import error: ' + message));
                }
            });
        });
    };
})();`;
};

export {createPaperImportScript};
