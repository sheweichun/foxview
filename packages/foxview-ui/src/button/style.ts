export default `button {
  box-sizing: border-box; }
  button *,
  button *:before,
  button *:after {
    box-sizing: border-box; }
  button, button:active, button:focus, button:hover {
    outline: 0; }

:host {
  display: inline-block;
  line-height: 0; }

button {
  position: relative;
  display: inline-block;
  text-decoration: none;
  text-align: center;
  text-transform: none;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  transition: all .3s ease-out;
  cursor: pointer;
  /* warning */ }
  button:after {
    text-align: center;
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: opacity .5s ease; }
  button.small {
    border-radius: var(--corner-1);
    padding: 0 var(--s-2);
    height: var(--s-5);
    line-height: calc(var(--s-5) - 2 * var(--line-1));
    font-size: var(--font-size-caption);
    border-width: var(--line-1); }
    button.small.btn-loading {
      padding-left: calc(var(--s-2) + var(--icon-xs) + var(--s-1)); }
      button.small.btn-loading:after {
        width: var(--icon-xs);
        height: var(--icon-xs);
        font-size: var(--icon-xs);
        line-height: var(--icon-xs);
        left: var(--s-2);
        top: 50%;
        text-align: center;
        margin-top: -var(--icon-xs)/2;
        margin-right: var(--s-1); }
  button.medium {
    border-radius: var(--corner-1);
    padding: 0 var(--s-3);
    height: var(--s-7);
    line-height: calc(var(--s-7) - 2 * var(--line-1));
    font-size: var(--font-size-body-1);
    border-width: var(--line-1); }
    button.medium.btn-loading {
      padding-left: calc(var(--s-3) + var(--icon-xs) + var(--s-1)); }
      button.medium.btn-loading:after {
        width: var(--icon-xs);
        height: var(--icon-xs);
        font-size: var(--icon-xs);
        line-height: var(--icon-xs);
        left: var(--s-3);
        top: 50%;
        text-align: center;
        margin-top: -var(--icon-xs)/2;
        margin-right: var(--s-1); }
  button.large {
    border-radius: var(--corner-1);
    padding: 0 var(--s-4);
    height: var(--s-10);
    line-height: calc(var(--s-10) - 2 * var(--line-1));
    font-size: var(--font-size-subhead);
    border-width: var(--line-1); }
    button.large.btn-loading {
      padding-left: calc(var(--s-4) + var(--icon-s) + var(--s-1)); }
      button.large.btn-loading:after {
        width: var(--icon-s);
        height: var(--icon-s);
        font-size: var(--icon-s);
        line-height: var(--icon-s);
        left: var(--s-4);
        top: 50%;
        text-align: center;
        margin-top: -var(--icon-xs)/2;
        margin-right: var(--s-1); }
  button.normal {
    border-style: solid;
    background-color: var(--color-white);
    border-color: var(--color-line1-3); }
    button.normal, button.normal:link, button.normal:visited, button.normal.visited {
      color: var(--color-text1-4); }
    button.normal:hover, button.normal.hover, button.normal:active, button.normal.active {
      color: var(--color-text1-4);
      background-color: var(--color-fill1-2);
      border-color: var(--color-line1-4);
      text-decoration: none; }
  button.secondary {
    border-style: solid;
    background-color: var(--color-white);
    border-color: var(--color-brand1-6); }
    button.secondary, button.secondary:link, button.secondary:visited, button.secondary.visited {
      color: var(--color-brand1-6); }
    button.secondary:hover, button.secondary.hover, button.secondary:active, button.secondary.active {
      color: var(--color-white);
      background-color: var(--color-brand1-9);
      border-color: var(--color-brand1-9);
      text-decoration: none; }
  button.primary {
    border-style: solid;
    background-color: var(--color-brand1-6);
    border-color: var(--color-transparent); }
    button.primary, button.primary:link, button.primary:visited, button.primary.visited {
      color: var(--color-white); }
    button.primary:hover, button.primary.hover, button.primary:active, button.primary.active {
      color: var(--color-white);
      background-color: var(--color-brand1-9);
      border-color: var(--color-transparent);
      text-decoration: none; }
  button.disabled, button[disabled] {
    cursor: not-allowed;
    background-color: var(--color-fill1-1);
    border-color: var(--color-line1-1); }
    button.disabled, button.disabled:link, button.disabled:visited, button.disabled.visited, button[disabled], button[disabled]:link, button[disabled]:visited, button[disabled].visited {
      color: var(--color-text1-1); }
    button.disabled:hover, button.disabled.hover, button.disabled:active, button.disabled.active, button[disabled]:hover, button[disabled].hover, button[disabled]:active, button[disabled].active {
      color: var(--color-text1-1);
      background-color: var(--color-fill1-1);
      border-color: var(--color-line1-1);
      text-decoration: none; }
  button.warning {
    border-style: solid; }
    button.warning.primary {
      background-color: var(--color-error-3);
      border-color: var(--color-error-3); }
      button.warning.primary, button.warning.primary:link, button.warning.primary:visited, button.warning.primary.visited {
        color: var(--color-white); }
      button.warning.primary:hover, button.warning.primary.hover, button.warning.primary:active, button.warning.primary.active {
        color: var(--color-white);
        background-color: var(--color-error-4);
        border-color: var(--color-error-4);
        text-decoration: none; }
      button.warning.primary.disabled, button.warning.primary[disabled] {
        background-color: var(--color-fill1-1);
        border-color: var(--color-line1-2); }
        button.warning.primary.disabled, button.warning.primary.disabled:link, button.warning.primary.disabled:visited, button.warning.primary.disabled.visited, button.warning.primary[disabled], button.warning.primary[disabled]:link, button.warning.primary[disabled]:visited, button.warning.primary[disabled].visited {
          color: var(--color-text1-1); }
        button.warning.primary.disabled:hover, button.warning.primary.disabled.hover, button.warning.primary.disabled:active, button.warning.primary.disabled.active, button.warning.primary[disabled]:hover, button.warning.primary[disabled].hover, button.warning.primary[disabled]:active, button.warning.primary[disabled].active {
          color: var(--color-text1-1);
          background-color: var(--color-fill1-1);
          border-color: var(--color-line1-2);
          text-decoration: none; }
    button.warning.secondary {
      background-color: var(--color-white);
      border-color: var(--color-error-3); }
      button.warning.secondary, button.warning.secondary:link, button.warning.secondary:visited, button.warning.secondary.visited {
        color: var(--color-error-3); }
      button.warning.secondary:hover, button.warning.secondary.hover, button.warning.secondary:active, button.warning.secondary.active {
        color: var(--color-white);
        background-color: var(--color-error-4);
        border-color: var(--color-error-4);
        text-decoration: none; }
      button.warning.secondary.disabled, button.warning.secondary[disabled] {
        background-color: var(--color-fill1-1);
        border-color: var(--color-line1-1); }
        button.warning.secondary.disabled, button.warning.secondary.disabled:link, button.warning.secondary.disabled:visited, button.warning.secondary.disabled.visited, button.warning.secondary[disabled], button.warning.secondary[disabled]:link, button.warning.secondary[disabled]:visited, button.warning.secondary[disabled].visited {
          color: var(--color-text1-1); }
        button.warning.secondary.disabled:hover, button.warning.secondary.disabled.hover, button.warning.secondary.disabled:active, button.warning.secondary.disabled.active, button.warning.secondary[disabled]:hover, button.warning.secondary[disabled].hover, button.warning.secondary[disabled]:active, button.warning.secondary[disabled].active {
          color: var(--color-text1-1);
          background-color: var(--color-fill1-1);
          border-color: var(--color-line1-1);
          text-decoration: none; }
`