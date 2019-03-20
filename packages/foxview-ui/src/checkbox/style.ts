export default `@charset "UTF-8";
/* stylelint-disable max-nesting-depth */
:host {
  font-size: 0;
  display: inline-block; }

.wrapper {
  box-sizing: border-box; }
  .wrapper *,
  .wrapper *:before,
  .wrapper *:after {
    box-sizing: border-box; }
  .wrapper .checkbox {
    display: inline-block;
    position: relative;
    line-height: 1;
    vertical-align: middle; }
  .wrapper input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: var(--s-4);
    height: var(--s-4);
    margin: 0; }
  .wrapper .checkbox-inner {
    display: block;
    width: var(--s-4);
    height: var(--s-4);
    background: var(--color-white);
    border-radius: var(--corner-1);
    border: var(--line-1) solid var(--color-line1-3);
    transition: ease all .3s 0s;
    text-align: left;
    /* 防止继承父级 */
    box-shadow: var(--shadow-zero); }
    .wrapper .checkbox-inner:after {
      opacity: 0;
      transition: opacity .3s; }
  .wrapper.checked .checkbox-inner {
    border-color: var(--color-transparent);
    background-color: var(--color-brand1-6); }
    .wrapper.checked .checkbox-inner:hover, .wrapper.checked .checkbox-inner.hovered {
      border-color: var(--color-transparent); }
    .wrapper.checked .checkbox-inner:after {
      opacity: 1;
      box-sizing: content-box;
      border: var(--line-1) solid var(--color-white);
      border-left: 0;
      border-top: 0;
      height: calc(var(--s-4) / 2);
      left: 50%;
      position: absolute;
      top: 50%;
      transform: rotate(45deg) translate3d(-50%, -50%, 0);
      width: calc(var(--s-4) / 5);
      transform-origin: top;
      content: ""; }
  .wrapper.indeterminate .checkbox-inner {
    border-color: var(--color-transparent);
    background-color: var(--color-brand1-6); }
    .wrapper.indeterminate .checkbox-inner:hover, .wrapper.indeterminate .checkbox-inner.hovered {
      border-color: var(--color-transparent); }
    .wrapper.indeterminate .checkbox-inner:after {
      border: none;
      height: var(--line-1);
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      background-color: var(--color-white);
      width: calc(var(--s-4) / 3);
      opacity: 1;
      content: ''; }
  .wrapper.disabled input[type="checkbox"] {
    cursor: not-allowed; }
  .wrapper.disabled .checkbox-inner {
    border-color: var(--color-line1-1);
    background: var(--color-fill1-1); }
  .wrapper.disabled.checked .checkbox-inner:hover, .wrapper.disabled.checked .checkbox-inner.hovered, .wrapper.disabled.indeterminate .checkbox-inner:hover, .wrapper.disabled.indeterminate .checkbox-inner.hovered {
    border-color: var(--color-line1-1); }
  .wrapper.disabled.checked .checkbox-inner:after, .wrapper.disabled.indeterminate .checkbox-inner:after {
    opacity: 1; }
  .wrapper:not(.disabled):hover .checkbox-inner, .wrapper.hovered .checkbox-inner, .wrapper.focused .checkbox-inner {
    border-color: var(--color-brand1-6);
    background-color: var(--color-brand1-1); }
  .wrapper.indeterminate:not(.disabled):hover .checkbox-inner, .wrapper.indeterminate:not(.disabled).hovered .checkbox-inner, .wrapper.indeterminate.focused .checkbox-inner, .wrapper.checked:not(.disabled):hover .checkbox-inner, .wrapper.checked:not(.disabled).hovered .checkbox-inner, .wrapper.checked.focused .checkbox-inner {
    border-color: var(--color-transparent);
    background-color: var(--color-brand1-9); }
    .wrapper.indeterminate:not(.disabled):hover .checkbox-inner:after, .wrapper.indeterminate:not(.disabled).hovered .checkbox-inner:after, .wrapper.indeterminate.focused .checkbox-inner:after, .wrapper.checked:not(.disabled):hover .checkbox-inner:after, .wrapper.checked:not(.disabled).hovered .checkbox-inner:after, .wrapper.checked.focused .checkbox-inner:after {
      opacity: 1; }

.checkbox-group .checkbox-wrapper {
  margin-left: 8px; }
  .checkbox-group .checkbox-wrapper:first-child {
    margin-left: 0; }

.checkbox-group-ver .checkbox-wrapper {
  display: block;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 8px; }

.checkbox-label {
  font-size: var(--font-size-body-1);
  vertical-align: middle;
  margin: 0;
  margin-left: var(--s-1);
  line-height: 1; }
`