import keyMirror from 'keymirror';

const Formats = keyMirror({
    BITMAP: null,
    VECTOR: null,
    // Undo formats are conversions caused by the undo/redo stack
    UNDO_BITMAP: null,
    UNDO_VECTOR: null
});

const isVector = function (format) {
    return format === Formats.VECTOR || format === Formats.UNDO_VECTOR;
};

const isBitmap = function (format) {
    return format === Formats.BITMAP || format === Formats.UNDO_BITMAP;
};

export {
    Formats as default,
    isVector,
    isBitmap
};
