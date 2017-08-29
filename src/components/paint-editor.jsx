import bindAll from 'lodash.bindall';
import React from 'react';
import PaperCanvas from '../containers/paper-canvas.jsx';
import BrushMode from '../containers/brush-mode.jsx';
import EraserMode from '../containers/eraser-mode.jsx';

import styles from './paint-editor.css';

class PaintEditorComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setCanvas'
        ]);
        this.state = {};
    }
    setCanvas (canvas) {
        this.setState({canvas: canvas});
    }
    render () {
        return (
            <div className={styles.editorContainer}>
                {/* First row */}
                <div className={styles.row}>
                    {/* Name field */}
                    <div className={styles.inputGroup}>
                        {/* Todo use Label and BufferedInput from Gui */}
                        <label>Costume
                            <input value="meow"/>
                        </label>
                    </div>

                    {/* Undo/Redo */}
                    <div className={styles.inputGroup}>
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.button}
                            >
                                Undo
                            </button>
                            <button
                                className={styles.button}
                            >
                                Redo
                            </button>
                        </div>
                    </div>

                    {/* To be Front/back */}
                    <div className={styles.inputGroup}>
                        <button
                            className={styles.button}
                        >
                            Front
                        </button>
                        <button
                            className={styles.button}
                        >
                            Back
                        </button>
                    </div>

                    {/* To be Group/Ungroup */}
                    <div className={styles.inputGroup}>
                        <button
                            className={styles.button}
                        >
                            Group
                        </button>
                        <button
                            className={styles.button}
                        >
                            Ungroup
                        </button>
                    </div>
                </div>

                {/* Second Row */}
                <div className={styles.row}>
                    {/* To be fill */}
                    <div className={styles.inputGroup}>
                        <button
                            className={styles.button}
                        >
                            Fill
                        </button>
                    </div>
                    {/* To be stroke */}
                    <div className={styles.inputGroup}>
                        <button
                            className={styles.button}
                        >
                            Stroke
                        </button>
                    </div>

                    <div className={styles.inputGroup}>
                        Mode tools
                    </div>
                </div>

                <div className={styles.row}>
                    {/* Modes */}
                    {this.state.canvas ? (
                        <div className={styles.modeSelector}>
                            <BrushMode canvas={this.state.canvas} />
                            <EraserMode canvas={this.state.canvas} />
                        </div>
                    ) : null}

                    {/* Canvas */}
                    <div className={styles.canvasContainer}>
                        <PaperCanvas canvasRef={this.setCanvas} />
                    </div>
                </div>
            </div>
        );
    }
}

export default PaintEditorComponent;
