export default {
    lineOpation: {  //zhexiantu
        chart: {
            type: 'line',
            zoomType: 'x',
            panning: true,
            marginLeft:25,
            marginTop:25
        },
        title: {
            text: null
        },

        subtitle: {
            text: null
        },
        credits: { enabled: false },
        yAxis: [{
            title: null,
            gridLineDashStyle: 'grid',
            gridLineColor: '#e9edf0',
            gridLineWidth: 1,
            labels: {
                align: 'left',
                x: -25,
                y: 0,
                style: {
                    color: '#999'
                }
            }
        }],
        xAxis: [{
            gridLineDashStyle: 'grid',
            gridLineColor: '#e9edf0',
            gridLineWidth: 1,
            labels: {
                align: 'left',
                x: -15,
                y: 15,
                style: {
                    color: '#999'
                }
            }
        }],

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: [{
            name: '',
            showInLegend: false,
            type: 'line',
            lineWidth: 1,
            color: '#5B8FF9',
            data: [439, 1525, 571, 1696, 970, 1199, 1371, 1541, 541],
            marker: {
                enabled: false
            }
        }],
        tooltip: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    }
}