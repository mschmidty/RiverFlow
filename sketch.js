var hucData=[];

//To Find discharge go here look for this value: "wml2:value".
function setup() {
	noCanvas();
	// Read data/huc14.json to create Dropdown lists.
	hucData = loadJSON('./data/huc14.json');
	let dropdown = $('#hucCode');
	dropdown.empty;
	dropdown.append('<option selected="true" disabled>Choose Hydrologic Unit</option>');
	dropdown.prop('selectedIndex',0);
	const url = './data/huc14.json';
	$.getJSON(url,function(data){
		$.each(data, function(key,entry){
			dropdown.append($('<option></option>').attr('value', entry.HUC).text(entry.Name));
		})
	});



	//Load data from USGS water services API.
	$('#hucCode').change(function(){
		var hucValue="";
		$('#hucCode option:selected').each(function(){
			hucValue += $(this).val()+"";
			console.log(hucValue);
			loadXML('https://waterservices.usgs.gov/nwis/iv/?format=waterml,2.0&huc='+hucValue+'&parameterCd=00060,00065&siteStatus=all', loadData);

		})
	});
}



function loadData(data){
	console.log(data);
	$('.appendHucData').each(function(){
		$(this).remove();
	})
	//Loop through the data
	var stations = data.children;
	for(var i = 0; i<stations.length; i++){
		var locationAll = stations[i].children[0].children[1].content.split("at ")[1];
		var flow = stations[i].children[0].children[3].children[0].children[5].children[0].children[1].children[0].children[1].content;
		var river;
		var location;
		if(locationAll.indexOf('AT ')> -1){
			river = locationAll.split("AT ")[0];
			location = 'At ' + locationAll.split("AT ")[1];
		}else if(locationAll.indexOf('NEAR ')> -1){
			river = locationAll.split("NEAR ")[0];
			location = 'Near ' + locationAll.split("NEAR ")[1];
		}else{
			river = locationAll.split("BELOW ")[0];
			location = 'Below ' + locationAll.split("BELOW ")[1];
		}

		$('tbody').append("<tr class='appendHucData'>" + "<td>" + river + "</td>" + "<td>" + flow +  "</td>" + "<td>" + location + "</td>" + "</tr>");

	}

}
