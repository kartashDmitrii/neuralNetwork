let demo = () => {
    let rate = fx(1).from("EUR").to("PLN");
    // alert(`1$ = ${rate.toFixed(4)}zloty`)
};
fetch('https://api.exchangeratesapi.io/2020-11-24?base=PLN')
    .then((resp) => resp.json())
    .then((data) => {fx.rates = data.rates; console.log(data)})
    .then(demo);

fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=EUR&date=20200302&json')
    .then((resp) => resp.json())
    .then((data) => {fx.rates = data.rates; console.log(data)});

document.querySelectorAll('input[name="currency"]').forEach( elem => {
    elem.addEventListener('click', function(){
        document.querySelectorAll('input[name="currency"]').forEach( e => {
            if (e.checked){
                console.log(e)
            }
        })
    })
});