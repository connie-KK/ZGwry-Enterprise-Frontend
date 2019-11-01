export default {
    lineOpation: {
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
            categories:[1, 2, 3, 4, 5, 6, 7, 8, 9],
            labels: {
                align: 'left',
                x: -15,
                y: 15,
                style: {
                    color: '#999'
                }
            }
        }],

        series: [{
            name: '',
            showInLegend: false,
            type: 'line',
            lineWidth: 1,
            color: '#5B8FF9',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
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