export default `:host {
  font-size: 0;
  display: inline-block; }

.input {
  box-sizing: border-box;
  vertical-align: middle;
  display: inline-table;
  border-collapse: separate;
  font-size: 0;
  width: 200px;
  border-spacing: 0;
  transition: all .3s ease-out;
  border: var(--line-1) solid var(--color-line1-3);
  background-color: var(--color-white); }
  .input *,
  .input *:before,
  .input *:after {
    box-sizing: border-box; }
  .input input {
    height: 100%;
    /* remove autoFill yellow background */ }
    .input input[type="reset"], .input input[type="submit"] {
      -webkit-appearance: button;
      cursor: pointer; }
    .input input::-moz-focus-inner {
      border: 0;
      padding: 0; }
    .input input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px var(--color-white) inset; }
  .input textarea {
    resize: none; }
  .input input,
  .input textarea {
    width: 100%;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    font-weight: normal;
    vertical-align: middle;
    background-color: transparent;
    color: var(--color-text1-4); }
    .input input::-ms-clear,
    .input textarea::-ms-clear {
      display: none; }
  .input.input-textarea {
    border-radius: var(--corner-1);
    font-size: 0; }
    .input.input-textarea textarea {
      color: var(--color-text1-4);
      padding: var(--s-1) var(--s-2);
      font-size: var(--font-size-body-1);
      border-radius: var(--corner-1); }
    .input.input-textarea .input-control {
      display: block;
      width: auto;
      border-radius: var(--corner-1); }
    .input.input-textarea .input-len {
      padding: 0 var(--s-2) 4px;
      display: block;
      text-align: right;
      width: auto; }
  .input-hint-wrap {
    color: var(--color-text1-2);
    position: relative; }
    .input-hint-wrap .input-clear {
      opacity: 0;
      z-index: 1;
      position: absolute; }
    .input-hint-wrap .input-hint {
      opacity: 1; }
  .input .icon-delete-filling:hover {
    cursor: pointer;
    color: var(--color-text1-3); }
  .input:hover, .input.focus {
    border-color: var(--color-line1-4);
    background-color: var(--color-white); }
    .input:hover .input-clear, .input.focus .input-clear {
      opacity: 1; }
      .input:hover .input-clear + .input-hint, .input.focus .input-clear + .input-hint {
        opacity: 0; }
  .input .input-clear:focus {
    opacity: 1; }
    .input .input-clear:focus + .input-hint {
      opacity: 0; }
  .input.focus {
    border-color: var(--color-brand1-6);
    background-color: var(--color-white); }
  .input.error {
    border-color: var(--color-error-3); }
    .input.error.focus, .input.error:hover {
      border-color: var(--color-error-3); }
  .input.hidden {
    display: none; }
  .input.noborder {
    border: none; }
  .input-control .input-len {
    font-size: var(--font-size-caption);
    line-height: var(--font-size-caption);
    color: var(--color-text1-2);
    display: table-cell;
    width: 1px;
    vertical-align: bottom; }
    .input-control .input-len.error {
      color: var(--color-error-3); }
  .input-control > * {
    display: table-cell;
    width: 1%;
    top: 0; }
  .input-control > *:not(:last-child) {
    padding-right: var(--s-1); }
  .input-control .icon {
    transition: all .3s ease-out;
    color: var(--color-text1-2); }
  .input-control .icon-success-filling {
    color: var(--color-success-3); }
  .input-control .icon-loading {
    color: var(--color-notice-3); }
  .input-label {
    color: var(--color-text1-3); }
  .input input::-moz-placeholder,
  .input textarea::-moz-placeholder {
    color: var(--color-text1-2);
    opacity: 1; }
  .input input:-ms-input-placeholder,
  .input textarea:-ms-input-placeholder {
    color: var(--color-text1-2); }
  .input input::-webkit-input-placeholder,
  .input textarea::-webkit-input-placeholder {
    color: var(--color-text1-2); }
  .input.disabled {
    color: var(--color-text1-1);
    border-color: var(--color-line1-1);
    background-color: var(--color-fill1-1);
    cursor: not-allowed;
    background-color: var(--color-fill1-1); }
    .input.disabled:hover {
      border-color: var(--color-line1-1);
      background-color: var(--color-fill1-1); }
    .input.disabled input::-moz-placeholder, .input.disabled textarea::-moz-placeholder {
      color: var(--color-text1-1);
      opacity: 1; }
    .input.disabled input:-ms-input-placeholder, .input.disabled textarea:-ms-input-placeholder {
      color: var(--color-text1-1); }
    .input.disabled input::-webkit-input-placeholder, .input.disabled textarea::-webkit-input-placeholder {
      color: var(--color-text1-1); }
    .input.disabled .input-label {
      color: var(--color-text1-1); }
    .input.disabled .input-len {
      color: var(--color-text1-1); }
    .input.disabled input,
    .input.disabled textarea {
      color: var(--color-text1-1);
      border-color: var(--color-line1-1);
      background-color: var(--color-fill1-1);
      cursor: not-allowed; }
      .input.disabled input:hover,
      .input.disabled textarea:hover {
        border-color: var(--color-line1-1);
        background-color: var(--color-fill1-1); }
    .input.disabled .input-hint-wrap {
      color: var(--color-text1-1); }
      .input.disabled .input-hint-wrap .input-clear {
        opacity: 0; }
      .input.disabled .input-hint-wrap .input-hint {
        opacity: 1; }
      .input.disabled .input-hint-wrap .icon-delete-filling:hover {
        cursor: not-allowed;
        color: var(--color-text1-1); }
    .input.disabled .icon {
      color: var(--color-text1-1); }
  .input-group {
    box-sizing: border-box;
    display: inline-table;
    border-collapse: separate;
    border-spacing: 0;
    line-height: 0;
    width: 100%; }
    .input-group.small {
      font-size: var(--font-size-caption); }
      .input-group.small .input {
        height: var(--s-5);
        border-radius: var(--corner-1); }
        .input-group.small .input .input-label {
          padding-left: var(--s-2); }
        .input-group.small .input .input-control {
          padding-right: var(--s-1); }
        .input-group.small .input input {
          height: calc(var(--s-5) - var(--line-1) * 2);
          padding: 0 var(--s-1); }
          .input-group.small .input input::placeholder {
            font-size: var(--font-size-caption); }
        .input-group.small .input .input-text-field {
          padding: 0 var(--s-1);
          height: calc(var(--s-5) - var(--line-1) * 2); }
        .input-group.small .input input {
          border-radius: var(--corner-1); }
        .input-group.small .input .input-control {
          border-radius: 0 var(--corner-1) var(--corner-1) 0; }
        .input-group.small .input:first-child {
          border-top-left-radius: var(--corner-1);
          border-bottom-left-radius: var(--corner-1); }
        .input-group.small .input:last-child {
          border-top-right-radius: var(--corner-1);
          border-bottom-right-radius: var(--corner-1); }
    .input-group.medium {
      font-size: var(--font-size-body-1); }
      .input-group.medium .input {
        height: var(--s-7);
        border-radius: var(--corner-1); }
        .input-group.medium .input .input-label {
          padding-left: var(--s-2); }
        .input-group.medium .input .input-control {
          padding-right: var(--s-2); }
        .input-group.medium .input input {
          height: calc(var(--s-7) - var(--line-1) * 2);
          padding: 0 var(--s-2); }
          .input-group.medium .input input::placeholder {
            font-size: var(--font-size-body-1); }
        .input-group.medium .input .input-text-field {
          padding: 0 var(--s-2);
          height: calc(var(--s-7) - var(--line-1) * 2); }
        .input-group.medium .input input {
          border-radius: var(--corner-1); }
        .input-group.medium .input .input-control {
          border-radius: 0 var(--corner-1) var(--corner-1) 0; }
        .input-group.medium .input:first-child {
          border-top-left-radius: var(--corner-1);
          border-bottom-left-radius: var(--corner-1); }
        .input-group.medium .input:last-child {
          border-top-right-radius: var(--corner-1);
          border-bottom-right-radius: var(--corner-1); }
    .input-group.large {
      font-size: var(--font-size-subhead); }
      .input-group.large .input {
        height: var(--s-10);
        border-radius: var(--corner-1); }
        .input-group.large .input .input-label {
          padding-left: var(--s-3); }
        .input-group.large .input .input-control {
          padding-right: var(--s-2); }
        .input-group.large .input input {
          height: calc(var(--s-10) - var(--line-1) * 2);
          padding: 0 var(--s-3); }
          .input-group.large .input input::placeholder {
            font-size: var(--font-size-subhead); }
        .input-group.large .input .input-text-field {
          padding: 0 var(--s-3);
          height: calc(var(--s-10) - var(--line-1) * 2); }
        .input-group.large .input input {
          border-radius: var(--corner-1); }
        .input-group.large .input .input-control {
          border-radius: 0 var(--corner-1) var(--corner-1) 0; }
        .input-group.large .input:first-child {
          border-top-left-radius: var(--corner-1);
          border-bottom-left-radius: var(--corner-1); }
        .input-group.large .input:last-child {
          border-top-right-radius: var(--corner-1);
          border-bottom-right-radius: var(--corner-1); }
    .input-group *,
    .input-group *:before,
    .input-group *:after {
      box-sizing: border-box; }
    .input-group-auto-width {
      width: 100%;
      border-radius: 0; }
`