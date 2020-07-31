function drawAvgEmojisChart() {
      data_rows = AvgEmojisDataRows();
      var data = google.visualization.arrayToDataTable(data_rows);

      var options = {
        title: 'Average Emojis per message',
        chartArea: {width: '70%'},
        hAxis: {
          minValue: 0
        },
        vAxis: {
          minValue: 0
        }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('AvgEmojisChart'));
      chart.draw(data, options);
    }

function AvgEmojisDataRows()
{
  // Extract top 10 words from stats
  var data_per_person = [];
  for (var i = 0; i < stats.length; i++)
  {
    var person = JSON.parse(stats[i]);
    var avg_emojis = person.total_emojis / person.total_msgs;
    var name = person.name;
    data_per_person.push({name: name, avg_emojis: avg_emojis});
    // max 6 senders per chart
    if (i == 5)
    {
      break;
    }
  }

  // Construct title data line for the chart
  // ['Avg emojis per msg', 'Name1', 'Name2']
  var chart_data_title = ['Average Emojis per Message'];
  for (var j = 0; j < data_per_person.length; j++)
  {
    chart_data_title.push(data_per_person[j].name);
  }

  // Construct data rows for the chart
  // ['Avg emojis per msg - literal text', 'Avg words per msg - number']
  var data_rows = [];
  var data_row = ['Average Emojis per Message'];
  for (var k = 0; k < data_per_person.length; k++)
  {
    data_row.push(data_per_person[k].avg_emojis);
  }
  data_rows.push(data_row);


  // Put together data title and data rows to pass to chart
  data_rows.unshift(chart_data_title);
  return data_rows;
}
