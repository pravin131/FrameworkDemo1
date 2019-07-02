/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 35.294117647058826, "KoPercent": 64.70588235294117};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3382352941176471, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "JIRA Authentication"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Asynch - Internal server error Request"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Get Request Request"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Asynch - Required field missing error Request"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Sync Request"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Asynch - Field size exceeded error Request"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Get Import Request Results API Request"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Employee details Request"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Employee details validation Request"], "isController": false}, {"data": [1.0, 500, 1500, "Test result extracter"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Asynch - Invalid data type error Request"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Asynch Request"], "isController": false}, {"data": [0.0, 500, 1500, "Account Address Import - Asynch -Total record count exceeded error Request"], "isController": false}, {"data": [0.0, 500, 1500, "JIRA Status Update Request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34, 22, 64.70588235294117, 590.5294117647057, 1, 3206, 1902.0, 2755.25, 3206.0, 1.6839185775840722, 1.9416138378485466, 0.20986106124015652], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["JIRA Authentication", 1, 0, 0.0, 1413.0, 1413, 1413, 1413.0, 1413.0, 1413.0, 0.7077140835102619, 0.9502996726822364, 0.18591317232837934], "isController": false}, {"data": ["Account Address Import - Asynch - Internal server error Request", 1, 1, 100.0, 2013.0, 2013, 2013, 2013.0, 2013.0, 2013.0, 0.49677098857426727, 1.3607838114754098, 0.0], "isController": false}, {"data": ["Account Address Import - Get Request Request", 1, 1, 100.0, 1244.0, 1244, 1244, 1244.0, 1244.0, 1244.0, 0.8038585209003215, 2.203545769694534, 0.0], "isController": false}, {"data": ["Account Address Import - Asynch - Required field missing error Request", 1, 1, 100.0, 1127.0, 1127, 1127, 1127.0, 1127.0, 1127.0, 0.8873114463176576, 2.432307841614907, 0.0], "isController": false}, {"data": ["Account Address Import - Sync Request", 1, 1, 100.0, 1188.0, 1188, 1188, 1188.0, 1188.0, 1188.0, 0.8417508417508417, 2.307416614057239, 0.0], "isController": false}, {"data": ["Account Address Import - Asynch - Field size exceeded error Request", 1, 1, 100.0, 1223.0, 1223, 1223, 1223.0, 1223.0, 1223.0, 0.8176614881439085, 2.241382614472608, 0.0], "isController": false}, {"data": ["Account Address Import - Get Import Request Results API Request", 1, 1, 100.0, 1370.0, 1370, 1370, 1370.0, 1370.0, 1370.0, 0.7299270072992701, 2.0008838959854014, 0.0], "isController": false}, {"data": ["Account Address Import - Employee details Request", 1, 1, 100.0, 1791.0, 1791, 1791, 1791.0, 1791.0, 1791.0, 0.5583472920156337, 1.5305477037967616, 0.0], "isController": false}, {"data": ["Account Address Import - Employee details validation Request", 1, 1, 100.0, 3206.0, 3206, 3206, 3206.0, 3206.0, 3206.0, 0.3119151590767311, 0.8550252456331878, 0.0], "isController": false}, {"data": ["Test result extracter", 11, 0, 0.0, 1.8181818181818181, 1, 5, 4.600000000000001, 5.0, 5.0, 0.6842498133864144, 0.0, 0.0], "isController": false}, {"data": ["Account Address Import - Asynch - Invalid data type error Request", 1, 1, 100.0, 1053.0, 1053, 1053, 1053.0, 1053.0, 1053.0, 0.9496676163342831, 2.6032392568850904, 0.0], "isController": false}, {"data": ["Account Address Import - Asynch Request", 1, 1, 100.0, 2605.0, 2605, 2605, 2605.0, 2605.0, 2605.0, 0.3838771593090211, 1.0522882677543186, 0.0], "isController": false}, {"data": ["Account Address Import - Asynch -Total record count exceeded error Request", 1, 1, 100.0, 1099.0, 1099, 1099, 1099.0, 1099.0, 1099.0, 0.9099181073703367, 2.494277468152866, 0.0], "isController": false}, {"data": ["JIRA Status Update Request", 11, 11, 100.0, 66.0, 14, 157, 145.60000000000002, 157.0, 157.0, 0.682001364002728, 0.4779579871659743, 0.2464262741025482], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9999 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9494 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:80 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9595 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9292 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9898 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9696 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9797 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["401", 11, 50.0, 32.35294117647059], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9191 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:6060 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9393 [\/10.100.201.43] failed: Connection refused: connect", 1, 4.545454545454546, 2.9411764705882355], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 34, 22, "401", 11, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9696 [\/10.100.201.43] failed: Connection refused: connect", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9999 [\/10.100.201.43] failed: Connection refused: connect", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9797 [\/10.100.201.43] failed: Connection refused: connect", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9191 [\/10.100.201.43] failed: Connection refused: connect", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Account Address Import - Asynch - Internal server error Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:80 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Account Address Import - Get Request Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9696 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Account Address Import - Asynch - Required field missing error Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9494 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Account Address Import - Sync Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9898 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Account Address Import - Asynch - Field size exceeded error Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9292 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Account Address Import - Get Import Request Results API Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9797 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Account Address Import - Employee details Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9999 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Account Address Import - Employee details validation Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:6060 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Account Address Import - Asynch - Invalid data type error Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9393 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Account Address Import - Asynch Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9191 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Account Address Import - Asynch -Total record count exceeded error Request", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.100.201.43:9595 [\/10.100.201.43] failed: Connection refused: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["JIRA Status Update Request", 11, 11, "401", 11, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
