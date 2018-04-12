import keyMirror from 'keymirror';

const Modes = keyMirror({
    BRUSH: null,
    ERASER: null,
    LINE: null,
    FILL: null,
    SELECT: null,
    RESHAPE: null,
    OVAL: null,
    RECT: null,
    ROUNDED_RECT: null,
    TEXT: null
});

const ModeClasses = {
};
ModeClasses[Modes.FILL] = 'fill-mode';

export {
    Modes as default,
    ModeClasses
};
