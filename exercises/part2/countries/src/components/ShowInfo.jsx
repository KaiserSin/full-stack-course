const ShowInfo = ({country}) =>{
    let id = 0
    return(
        <div>
            <h2>{country.name.common}</h2>
            <div>capital {country.capital}</div>
            <div>area {country.area}</div>
            <h3>languages:</h3>
            <ul>
                {Object.values(country.languages).map(val =>{
                    id+=1
                    return <li key={id}>{val}</li>
                })
            
            }
            </ul>
            <img src = {country.flags.png}/>
        </div>
    )
}

export default ShowInfo