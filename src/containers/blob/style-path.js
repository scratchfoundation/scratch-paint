const stylePath = function (path, options) {
    if (options.isEraser) {
        path.fillColor = 'white';
    } else {
        // TODO: Add back brush styling. Keep a separate active toolbar style for brush vs pen.
        // path = pg.stylebar.applyActiveToolbarStyle(path);
        path.fillColor = options.fillColor;
    }
};

const styleCursorPreview = function (path, options) {
    if (options.isEraser) {
        path.fillColor = 'white';
        path.strokeColor = 'cornflowerblue';
        path.strokeWidth = 1;
    } else {
        // TODO: Add back brush styling. Keep a separate active toolbar style for brush vs pen.
        // path = pg.stylebar.applyActiveToolbarStyle(path);
        path.fillColor = options.fillColor;
        path.strokeColor = 'cornflowerblue';
        path.strokeWidth = 1;
    }
};

export {
    stylePath,
    styleCursorPreview
};
