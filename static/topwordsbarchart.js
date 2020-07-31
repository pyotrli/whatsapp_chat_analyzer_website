function drawTopWordsBarChart() {
      data_rows = topWordsDataRows();
      var data = google.visualization.arrayToDataTable(data_rows);

      var options = {
        title: 'Top 5 Words',
        chartArea: {width: '70%'},
        hAxis: {
          minValue: 0
        }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('TopWordsBarChart'));
      chart.draw(data, options);
    }

function topWordsDataRows()
{
  // Extract top 10 words from stats
  var data_per_person = [];
  for (var i = 0; i < stats.length; i++)
  {
    var person = JSON.parse(stats[i]);
    var top_10_words = person.top_10_words;
    var name = person.name;
    data_per_person.push({name: name, top_10_words: top_10_words});

    // max 6 senders per chart
    if (i == 5)
    {
      break;
    }
  }

  // Construct title data line for the chart
  // ['Rank', 'Person1', { role: 'annotation' }, 'Person2', { role: 'annotation' }]
  var chart_data_title = ['Rank'];
  for (var j = 0; j < data_per_person.length; j++)
  {
    chart_data_title.push(data_per_person[j].name);
    chart_data_title.push({ role: 'annotation' });
  }



  // Construct data rows for the chart
  // ['Rank', Person 1 words used, Word, Person 2 words used, Word]
  var data_rows = [['1'], ['2'], ['3'], ['4'], ['5']];
  // max top 5 words only
  var max_data_rows = data_rows.length;
  for (var k = 0; k < data_per_person.length; k++)
  {
    var row_number = 0;
    var words = data_per_person[k].top_10_words;

    // if fewer than 5 types of words used - fill blanks
    for (var l = 0; l < words.length && row_number < max_data_rows; l++)
    {
      data_rows[row_number].push(words[l][1]);
      data_rows[row_number].push(words[l][0]);
      row_number++;
    }

    for (; row_number < max_data_rows; row_number++)
    {
      data_rows[row_number].push(0);
      data_rows[row_number].push("");
    }
  }

  // Put together data title and data rows to pass to chart
  data_rows.unshift(chart_data_title);
  return data_rows;
}
