// Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
function drawPieChart() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Sender');
  data.addColumn('number', 'Total Messages');
  data.addRows(pie_data);

  // Set chart options
  var options = {'title':'Total Messages Sent',
                 'width':800,
                 'height':400,
                 'pieSliceText': 'value',
                 'legend': {position: 'right', alignment: 'center'},
                 is3D: true,
                };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('pie_chart_div'));
  chart.draw(data, options);
};

// Generate data for pie chart
var pie_data = [];
var i;
for (i = 0; i < stats.length; i++)
{
  // max 6 senders per chart
  if (i > 5)
  {
    break;
  }
  var person = JSON.parse(stats[i]);
  var person_data = [person.name, person.total_msgs];
  pie_data.push(person_data);
}
