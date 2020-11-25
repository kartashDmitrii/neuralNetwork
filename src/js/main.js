import Chart from 'chart.js'
let json = require('../fonts/clusters');
console.log(1);
let globalData = {
    info: []
};
let currentCurrency = 'UAH';
document.querySelectorAll('input[name="currency"]').forEach( elem => {
    elem.addEventListener('change', function(){
        document.querySelectorAll('input[name="currency"]').forEach( e => {
            if (e.checked){
                currentCurrency = e.value;
            }
        });
        document.querySelectorAll(`input[name="second-currency"][disabled]`).forEach(elem => elem.disabled = false)
        document.querySelector(`input[name="second-currency"][value="${currentCurrency}"]`).disabled = true;
        document.querySelector(`input[name="second-currency"][value="UAH"]`).disabled = true;
    })
});
let secondCurrency = 'USD';
document.querySelectorAll('input[name="second-currency"]').forEach( elem => {
    elem.addEventListener('change', function(){
        document.querySelectorAll('input[name="second-currency"]').forEach( e => {
            if (e.checked){
                secondCurrency = e.value;
            }
        })
    })
});
let graphLength = 'month';
document.querySelectorAll('input[name="date"]').forEach( elem => {
    elem.addEventListener('change', function(){
        document.querySelectorAll('input[name="date"]').forEach( e => {
            if (e.checked){
                graphLength = e.value;
            }
        })
    })
});
let prognoseLength = 'month';
document.querySelectorAll('input[name="prognose"]').forEach( elem => {
    elem.addEventListener('change', function(){
        document.querySelectorAll('input[name="prognose"]').forEach( e => {
            if (e.checked){
                prognoseLength = e.value;
            }
        })
    })
});
function formLabels(){
    let labels = [];
    globalData.info.forEach( obj => {
        labels.push(obj.date)
    });
    return labels
}
function formValues(){
    let values = [];
    globalData.info.forEach( obj => {
        values.push(obj.value)
    });
    return values
}
let ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: formLabels(),
        datasets: [{
            label: 'Курс Банка',
            data: formValues(),
            backgroundColor: 'rgba(29,65,255,0.2)',
            borderColor: 'rgb(61,140,255)',
            borderWidth: 1,
            lineTension: 0
        }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stacked: true
                }
            }]
        }
    }
});

let prognose = true;

function makePrognoses(){
    let labels = formLabels();
    let prognoseValue = [];

    let i;
    switch(prognoseLength){
        case "month":
            i = 60;
            break;
        case "week":
            i = 7;
            break;
        case "day":
            i = 1;
            break;
    }
    for (let j = 0; j < i; j++){
        labels.push(Date.today().add(j).days().toString("d.MM.yyyy"))
    }
    prognoseValue.push({
      x: globalData.info[globalData.info.length - 1].date,
      y: globalData.info[globalData.info.length - 1].value,
    });
    for (let j = 0; j < i; j++){
        prognoseValue.push({
            x: Date.today().add(j).days().toString("d.MM.yyyy"),
            y: json[currentCurrency][secondCurrency][Date.today().add(j).days().toString("d.MM.yyyy")]
        });
        console.log(j)
    }
    console.log(prognoseValue);
    myChart.data.labels = labels;

    if (myChart.data.datasets.length === 1) {
        myChart.data.datasets.push({
            label: 'Прогноз',
            data: prognoseValue,
            backgroundColor: 'rgba(96,255,189,0.2)',
            borderColor: 'rgb(44,255,65)',
            borderWidth: 1,
            lineTension: 0
        });
    } else {
        myChart.data.datasets[1] ={
            label: 'Прогноз',
            data: prognoseValue,
            backgroundColor: 'rgba(96,255,189,0.2)',
            borderColor: 'rgb(44,255,65)',
            borderWidth: 1,
            lineTension: 0
        };
    }
    myChart.update()
}

function chartUpdate(){
    globalData.info.sort((a, b) => {
        return a.date.split('.').reverse().join('') > b.date.split('.').reverse().join('') ? 1 : -1
    });
    myChart.data.labels = formLabels();
    myChart.data.datasets[0].data = formValues();
    if (prognose) makePrognoses();
    myChart.update()
}


function changeData(){
    globalData.info = [];
    if (currentCurrency === 'UAH'){
        let i;
        switch (graphLength) {
            case "week":
                i = 7;
                break;
            case "month":
                i = 30;
                break;
            case 'year':
                i = 52;
                break;
        }
        do {
            fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${secondCurrency}&date=${graphLength === 'year' ? Date.today().add(-i).weeks().toString("yyyyMMd") : Date.today().add(-i).days().toString("yyyyMMd")}&json`)
                .then((resp) => resp.json())
                .then((data) => {
                    fx.rates = data.rates;
                    globalData.info.push({
                        date: data[0].exchangedate,
                        value: data[0].rate.toFixed(3)
                    });
                }).catch(function (error) {
                console.log(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${secondCurrency}&date=${graphLength === 'year' ? Date.today().add(-i).weeks().toString("yyyyMMd") : Date.today().add(-i).days().toString("yyyyMMd")}&json`);
                })
            i --
        } while (i > 0);
        setTimeout( ()=> {
            chartUpdate()
        },500)

    } else {
        let i;
        switch (graphLength) {
            case "week":
                i = 7;
                break;
            case "month":
                i = 30;
                break;
            case 'year':
                i = 52;
                break;
        }
        do {
            fetch(`https://api.exchangeratesapi.io/${graphLength === 'year' ? Date.today().add(-i).weeks().toString("yyyy-MM-d") : Date.today().add(-i).days().toString("yyyy-MM-d")}?base=${secondCurrency}`)
                .then((resp) => resp.json())
                .then((data) => {
                    fx.rates = data.rates
                    globalData.info.push({
                        date: data.date,
                        value: data.rates[currentCurrency].toFixed(3)
                    });
                }).catch(function (error) {
                    console.log(`https://api.exchangeratesapi.io/${graphLength === 'year' ? Date.today().add(-i).weeks().toString("yyyy-MM-d") : Date.today().add(-i).days().toString("yyyy-MM-d")}?base=${secondCurrency}`);
            })
            i --
        } while (i > 0);
        setTimeout( ()=> {
            chartUpdate()
        },500)
    }
}
changeData();

document.querySelectorAll('input[type="radio"]').forEach( elem => {
    elem.addEventListener('change',changeData)
});



function showTodayCurrency(){
    document.querySelector('.table .head .curr').innerHTML = currentCurrency;
    let allCurr = [];
    document.querySelectorAll('input[name="currency"]').forEach(elem => {
        if (elem.value !== currentCurrency) allCurr.push(elem.value)
    });
    allCurr.forEach( (curr, i) => {
        document.querySelectorAll('.table .row')[i].querySelector('.name').innerHTML = curr;
        if (currentCurrency === "UAH"){
            fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${curr}&json`)
                .then((resp) => resp.json())
                .then((data) => {
                    document.querySelectorAll('.table .row')[i].querySelector('.val').innerHTML = data[0].rate.toFixed(3);
                });
        }else {
            fetch(`https://api.exchangeratesapi.io/latest?base=${curr}`)
                .then((resp) => resp.json())
                .then((data) => {
                    fx.rates = data.rates;
                    document.querySelectorAll('.table .row')[i].querySelector('.val').innerHTML = data.rates[currentCurrency].toFixed(3)
                }).catch(function (error) {
                    document.querySelectorAll('.table .row')[i].querySelector('.val').innerHTML = '-'
                })
        }
    });

}
showTodayCurrency();
document.querySelectorAll('input[name="currency"]').forEach( elem => {
    elem.addEventListener('change', showTodayCurrency);
});
