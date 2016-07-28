# sortable-table.js

[![Build Status](https://travis-ci.org/Tyriar/sortable-table.js.svg?branch=master)](https://travis-ci.org/Tyriar/sortable-table.js)

A JavaScript library that enables sorting of a `<table>` by clicking their headers.

## Usage

```html
<table class="sortable">
    ...
</table>
```

## Styling

To custom style the sorting arrows (asc/desc) target these selectors:

```css
table.sortable th.sorted span {}
table.sortable th.sorted.desc span {}
```
