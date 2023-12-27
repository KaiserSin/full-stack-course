const ButtonToShow = ({setElementFilter, setAllCountries, allCountries, country}) =>{
    const handleChoseCountryClick = () =>{
        setElementFilter(country.name.common)
        let val = country.name.common.toLowerCase()
        let newCountr = allCountries.map(element =>{
            if(element.name.common.toLowerCase().includes(val)){
                element.isFiltered = true
                return element
            } 
            else{
                element.isFiltered = false
                return element
            }

        } )
        setAllCountries(newCountr)
    }
    return <button onClick={handleChoseCountryClick}>select</button>
}

export default ButtonToShow