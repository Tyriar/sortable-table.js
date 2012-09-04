var sortClass = 'sorted';
var descSortClass = 'desc';

$().ready(function () {
  $('table.sortable').each(function (i, sortableTable) {
    var sorted = false;
    var ths = $(sortableTable).find('thead  tr').children();
    for (var i = 0; i < ths.length; i++) {
      if ($(ths[i]).hasClass(sortClass)) {
        $(ths[i]).toggleClass(descSortClass); // toggle so it sorts correct order
        var rows = mergeSortTable($(sortableTable).find('tbody'), i);
        rearrangeTable(sortableTable, rows, ths[i]);
        sorted = true;
        break;
      }
    }

    $(sortableTable).find('th').each(function (j, th) {
      if (!sorted && j == 0) { // Assume sorted by first column if class not present
        $(th).addClass(sortClass);
      }
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
  var sortDesc = ($(sortTh).hasClass(sortClass) && !$(sortTh).hasClass(descSortClass));
  $(rows).each(function (i, row) {
    $(row).remove();
    if (sortDesc) { // desc
      $(row).prependTo(table);
    } else { // asc
      $(row).appendTo(table);
    }
  });
  if ($(sortTh).hasClass(sortClass)) {
    $(sortTh).toggleClass(descSortClass);
  } else {
    var ths = $(table).find('th');
    $(ths).removeClass(sortClass);
    $(ths).removeClass(descSortClass);
    $(sortTh).addClass(sortClass);
  }
}

function mergeSortTable(rows, col) { // column is 0-based
  if (rows.length <= 1) {
    return rows;
  }

  var left = [];
  var right = [];
  var middle = Math.floor(rows.length / 2);
  $(rows).each(function (i, row) {
    if (i < middle) {
      left[i] = row;
    } else {
      right[i - middle] = row;
    }
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