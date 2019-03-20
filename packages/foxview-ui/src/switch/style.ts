export default `:host {
  font-size: 0;
  display: inline-block; }

.switch {
  box-sizing: border-box;
  outline: none;
  text-align: left;
  transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  overflow: hidden;
  cursor: pointer; }
  .switch *,
  .switch *:before,
  .switch *:after {
    box-sizing: border-box; }
  .switch:after {
    content: " ";
    transition: all 0.4s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    transform-origin: left center; }
  .switch-medium {
    position: relative;
    display: inline-block;
    border: var(--line-1) solid transparent;
    width: var(--s-14);
    height: calc(var(--s-6) + var(--line-1) * 2);
    border-radius: var(--corner-3); }
    .switch-medium:after {
      border: var(--line-1) solid transparent;
      position: absolute;
      left: 100%;
      transform: translateX(-100%);
      width: var(--s-6);
      height: var(--s-6);
      border-radius: var(--corner-3);
      box-sizing: border-box; }
    .switch-medium > .switch-children {
      font-size: var(--font-size-body-1);
      position: absolute;
      height: var(--s-6);
      line-height: var(--s-6); }
  .switch-small {
    position: relative;
    display: inline-block;
    border: var(--line-1) solid transparent;
    width: var(--s-11);
    height: calc(var(--s-5) + var(--line-1) * 2);
    border-radius: var(--corner-3); }
    .switch-small:after {
      border: var(--line-1) solid transparent;
      position: absolute;
      left: 100%;
      transform: translateX(-100%);
      width: var(--s-5);
      height: var(--s-5);
      border-radius: var(--corner-3);
      box-sizing: border-box; }
    .switch-small > .switch-children {
      font-size: var(--font-size-body-1);
      position: absolute;
      height: var(--s-5);
      line-height: var(--s-5); }
  .switch-on {
    background-color: var(--color-brand1-6); }
    .switch-on:after {
      box-shadow: var(--shadow-1);
      background-color: var(--color-white);
      border-color: var(--color-transparent); }
    .switch-on > .switch-children {
      left: calc(var(--s-2) + var(--line-1) * 2);
      color: var(--color-white); }
    .switch-on:focus, .switch-on:hover {
      background-color: var(--color-brand1-9); }
      .switch-on:focus:after, .switch-on:hover:after {
        background-color: var(--color-white); }
  .switch-on.switch-small > .switch-children {
    left: calc(var(--s-1) + var(--line-1) * 2); }
  .switch-on[disabled] {
    background-color: var(--color-fill1-3);
    cursor: not-allowed; }
    .switch-on[disabled]:after {
      right: 0;
      box-shadow: var(--shadow-1);
      background-color: var(--color-fill1-1);
      border-color: var(--color-line1-1); }
    .switch-on[disabled] > .switch-children {
      color: var(--color-text1-1); }
  .switch-off {
    background-color: var(--color-white);
    border-color: var(--color-line1-3); }
    .switch-off:focus, .switch-off:hover {
      background-color: var(--color-fill1-2);
      border-color: var(--color-line1-3); }
    .switch-off:after {
      left: 0;
      transform: translateX(0);
      box-shadow: var(--shadow-1);
      background-color: var(--color-white);
      border-color: var(--color-transparent); }
      .switch-off:after:focus, .switch-off:after:hover {
        background-color: var(--color-white); }
    .switch-off > .switch-children {
      right: calc(var(--s-2) + var(--line-1) * 2);
      color: var(--color-text1-2); }
  .switch-off[disabled] {
    background-color: var(--color-fill1-1);
    border: 1px solid transparent;
    cursor: not-allowed; }
    .switch-off[disabled]:after {
      box-shadow: var(--shadow-1);
      background-color: var(--color-fill1-1);
      border-color: var(--color-line1-1); }
    .switch-off[disabled] > .switch-children {
      color: var(--color-line1-3); }
  .switch-off.switch-small > .switch-children {
    right: var(--s-1)var(--line-1); }
`