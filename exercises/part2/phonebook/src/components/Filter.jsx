const Filter = ({elementFilter, setElementFilter, persons}) =>{
    const handleElementFilterChange = (event) =>{
        let val = event.target.value
        setElementFilter(val)
        val = val.toLowerCase()
        persons.map(element => element.name.toLowerCase().includes(val) ? 
        element.isFiltered=true : element.isFiltered=false)
      }

    return(
        <form>
        <div>
          filter shown with <input
                            value={elementFilter}
                            onChange={handleElementFilterChange}
                            />
        </div>
      </form>
    )
}

export default Filter