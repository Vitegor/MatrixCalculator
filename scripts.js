$(function() {

  var MATRIX_A = '#matrix-a';
  var MATRIX_B = '#matrix-b';
  var MATRIX_C = '#matrix-c';

  var MAX_MATRIX_SIZE = 10;
  var MAX_MATRIX_ERROR_MSG = 'Максимальный размер матрицы: ' + MAX_MATRIX_SIZE + ' x ' + MAX_MATRIX_SIZE;
  var MIN_MATRIX_ERROR_MSG = 'Минимальный размер матрицы: 1 х 1';

  var matrixData = {};

  $('#multiply').click(function() { multiply(); });

  $('#clear').click(function() { clear(); });

  $('#add-row').click(function() {
    var mId = getSelectedMatrixId();

    if ($(mId).find('tr').length < MAX_MATRIX_SIZE) {
      addRow(mId);
      getMatrixPostfix(mId) == 'a' ? addRow(MATRIX_C) : addColumn(MATRIX_A);
    }
    else alert(MAX_MATRIX_ERROR_MSG);
  });

  $('#add-column').click(function() {
    var mId = getSelectedMatrixId();

    if ($(mId).find('tr:first td').length < MAX_MATRIX_SIZE) {
      addColumn(mId);
      getMatrixPostfix(mId) == 'b' ? addColumn(MATRIX_C) : addRow(MATRIX_B);
    }
    else alert(MAX_MATRIX_ERROR_MSG);
  })

  $('#delete-row').click(function() {
    var mId = getSelectedMatrixId();

    if ($(mId).find('tr').length > 1) {
      deleteRow(mId);
      getMatrixPostfix(mId) == 'a' ? deleteRow(MATRIX_C) : deleteColumn(MATRIX_A);
    }
    else alert(MIN_MATRIX_ERROR_MSG);
  })

  $('#delete-column').click(function() {
    var mId = getSelectedMatrixId();

    if ($(mId).find('tr:first td').length > 1) {
      deleteColumn(mId);
      getMatrixPostfix(mId) == 'b' ? deleteColumn(MATRIX_C) : deleteRow(MATRIX_B);
    }
    else alert(MIN_MATRIX_ERROR_MSG);
  })

  function multiply() {
    initMatrixData();

    var colsCount = matrixData.A[0].length;

    $(MATRIX_C + ' tr').each(function(row) {
      $(this).find('td input').each(function(col) {
        this.value = calculateCell(row, col, colsCount);
      });
    })

    function calculateCell(row, col, colsCount) {
      var result = 0;
      for(c = 0; c < colsCount; c++) {
        result += matrixData.A[row][c] * matrixData.B[c][col];
      }
      return result;
    }
  }

  function initMatrixData() {
    matrixData = {
      A: getMatrixData(MATRIX_A),
      B: getMatrixData(MATRIX_B),
    }

    function getMatrixData(mId) {
      var result = [];

      $(mId + ' tr').each(function() {
        var rowData = [];

        $(this).find('td input').each(function() {
          rowData.push($(this).val());
        });

        result.push(rowData);
      });

      return result;
    }
  }

  function clear() {
    $('.matrix input').val('');
    setPlaceholders(MATRIX_A);
    setPlaceholders(MATRIX_B);
    setPlaceholders(MATRIX_C);
  }

  function addRow(mId) {
    var matrix = $(mId);
    var postfix = getMatrixPostfix(mId);
    var colsCount = matrix.find('tr:first > td').length;
    var cols = '';
    var disabled = postfix == 'c' ? ' disabled' : '';

    for(i = 0; i < colsCount; i++) {
      cols += '<td><input type="text"' + disabled + '></td>';
    }

    $(matrix).append('<tr>' + cols + '</tr>');
    setPlaceholders(mId);
  }

  function addColumn(mId) {
    var matrix = $(mId);
    var postfix = getMatrixPostfix(mId);
    var rowsCount = matrix.find('tr').length;
    var disabled = postfix == 'c' ? ' disabled' : '';

    matrix.find('tr').each(function() {
      $(this).append('<td><input type="text"' + disabled + '></td>');
    });

    setPlaceholders(mId);
  }

  function deleteRow(mId) {
    $(mId).find('tr:last').remove();
  }

  function deleteColumn(mId) {
    $(mId).find('tr').each(function() {
      $(this).find('td:last').remove();
    });
  }

  function swap() {
    //TODO
  }

  function setPlaceholders(mId) {
    var postfix = getMatrixPostfix(mId);

    $(mId + ' tr').each(function(row) {
      $(this).find('td input').each(function(col) {
        $(this).attr('placeholder', postfix + (row + 1) +',' + (col+1));
      });
    })
  }

  function getMatrixPostfix(mId) {
    return mId.substr(mId.length - 1, 1);
  }

  function getSelectedMatrixId() {
    return $('#select-matrix-a').is(':checked') ? MATRIX_A : MATRIX_B;
  }

});