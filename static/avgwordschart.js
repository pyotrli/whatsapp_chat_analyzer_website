function drawAvgWordsChart() {
      data_rows = AvgWordsDataRows();
      var data = google.visualization.arrayToDataTable(data_rows);

      var options = {
        title: 'Average Words per message',
        chartArea: {width: '70%'},
        hAxis: {
          minValue: 0
        },
        vAxis: {
          minValue: 0
        }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('AvgWordsChart'));
      chart.draw(data, options);
    }

function AvgWordsDataRows()
{
  // Extract top 10 words from stats
  var data_per_person = [];
  for (var i = 0; i < stats.length; i++)
  {
    var person = JSON.parse(stats[i]);
    var avg_words = person.total_words / person.total_msgs;
    var name = person.name;
    data_per_person.push({name: name, avg_words: avg_words});
    // max 6 senders per chart
    if (i == 5)
    {
      break;
    }
  }

  // Construct title data line for the chart
  // ['Avg emojis per msg', 'Name1', 'Name2']
  var chart_data_title = ['Average Words per message'];
  for (var j = 0; j < data_per_person.length; j++)
  {
    chart_data_title.push(data_per_person[j].name);
  }

  // Construct data rows for the chart
  // ['Avg emojis per msg - literal text', 'Avg words per msg - number']
  var data_rows = [];
  var data_row = ['Average Words per message'];
  for (var k = 0; k < data_per_person.length; k++)
  {
    data_row.push(data_per_person[k].avg_words);
  }
  data_rows.push(data_row);


  // Put together data title and data rows to pass to chart
  data_rows.unshift(chart_data_title);
  return data_rows;
}
