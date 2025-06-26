
const geoLocationAPi = (function(){

    let result;

const getResult = ()=>{
    return result;
}
  
const fetchApi = async(address)=>{

const url = 'https://ip-location5.p.rapidapi.com/get_geo_info';
const options = {
	method: 'POST',
	headers: {
		'x-rapidapi-key': '30763165e2msh2155b8879dfa4bdp1827c2jsndd16eefc4173',
		'x-rapidapi-host': 'ip-location5.p.rapidapi.com',
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: new URLSearchParams({
		ip: address ||'8.8.8.8'
	})
};

try {
	const response = await fetch(url, options);
    if(!response.ok)
    {
        throw new Error('Error in fetching');
    }
	 result = await response.json();
	console.log(result);
} catch (error) {
	console.error(error);
}



    
    }

    return {fetchApi,getResult};

})();

const mapRenderer = (function () {

const notFound = document.querySelector('.map-not-found');
 const mapContainer = document.querySelector('#map');
     let map;
    let marker;
    let circle;


    const mapUpdating = (result) => {
        const lat = result.latitude;
        const long = result.longitude;

        if (lat && long) {
              mapContainer.style.display="block";
           notFound.style.display = "none";
            if (map) {
                map.setView([lat, long], 13);
                marker.setLatLng([lat, long]);
                circle.setLatLng([lat, long]);
                return;
            }

            map = L.map('map').setView([lat, long], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 25,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            marker = L.marker([lat, long]).addTo(map);

            circle = L.circle([lat, long], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 500
            }).addTo(map);
        } else {
            // If no valid coordinates
           mapContainer.style.display="none";
           notFound.style.display = "block";
        }
    };

    return { mapUpdating };
})();



const inputManagment = (function(geoLocation,mapService){

        const error = document.querySelector('.error');
    const searchValue= document.getElementById("search");
    searchValue.addEventListener('input',(e)=>{
        checkValidation(e);
    })

    const checkValidation = (e)=>{
 
        const value = e.target.value;

        if(!(/^[0-9.]*$/.test(value)))
        {
            error.innerText = "Enter a valid IP Address";
            error.style.display = "block";

            e.target.value = "";

        }
        else{
             error.style.display = "none";
        }

    }

    const search = document.getElementById('search-submission');

    const isValidIp = (value)=>{
return( /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(value));

    }
    search.addEventListener('click',()=>{updateData()})
    const updateData = ()=>{
        const searchingValue = searchValue.value.trim();

        if(isValidIp(searchingValue))
        {
            error.style.display = "none";
           updatingFetchData(searchingValue);
           

        }
        else{
            error.innerText =  "Enter a valid IP address (0-255.x.x.x)";
            error.style.display = "block";
        }

    }

    const renderingWeb = (result)=>{
        const ip = document.querySelector('.ip');
        const location = document.querySelector('.location');
        // const timeZone = document.querySelector('.Timezone');
        const isp = document.querySelector('.isp');

        if(!(result.region  && result.city  && result.country.code)  )
        {
                   location.textContent = 'N/A,N/A,N/A';
 
        }
        else{
        location.textContent = `${result.region},${result.city},${result.country.code}`;
 }
        ip.textContent=result.ip;
        isp.textContent = 'N/A';




    }

    const updatingFetchData = async(searchValue)=>{
        if(searchValue !== "")
        {    
            await geoLocation.fetchApi(searchValue);
             renderingWeb(geoLocation.getResult());
             mapService.mapUpdating(geoLocation.getResult());
             
        
        }
    else{
        await geoLocation.fetchApi();
        renderingWeb(geoLocation.getResult());
        mapService.mapUpdating(geoLocation.getResult());


    }
    }

    return {updatingFetchData};

})(geoLocationAPi,mapRenderer);

inputManagment.updatingFetchData();



