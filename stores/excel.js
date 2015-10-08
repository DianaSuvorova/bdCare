var FileSaver = require('filesaver.js');
var DateRangeStore = require('./dateRangeStore.js');

var _slotsDict = ['mon_am', 'mon_pm', 'tue_am', 'tue_pm', 'wed_am', 'wed_pm', 'thu_am', 'thu_pm', 'fri_am', 'fri_pm'];

var saveToExcel = function (_groups, _students) {
  var wb = new Workbook();

  dateRangeMap = DateRangeStore.getDateRangeMap();
  Object.keys(dateRangeMap).forEach(function (dateRangeName) {
    var dateRange = dateRangeMap[dateRangeName].dateRange;
    var ws = generateExcelWorksheetForDateRange(dateRange, _groups, _students);
    wb.SheetNames.push(dateRangeName);
    wb.Sheets[dateRangeName] = ws;
  })

  var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
  FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "bdCare.xlsx")
}

function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_groups_student_row_schedules(groups_to_schedulerows) {
  var ws = {}
  var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};

  var row = 0;
  for (group in groups_to_schedulerows) {
    scheduleRowsList = groups_to_schedulerows[group];
    for (var col = 0; C != scheduleRowsList.length; ++col) {
      var cell_ref = XLSX.utils.encode_cell({c:col,r:row});
      ws[cell_ref] = {v: scheduleRowsList[col]};
    }

    row += 1;
  }
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;

            var cell = {v: data[R][C]};
            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

            if (typeof cell.v === 'number') {
              cell.t = 'n';
            } else if(typeof cell.v === 'boolean') {
              cell.t = 'b';
            } else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            } else {
              cell.t = 's';
            }

            ws[cell_ref] = cell;
        }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}


function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}


function Workbook() {
  if(!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function generateExcelWorksheetForDateRange(dateRange, _groups, _students) {

  var data = []
  Object.keys(_groups).map(function(groupId) {
      var group = _groups[groupId];
      var groupHeader = _slotsDict.slice();
      groupHeader.unshift(_groups[groupId].name)
      data.push([""]);
      data.push(groupHeader);
      data = data.concat(group.toExcelFormat(dateRange, _students));
  });
  return sheet_from_array_of_arrays(data);
}

module.exports = saveToExcel;
