function drawMsgsPerHourChart() {
      data_rows = MsgsPerHourDataRows();
      var data = google.visualization.arrayToDataTable(data_rows);

      var options = {
        title: 'Messages per hour',
        chartArea: {width: '70%'},
        bar: { groupWidth: '75%' },
        hAxis: {
          gridlines: {color: 'none'},
          baselineColor: 'none',
          minValue: 0
        },
        isStacked: true,
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('MsgsPerHourChart'));
      chart.draw(data, options);
    }

function MsgsPerHourDataRows()
{
  // Extract top 10 emojis from stats
  var data_per_person = [];
  for (var i = 0; i < stats.length; i++)
  {
    var person = JSON.parse(stats[i]);
    var msg_per_hour = person.msg_per_hour;
    var name = person.name;
    data_per_person.push({name: name, msg_per_hour: msg_per_hour});

    // max 6 senders per chart
    if (i == 5)
    {
      break;
    }
  }

  // Construct title data line for the chart
  // ['Time of Day', 'Person1 name', 'Person2 name',.... { role: 'annotation' }]
  var chart_data_title = [{type: 'timeofday', label: 'Time of Day'}];
  for (var j = 0; j < data_per_person.length; j++)
  {
    chart_data_title.push(data_per_person[j].name);
  }
  chart_data_title.push({ role: 'annotation' });

  // Construct data rows for the chart
  // ['hour', Person 1 total msgs, Person 2 total msgs,... , '']
  var data_rows = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
  for (var k = 0; k < data_per_person.length; k++)
  {
    var hour = 0;
    var msgs_sent;
    for (msgs_sent of data_per_person[k]['msg_per_hour'])
    {
      data_rows[hour].push(msgs_sent);
      hour++;
    }
  }

  // insert timeofday at beginning of each data row
  // blank annotation at end of each data row
  for (var i = 0; i < data_rows.length; i++)
  {
    data_rows[i].unshift([i, 0, 0])
    data_rows[i].push('');
  }

  // Put together data title and data rows to pass to chart
  data_rows.unshift(chart_data_title);
  return data_rows;
}
