export default `@charset "UTF-8";
:host {
  font-size: 0;
  display: inline-block; }

.wrapper {
  outline: 0; }
  .wrapper .radio {
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    line-height: 1; }
    .wrapper .radio *,
    .wrapper .radio *:before,
    .wrapper .radio *:after {
      box-sizing: border-box; }
    .wrapper .radio input[type="radio"] {
      opacity: 0;
      position: absolute;
      vertical-align: middle;
      top: 0;
      left: 0;
      width: var(--s-4);
      height: var(--s-4);
      margin: 0; }
  .wrapper .radio-inner {
    /* 动画待定 */
    /* &.mouseDown { */
    /*     transform: scale3d(.7, .7, .7); */
    /*     transition: transform .2s linear; */
    /* } */
    /* &.mouseUp { */
    /*     transform: scale3d(1, 1, 1); */
    /*     transition: transform .2s linear; */
    /* } */
    display: block;
    width: var(--s-4);
    height: var(--s-4);
    background: var(--color-white);
    border-radius: var(--corner-circle);
    border: var(--line-1) solid var(--color-line1-3);
    transition: ease all .36s 0s;
    box-shadow: var(--shadow-zero); }
    .wrapper .radio-inner:after {
      transform: scale(0);
      position: absolute;
      border-radius: var(--corner-circle);
      top: 50%;
      margin-top: calc((var(--s-1) / -2));
      left: 50%;
      margin-left: calc((var(--s-1) / -2));
      background: var(--color-white);
      content: ' ';
      transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86); }
  .wrapper.checked .radio-inner {
    border-color: var(--color-brand1-6);
    background: var(--color-brand1-6); }
    .wrapper.checked .radio-inner:after {
      width: var(--s-1);
      height: var(--s-1);
      font-weight: bold;
      background: var(--color-white);
      transform: scale(1); }
  .wrapper.checked:hover .radio-inner, .wrapper.checked.hovered .radio-inner {
    border-color: var(--color-transparent); }
  .wrapper.disabled input[type="radio"] {
    cursor: not-allowed; }
  .wrapper.disabled .radio-inner {
    border-color: var(--color-line1-1);
    background: var(--color-fill1-1); }
    .wrapper.disabled .radio-inner:hover, .wrapper.disabled .radio-inner.hovered {
      border-color: var(--color-line1-1); }
  .wrapper.disabled.checked .radio-inner:after {
    background: var(--color-text1-1); }
  .wrapper:not(.disabled):hover .radio-inner, .wrapper:not(.disabled).hovered .radio-inner, .wrapper:not(.disabled):focus .radio-inner, .wrapper:not(.disabled).focused .radio-inner {
    border-color: var(--color-brand1-6);
    background-color: var(--color-brand1-1); }
  .wrapper.checked:not(.disabled):hover .radio-inner, .wrapper.checked:not(.disabled).hovered .radio-inner, .wrapper.checked:not(.disabled):focus .radio-inner, .wrapper.checked.focused .radio-inner {
    border-color: var(--color-transparent);
    background: var(--color-brand1-9); }
    .wrapper.checked:not(.disabled):hover .radio-inner:after, .wrapper.checked:not(.disabled).hovered .radio-inner:after, .wrapper.checked:not(.disabled):focus .radio-inner:after, .wrapper.checked.focused .radio-inner:after {
      background: var(--color-white); }

.radio-label {
  margin: 0;
  margin-left: var(--s-1);
  font-size: var(--font-size-body-1);
  vertical-align: middle;
  line-height: 1; }
`