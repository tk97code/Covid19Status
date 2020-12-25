const selectElement = document.querySelector('select#select');
$('.div-title').hide();

//Remove Element by class name
const removeElements = (elms) => elms.forEach(el => el.remove());


// Add option to Select Element
function makeOptionBox(data) {
    const title = data.country;
    if (typeof title != "undefinded") {
        const optionBox = document.createElement("option");
        optionBox.innerHTML = title;
        selectElement.appendChild(optionBox);
    }
}


// Add Columns to table countries
function createColumns(data, orderCountry) {
    const country = data.country;
    const cases = data.cases;
    const active = data.active;
    const recovered = data.recovered;
    const deaths = data.deaths;
    const todayCases = data.todayCases;
    const todayDeaths = data.todayDeaths;

    const image = data.countryInfo.flag;
    const alt = data.countryInfo.iso2;

    const columns = document.createElement('tr');
    columns.innerHTML = `
            <tr>
                <td class="row-content" scope="row">${orderCountry.toLocaleString()}</td>
            </tr>

            <tr>
                <td class="row-content" scope="row"> 
                    <img class="flag" src="${image}" alt="${alt}"> ${country}
                </td>
            </tr>

            <tr>
                <td class="row-content" scope="row">${cases.toLocaleString()}</td>
            </tr>

            <tr>
                <td class="row-content" scope="row">${active.toLocaleString()}</td>
            </tr>

            <tr>
                <td class="row-content" scope="row">${recovered.toLocaleString()}</td>
            </tr>

            <tr>
                <td class="row-content" scope="row">${deaths.toLocaleString()}</td>
            </tr>

            <tr>
                <td class="row-content" scope="row">${todayCases.toLocaleString()}</td>
            </tr>

            <tr>
                <td class="row-content" scope="row">${todayDeaths.toLocaleString()}</td>
            </tr>
            `;
    const tableBody = document.getElementById('tableBody');
    tableBody.appendChild(columns);

}


/* ________ Sort Table: START ________ */
const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

// do the work...
document.querySelectorAll('.col-title').forEach(th => th.addEventListener('click', (() => {
    const table = th.closest('table');
    Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => table.appendChild(tr));
})));
/* ________ Sort Table: END ________ */


function manipulateData(data) {
    var orderCountry = 0;
    for (eachItem in data) {
        const singleData = data[eachItem];

        makeOptionBox(singleData);

        orderCountry++;

        createColumns(singleData, orderCountry);

        selectElement.addEventListener('change', (e) => {
            if (e.target.value == singleData.country) {

                let active_cases = singleData.active;
                let total_cases = singleData.cases;
                let deaths_cases = singleData.deaths;
                let new_cases_today = singleData.todayCases;
                let new_deaths_today = singleData.todayDeaths;
                let recovered_cases = singleData.recovered;

                $('.div-notification').hide('slow');

                $('.div-title').hide('slow');

                $('.div-title').show('slow');

                const country_title_elem = document.getElementById('country-title');
                country_title_elem.innerHTML = '&nbsp;';
                country_title_elem.innerHTML = singleData.country;

                showChart(
                    active_cases,
                    total_cases,
                    deaths_cases,
                    recovered_cases,
                    new_cases_today,
                    new_deaths_today,
                    singleData.country
                );
            }
        });
    }
    selectElement.remove(1);
}


const fetchedData = fetch(
        'https://corona.lmao.ninja/v2/countries'
    )

    .then((response) => {
        return response.json();
    })

    .then((data) => {
        manipulateData(data);
    });


// Chart Show Information coronavirus in country
function showChart(
    active_cases,
    total_cases,
    deaths_cases,
    recovered_cases,
    new_cases_today,
    new_deaths_today,
    title) {

    document.getElementById("wrapper").innerHTML = '&nbsp;';
    document.getElementById("wrapper").innerHTML = '<canvas id="chart"></canvas>';
    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Active cases: ' + active_cases,
                'Total cases: ' + total_cases,
                'Deaths: ' + deaths_cases,
                'Recovered: ' + recovered_cases,
                'New cases: ' + new_cases_today,
                'New deaths: ' + new_deaths_today
            ],
            datasets: [{
                label: 'Covid-19 in ' + title,
                data: [
                    active_cases,
                    total_cases,
                    deaths_cases,
                    recovered_cases,
                    new_cases_today,
                    new_deaths_today
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(57, 193, 71, 0.2)',
                    'rgba(18, 242, 246, 0.2)',
                    'rgba(142, 61, 250, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(57, 193, 71, 1)',
                    'rgba(18, 242, 246, 1)',
                    'rgba(142, 61, 250, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: 'lightblue'
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'whitesmoke',
                        fontStyle: 'bold',
                        userCallback: function(value, index, values) {
                            // Convert the number to a string and splite the string every 3 charaters from the end
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            // Convert the array to a string and format the output
                            value = value.join('.');
                            return value;
                        }
                    },
                    gridLines: {
                        color: '#3f4042f5',
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: 'whitesmoke',
                        fontStyle: 'bold',
                        userCallback: function(value, index, values) {
                            let value2 = value;
                            value2 = value2.replace(/\d+/g, '');
                            value = value.replace(/[A-Z]+[^A-Z]+[a-z]+[^a-z]+[ ]/g, '');
                            // Convert the number to a string and splite the string every 3 charaters from the end
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            // Convert the array to a string and format the output
                            value = value.join('.');
                            return value2 + value;
                        }
                    },
                    gridLines: {
                        color: '#3f4042f5'
                    }
                }]
            }
        }
    });
    chart.render();
}