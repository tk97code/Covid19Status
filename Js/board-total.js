function putDataToBoard(data) {
	const dataWorld = data[0];

	//Get Data
	let index_countries = 0;
	for (eachItems in data) {
		index_countries ++;
	}
	let cases = dataWorld.cases;
	let deaths = dataWorld.deaths;
	let todayCases = dataWorld.todayCases;
	let todayDeaths = dataWorld.todayDeaths;
	let recovered = dataWorld.recovered;

	//Get element
	const affected_countries_elem = document.getElementById('affected-countries');
	const cases_elem = document.getElementById('cases');
	const deaths_elem = document.getElementById('deaths');
	const recovered_elem = document.getElementById('recovered');
	const todayCases_elem = document.getElementById('todayCases');
	const todayDeaths_elem = document.getElementById('todayDeaths');

	//Show information
	affected_countries_elem.innerHTML = index_countries.toLocaleString();
	cases_elem.innerHTML = cases.toLocaleString();
	deaths_elem.innerHTML = deaths.toLocaleString();
	recovered_elem.innerHTML = recovered.toLocaleString();
	todayCases_elem.innerHTML = '+' + todayCases.toLocaleString();
	todayDeaths_elem.innerHTML = '+' + todayDeaths.toLocaleString();
}

const getData = fetch(
    'https://coronavirus-19-api.herokuapp.com/countries'
)
	.then( (response) => { 
	    return response.json();
	})

	.then( (data) => {
	    putDataToBoard(data);
	});