﻿/*!
 * sortable-table.js 0.1
 * MIT licensed
 *
 * Created by Daniel Imms, http://danielimms.blogspot.com.au
 */
var SORTED_CLASS = 'sorted';
var DESC_CLASS = 'desc';

$(document).ready(function () {
  $('table.sortable').each(function (i, sortableTable) {
    var sorted = false;
    var ths = $(sortableTable).find('thead  tr').children();
    ths.each(function (j, th) {
      if ($(th).hasClass(SORTED_CLASS)) {
        $(th).toggleClass(DESC_CLASS); // toggle so it sorts correct order
        var rows = mergeSortTable($(sortableTable).find('tbody'), i);
        rearrangeTable(sortableTable, rows, th);
        sorted = true;
        return false;
      }
    });

    ths.each(function (j, th) {
      if (!sorted && j == 0) // Assume sorted by first column if class not present
        $(th).addClass(SORTED_CLASS);
      $(this).attr('tabindex', '0');
      $(this).attr('title', 'Sort by ' + $(this).html().toLowerCase() + ' column');
      $('<span>').appendTo(th); // CSS sort arrow after header
      $(th)
        .click({ columnIndex: j }, triggerSort)
        .keydown({ columnIndex: j }, triggerSort);
    });
  });
});

function triggerSort(event) {
  if (event.type == 'click' || event.keyCode == 13) {
    var table = $(this).closest('table')
    var rows = mergeSortTable($(table).find('tbody'), event.data.columnIndex);
    rearrangeTable(table, rows, this);
  }   
}

function appendSlideDown(toSelector, html) {
  $(html)
    .hide()
    .appendTo($(toSelector))
    .slideDown('fast');
}

function prependSlideDown(toSelector, html) {
  $(html)
    .hide()
    .prependTo($(toSelector))
    .slideDown('fast');
}

function rearrangeTable(table, rows, sortTh) {
  var sortDesc = ($(sortTh).hasClass(SORTED_CLASS) && !$(sortTh).hasClass(DESC_CLASS));
  $(rows).each(function (i, row) {
    $(row).remove();
    if (sortDesc) // desc
      $(row).prependTo(table);
    else // asc
      $(row).appendTo(table);
  });
  if ($(sortTh).hasClass(SORTED_CLASS)) {
    $(sortTh).toggleClass(DESC_CLASS);
  } else {
    var ths = $(table).find('th');
    $(ths).removeClass(SORTED_CLASS);
    $(ths).removeClass(DESC_CLASS);
    $(sortTh).addClass(SORTED_CLASS);
  }
}

function mergeSortTable(rows, col) { // column is 0-based
  if (rows.length <= 1)
    return rows;

  var left = [];
  var right = [];
  var middle = Math.floor(rows.length / 2);
  $(rows).each(function (i, row) {
    if (i < middle)
      left[i] = row;
    else
      right[i - middle] = row;
  });

  left = mergeSortTable(left, col);
  right = mergeSortTable(right, col);
  return merge(left, right, col);
}

function merge(left, right, col) {
  var results = [];
  while (left.length > 0 || right.length > 0) {
    if (left.length > 0 && right.length > 0) {
      if (rowSortValue(left[0], col) < rowSortValue(right[0], col)) {
        results[results.length] = left[0];
        left.shift();
      } else {
        results[results.length] = right[0];
        right.shift();
      }
    } else if (left.length > 0) {
      results[results.length] = left[0];
      left.shift();
    } else if (right.length > 0) {
      results[results.length] = right[0];
      right.shift();
    }
  }
  return results;
}

function rowSortValue(row, column) {
  return $($(row).find('td')[column]).html().toLowerCase();
}