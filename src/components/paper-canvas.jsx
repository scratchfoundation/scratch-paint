import React from 'react';
import paper from 'paper';

class PaperCanvas extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount () {
        paper.setup('paper-canvas');
        // Create a Paper.js Path to draw a line into it:
        var path = new paper.Path();
        // Give the stroke a color
        path.strokeColor = 'black';
        var start = new paper.Point(100, 100);
        // Move to start and draw a line from there
        path.moveTo(start);
        // Note that the plus operator on Point objects does not work
        // in JavaScript. Instead, we need to call the add() function:
        path.lineTo(start.add([200, -50]));
        // Draw the view now:
        paper.view.draw();
    }
    componentWillUnmount () {
    }
    render () {
        return (
            <canvas id="paper-canvas" />
        );
    }
}

PaperCanvas.propTypes = {};

module.exports = PaperCanvas;
