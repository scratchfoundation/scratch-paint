webpackJsonp([0],{

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _paintEditor = __webpack_require__(83);

var _paintEditor2 = _interopRequireDefault(_paintEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _paintEditor2.default;

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(25);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PaintEditorComponent = function (_React$Component) {
    _inherits(PaintEditorComponent, _React$Component);

    function PaintEditorComponent() {
        _classCallCheck(this, PaintEditorComponent);

        return _possibleConstructorReturn(this, (PaintEditorComponent.__proto__ || Object.getPrototypeOf(PaintEditorComponent)).apply(this, arguments));
    }

    _createClass(PaintEditorComponent, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "paint-editor" },
                "BANANAS"
            );
        }
    }]);

    return PaintEditorComponent;
}(_react2.default.Component);

exports.default = PaintEditorComponent;


PaintEditorComponent.defaultProps = {};

/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(25);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(33);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ = __webpack_require__(82);

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appTarget = document.createElement('div');
document.body.appendChild(appTarget);
_reactDom2.default.render(_react2.default.createElement(_2.default, null), appTarget);

/***/ })

},[84]);
//# sourceMappingURL=playground.js.map