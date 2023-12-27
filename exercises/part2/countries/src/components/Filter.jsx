const Filter = ({allCountries, setAllCountries, elementFilter, setElementFilter}) =>{
    const handleElementFilterChange = (event) =>{
        let val = event.target.value
        setElementFilter(val)
        val = val.toLowerCase()
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

    return(
        <form>
            <div>
                find countries <input value={elementFilter} onChange={handleElementFilterChange} />
            </div>
        </form>
        
    )
}

export default Filter