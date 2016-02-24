$(function() {

  var MATRIX_A = '#matrix-a';
  var MATRIX_B = '#matrix-b';
  var MATRIX_C = '#matrix-c';
  var SIDEBAR = '#sidebar';
  var ERRORS = '#errors';

  var MAX_MATRIX_SIZE = 10;
  var MIN_MATRIX_SIZE = 2;
  var MIN_MATRIX_VALUE = 0;
  var MAX_MATRIX_VALUE = 10;

  var MAX_MATRIX_ERROR_MSG = 
    'Максимальный размер матрицы: ' + MAX_MATRIX_SIZE + ' x ' + MAX_MATRIX_SIZE;

  var MIN_MATRIX_ERROR_MSG = 
    'Минимальный размер матрицы: ' + MIN_MATRIX_SIZE + ' x ' + MIN_MATRIX_SIZE;

  var INVALID_VALUE_MSG = 
    'Значение в ячейках матрицы должно быть числом в диапазоне от ' +
    MIN_MATRIX_VALUE + ' до ' + MAX_MATRIX_VALUE;

  var matrixData = {};

  $('#multiply').click(function() { multiply(); });

  $('#clear').click(function() { clear(); });

  $('#swap').click(function() { swap(); });

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
  });

  $('#delete-row').click(function() {
    var mId = getSelectedMatrixId();

    if ($(mId).find('tr').length > MIN_MATRIX_SIZE) {
      deleteRow(mId);
      getMatrixPostfix(mId) == 'a' ? deleteRow(MATRIX_C) : deleteColumn(MATRIX_A);
    }
    else alert(MIN_MATRIX_ERROR_MSG);

    validateMatrix();
  });

  $('#delete-column').click(function() {
    var mId = getSelectedMatrixId();

    if ($(mId).find('tr:first td').length > MIN_MATRIX_SIZE) {
      deleteColumn(mId);
      getMatrixPostfix(mId) == 'b' ? deleteColumn(MATRIX_C) : deleteRow(MATRIX_B);
    }
    else alert(MIN_MATRIX_ERROR_MSG);

    validateMatrix();
  });

  $('.matrix').on('focusin', 'input', function() {
    $(SIDEBAR).addClass('sidebar-on-edit');
    $(ERRORS).hide();
  });

  $('.matrix').on('focusout', 'input', function() {
    $(SIDEBAR).removeClass('sidebar-on-edit');
  });

  $('.matrix').on('change', 'input', function() {
    $(this).attr('value', $(this).val());
    $(SIDEBAR).removeClass('sidebar-on-error');
    $(ERRORS).html('').hide();
    $('#multiply').prop( 'disabled', true);
    validateMatrix();
  });

  function multiply() {
    initMatrixData();

    var colsCount = matrixData.A[0].length;

    $(MATRIX_C + ' tr').each(function(row) {
      $(this).find('td input').each(function(col) {
        this.value = calculateCell(row, col, colsCount);
      });
    });

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

  function validateMatrix() {
    if (matrixIsValid(MATRIX_A) && matrixIsValid(MATRIX_B)) {
      $(SIDEBAR).removeClass('sidebar-on-error');
      $(ERRORS).html('').hide();
      $('#multiply').prop( 'disabled', false);
    }
    else {
      $(SIDEBAR).addClass('sidebar-on-error');
      $(ERRORS).text(INVALID_VALUE_MSG).show();
    }
  }

  function matrixIsValid(mId) {
    var result = true;
    $(mId + ' tr').each(function() {
      $(this).find('td input').each(function() {
        if (!valueIsValid(this.value)) result = false;
      });
    });
    return result;
  }

  function valueIsValid(value) {
    if (value >= MIN_MATRIX_VALUE && value <= MAX_MATRIX_VALUE) {
      return true;
    }
    return false;
  }

  function swap() {
    var htmlMatrixA = $('#wrapper-matrix-a').html();
    var htmlMatrixB = $('#wrapper-matrix-b').html();

    var titleMatrixA = $('#title-matrix-a').text();
    var titleMatrixB = $('#title-matrix-b').text();

    $('#wrapper-matrix-a').html(htmlMatrixB);
    $('#wrapper-matrix-b').html(htmlMatrixA);

    $('#title-matrix-a').text(titleMatrixB);
    $('#title-matrix-b').text(titleMatrixA);
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