// Draw calendar chart with total msgs per date
function drawCalendarChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'Total Messages' });
    dataTable.addRows(calendar_data);

    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

    var options = {
      title: "Total Messages Sent",
      height: 350
    };

    chart.draw(dataTable, options);
}

// Extract msg_per_date from stats
var data_per_person = [];
var i;
for (i = 0; i < stats.length; i++)
{
  var person = JSON.parse(stats[i]);
  var msg_per_date = person.msg_per_date;
  data_per_person.push(msg_per_date);
}

// Sum all messages per date for all people
var j;
var key;
var all_msgs_per_date = data_per_person[0];
for (j = 1; j < data_per_person.length; j++)
{
  for (key in data_per_person[j])
  {
    if (key in all_msgs_per_date)
    {
      all_msgs_per_date[key] += data_per_person[j][key];
    }
    else
    {
      all_msgs_per_date[key] = data_per_person[j][key];
    }
  }
}

// [ new Date(2012, 3, 17), 38229 ]
// format data for calendar chart
// JS months start from 0. January = 0
var date;
var msgs;
var calendar_data = [];
for (date in all_msgs_per_date)
{
  var year = Number(date.slice(0, 4));
  var month = Number(date.slice(4, 6)) - 1;
  var day = Number(date.slice(6, 8));
  var data = [ new Date(year, month, day), all_msgs_per_date[date]];
  calendar_data.push(data);
}
