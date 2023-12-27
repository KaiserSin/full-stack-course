import { useEffect } from "react"
import { useState } from "react"
import countryService from "./services/country"
import Country from "./components/Country"
import Filter from "./components/Filter"

const App = () =>{
  const [allCountries, setAllCountries] = useState(null)
  const [elementFilter, setElementFilter] = useState('')

  useEffect(() =>{
    let id =0
    countryService
    .getAllInfo()
    .then(country =>{
      setAllCountries(
        country.map(val => {
          id++
          return {...val, isFiltered: true, id: id}
        })
      )
    })
  },[])

  
  if(allCountries!==null){
    return(
      <div>
        <Filter 
        allCountries = {allCountries} setAllCountries = {setAllCountries}
        elementFilter = {elementFilter} setElementFilter = {setElementFilter}/> 
        <Country allCountries = {allCountries} setAllCountries ={setAllCountries} setElementFilter={setElementFilter}/>
  
      </div>
    )
  }
  
}

export default App
