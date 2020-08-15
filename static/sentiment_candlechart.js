function drawSentimentChart() {
  var data_rows = sentimentDataRows();

  var data = google.visualization.arrayToDataTable(data_rows, false);
  // 'false' means that the first row contains labels, not data.

  var options = {
    chartArea: {width: '70%'},
    'title': 'Sentiment Analysis',
    hAxis: {
      textPosition: 'none'
    }
  };

  var chart = new google.visualization.CandlestickChart(document.getElementById('SentimentCandleChart'));

  chart.draw(data, options);
}

/*
var data_rows = [
        ['time', "Person1 label", "", "", "", "tooltip", "Person2 Label", "", "", "," "tooltip"],
        ['X', 0, 15,  15, 100, {tooltip}, 0, 24,  15, 100, {tooltip}],
        ['Y', 0, 15,  15, 100, {tooltip}, 0, 24,  15, 100, {tooltip}]
      ]
*/

function sentimentDataRows(){
  // Generate data for sentiment CandlestickChart
  var sentiment_data = [];
  var data_labels = ['Time']
  var person_data_rows = ["time"];
  var i;
  for (i = 0; i < stats.length; i++){
    // max 6 senders per chart
    if (i > 5)
    {
      break;
    }
    var person = JSON.parse(stats[i]);
    data_labels.push(person.name, "", "", "", {'type': 'string', 'role': 'tooltip'});

    var score = person.sentiment["score"];
    var magnitude = person.sentiment["magnitude"];
    while (magnitude > 10){
      magnitude = magnitude / 10;
    }
    var bottom = score - (magnitude / 2);
    var bottom_mid = score - (magnitude * 0.3);
    var top_mid = score + (magnitude * 0.3);
    var top = score + (magnitude / 2);
    var tooltip = person.name + "\n" +
                  "avg score: " + score.toFixed(1) * 10 + " / 10\n" +
                  "range: " + bottom.toFixed(1) + " to " + top.toFixed(1);
    var person_data = [bottom, bottom_mid, top_mid, top, tooltip];
    person_data_rows = person_data_rows.concat(person_data);
    }

  sentiment_data.push(data_labels);
  sentiment_data.push(person_data_rows);
  return sentiment_data;
  }
