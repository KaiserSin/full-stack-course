import ButtonToShow from "./ButtonToShow"
import ShowInfo from "./ShowInfo"

const Country = ({allCountries, setAllCountries, setElementFilter}) =>{
    let toShow = allCountries.reduce((count, obj) => (obj.isFiltered ? count+1 : count), 0)
    if(toShow === 1){
        const valta = allCountries.find(element => element.isFiltered===true)
        return <ShowInfo country={valta}/>
    }
    else if(toShow <= 10){
        return(
            <div>
                {allCountries.map(val =>val.isFiltered ?
                <div key={val.id}>{val.name.common} <ButtonToShow setElementFilter={setElementFilter} setAllCountries = {setAllCountries} allCountries={allCountries} country={val}/></div> 
                : null)}
            </div>
        )
    }
    else{
        return(
            <div>
                Too many matches, specify another filter
            </div>
        )
    }
    
    
}

export default Country