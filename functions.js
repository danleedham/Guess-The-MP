function getDefenceMembers() {
    var query = "https://id.parliament.uk/DSYZTjK2";
    var endpoint = 'https://api.parliament.uk/query/government_position_index?format=application%2Fjson';
    var queryUrl = endpoint + '&government_position_name=' + encodeURIComponent(query);
    console.log(queryUrl);
     $.ajax({
        url: queryUrl,
        dataType: 'JSON',
        type: 'GET',
        success: function (data) {
            var allDefSecs = [], currentDefSec = [], currentDefMinisters = [];
            for (i=0; i<data.results.bindings.length; i++){
                if(data.results.bindings[i].government_position_name.value == "Secretary of State for Defence"){
                    allDefSecs.push(data.results.bindings[i]);
                    if(!data.results.bindings[i].hasOwnProperty("incumbency_end")){
                        currentDefSec.push(data.results.bindings[i]);
                    } 
                } else if(data.results.bindings[i].government_position_name.value.includes("Ministry of Defence")) {
                    if(!data.results.bindings[i].hasOwnProperty("incumbency_end")){
                        currentDefMinisters.push(data.results.bindings[i]);
                    }
                }
            }

            document.getElementById("Label").innerHTML = currentDefSec[0].person_label.value;
            var mnis = currentDefSec[0].person_mnis_member_id;
            var startDate = currentDefSec[0].incumbency_start.value;
            // document.getElementById("StartDate").innerHTML = "From: " + startDate.replace("+01:00","");
            var person_uri = currentDefSec[0].person_uri.value;

            console.log(currentDefMinisters);
            
            for(i=0; i<currentDefMinisters.length; i++){
                var div = document.createElement("div");
                div.setAttribute("id","minister"+i);
                div.setAttribute("class","ministerElement")
                var name = currentDefMinisters[i].person_label.value
                var position = currentDefMinisters[i].government_position_name.value
                var startDate = currentDefSec[0].incumbency_start.value;
                startDate.replace("+01:00","");
                div.innerHTML = '<p><span class="ministerName"> '+ name + ' </span><br /><span class="ministerPosition">' + position + '</span></p>';
                document.getElementById("ministerList").appendChild(div);
            }

            $.ajax({ 
                url: 'https://cors-anywhere.herokuapp.com/https://api.parliament.uk/query/person_photo_index.json', 
                dataType: 'JSON', 
                type: 'GET', 
                success: function (mdata) { 
                    console.log(mdata);
                    var imageFound = false;
                    for(i=0; i<mdata.results.bindings.length; i++){ 
                        if(mdata.results.bindings[i].person.value == person_uri) {
                            var imageId = mdata.results.bindings[i].image.value;
                            var imageId = imageId.replace('https://id.parliament.uk/','');
                            var imageURL = 'https://api.parliament.uk/photo/'+imageId+'.jpeg?crop=CU_1:1&width=186&quality=80';
                            document.getElementById("image").src = imageURL;
                            var img = document.getElementById("image");
                            console.log('You\'ve requested the image for: '+mdata.results.bindings[i].displayAs.value);
                            if (img.complete) {
                            } else {
                                img.addEventListener('load', imageLoaded(imageId))
                                img.addEventListener('error', function() {})
                            }
                            var imageFound = true;        
                        }
                    }
                   if(imageFound != true){
                       console.log("No Official Portrait, loading a backup");
                       person_uri = "https://id.parliament.uk/lcCpkkJg";
                       for(i=0; i<mdata.results.bindings.length; i++){ 
                        if(mdata.results.bindings[i].person.value == person_uri) {
                            var imageId = mdata.results.bindings[i].image.value;
                            var imageId = imageId.replace('https://id.parliament.uk/','');
                            var imageURL = 'https://api.parliament.uk/photo/'+imageId+'.jpeg?crop=CU_1:1&width=186&quality=80';
                            document.getElementById("image").src = imageURL;
                            var img = document.getElementById("image");
                            console.log('You\'ve requested the image for: '+mdata.results.bindings[i].displayAs.value);
                            if (img.complete) {
                            } else {
                                img.addEventListener('load', imageLoaded(imageId))
                                img.addEventListener('error', function() {})
                            }
                            var imageFound = true;        
                        }
                    }
                   }
                            
                }
            }); 
             
        }
    });
}

function imageLoaded(imageId){
    var img2 = document.getElementById("secondImage");
    var imageURL = 'https://api.parliament.uk/photo/'+imageId+'.jpeg?crop=CU_1:1&width=500&quality=80';
    document.getElementById("secondImage").src = imageURL;
    if (img2.complete) {
    } else {
        img2.addEventListener('load', function() {
            document.getElementById("image").src = imageURL;
            console.log('Loaded high quality image');
        })
        img2.addEventListener('error', function() {})
    }               
}
