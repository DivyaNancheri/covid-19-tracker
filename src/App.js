import React, { useState, useEffect } from 'react';
import {
  NativeSelect,
  FormControl,
  Card,
  CardContent
} from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';
import numeral from 'numeral';
import './App.css';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryDetails, setCountryDetails] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 2.0, lng: 2.0});
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryDetails(data);
      })
  }, []);

  useEffect(() => {
    //code inside here lwill run once the 
    // component is loaded not again
    //and the varibale passed in the [] chnages
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country, //Afghanistan
              value: country.countryInfo.iso2, //AF
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url = (countryCode === 'worldwide') ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryDetails(data);
        if(countryCode === 'worldwide'){
          setMapCenter([ 1.0, 1.0 ]);
          setMapZoom(1);
        }
        else{
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            {/* <Select variant="outlined" value={country} onChange={onCountryChange}  >
              <MenuItem value="worldwide">Worldwide</MenuItem> 
              {countries.map((country,i) => (
                <MenuItem key={i} value={country.value}>{country.name}</MenuItem> 
              ))}
            </Select> */}
            <NativeSelect value={country} defaultValue="" onChange={onCountryChange}>
              <option value="worldwide">Worldwide</option>
              {countries.map((country, i) =>
                <option key={i} value={country.value}>
                  {country.name}
                </option>)}
            </NativeSelect>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Infected"
            isRed
            active={casesType === "cases"}
            cases={numeral(countryDetails.todayCases).format("0,0")}
            total={numeral(countryDetails.cases).format("0,0")
            } />
           <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={numeral(countryDetails.todayRecovered).format("0,0")}
            total={numeral(countryDetails.recovered).format("0,0")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={numeral(countryDetails.todayDeaths).format("0,0")}
            total={numeral(countryDetails.deaths).format("0,0")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app_right">
        <CardContent >
          <h3>Lives cases by country</h3>
          <Table countries={tableData} />
          <h3 className='app_graphTitle'>Worldwide new {casesType} cases</h3>
          <LineGraph className='app_graph' casesType={casesType}/>
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
