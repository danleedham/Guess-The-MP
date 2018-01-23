    
    function getRandomMember() {
        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/https://api.parliament.uk/Live/fixed-query/person_photo_index?format=application%2Fjson',
            dataType: 'JSON',
            type: 'GET',
            success: function (data) {
                var m = Math.floor(Math.random() * (data.results.bindings.length));
                
                var imageId = data.results.bindings[m].image.value;
                var imageId = imageId.replace('https://id.parliament.uk/','');
                var imageURL = 'https://api.parliament.uk/Live/photo/'+imageId+'.jpeg?crop=CU_1:1&width=186&quality=80';
                document.getElementById("image").src = imageURL;
                  correctAnswer = Math.floor(Math.random() * 4);
                document.getElementById("name"+correctAnswer).innerHTML = data.results.bindings[m].displayAs.value;
                document.getElementById("correctAnswer").value = correctAnswer;
                for(i=0; i<4; i++){
                    if(i !== correctAnswer){
                        document.getElementById("name"+i).innerHTML = data.results.bindings[Math.floor(Math.random() * (data.results.bindings.length))].displayAs.value;
                    }
                }
                $('#names').removeClass('hidden');
                
                var mid = data.results.bindings[m].person.value;
                var mid = mid.replace('https://id.parliament.uk/','');
                correctConstituency = Math.floor(Math.random() * 4);
                document.getElementById("correctConstituency").value = correctConstituency;
                correctParty = Math.floor(Math.random() * 4);
                document.getElementById("correctParty").value = correctParty;
                $.ajax({ 
                    url: 'https://cors-anywhere.herokuapp.com/https://api.parliament.uk/Live/fixed-query/person_by_id?person_id='+mid+'&format=application%2Fjson', 
                    dataType: 'JSON', 
                    type: 'GET', 
                    success: function (mdata) { 
                        for(const prop in mdata){
                            if(typeof mdata[prop]["https://id.parliament.uk/schema/constituencyGroupName"] != "undefined"){                   
                                var constituency = mdata[prop]["https://id.parliament.uk/schema/constituencyGroupName"][0].value;
                            }
							if(typeof mdata[prop]["https://id.parliament.uk/schema/partyName"] != "undefined"){                   
                                var party = mdata[prop]["https://id.parliament.uk/schema/partyName"][0].value;
                            }
                        }
                        document.getElementById("const"+correctConstituency).innerHTML = constituency;
						document.getElementById("party"+correctParty).innerHTML = '<img src="images/'+party+'.png">';
						console.log('You\'ve requested the image for: '+data.results.bindings[m].displayAs.value+' ('+party+')'+' '+constituency);
                    }
                }); 
                
				// Get some random constituency names
                $.ajax({ 
                    url: 'https://cors-anywhere.herokuapp.com/https://api.parliament.uk/Live/fixed-query/constituency_current?format=application%2Fjson', 
                    dataType: 'JSON', 
                    type: 'GET', 
                    success: function (cdata) { 
                        var constlist = Array();                    
                        for(const prop in cdata){
                            if(typeof cdata[prop]["https://id.parliament.uk/schema/constituencyGroupName"] != "undefined"){  
                                var currentconst = cdata[prop]["https://id.parliament.uk/schema/constituencyGroupName"][0].value;                 
                                constlist.push(currentconst);
                            }
                        }
                        for(i=0; i<4; i++){
                            if(i !== correctConstituency){
                                document.getElementById("const"+i).innerHTML = constlist[Math.floor(Math.random() * constlist.length)];
                            }
                        }       
                    }
                });	
                // Get some random party names
                $.ajax({ 
                    url: 'https://cors-anywhere.herokuapp.com/https://api.parliament.uk/Live/fixed-query/house_current_parties?house_id=1AFu55Hs&format=application%2Fjson', 
                    dataType: 'JSON', 
                    type: 'GET', 
                    success: function (cdata) { 
                        var partylist = Array();                    
                        for(const prop in cdata){
                            if(typeof cdata[prop]["https://id.parliament.uk/schema/partyName"] != "undefined"){  
                                var currentparty = cdata[prop]["https://id.parliament.uk/schema/partyName"][0].value;                 
                                partylist.push(currentparty);
                            }
                        }
                       
                        shuffle(partylist);
                        var sfindex = partylist.indexOf("Sinn Féin");
                        partylist.splice(sfindex, 1);
                                                
                        for(i=0; i<4; i++){
                            if(i !== correctParty){
								var iparty = partylist[i];
                                document.getElementById("party"+i).innerHTML = '<img src="images/'+iparty+'.png">';
                            }
                        }       
                    }
                });				
            }
        });
        var img = document.getElementById("image");
                
        if (img.complete) {
        } else {
            img.addEventListener('load', imageLoaded(imageId))
            img.addEventListener('error', function() {})
        }      
    }
    
    function imageLoaded(imageId){
        var img2 = document.getElementById("secondImage");
        var imageURL = 'https://api.parliament.uk/Live/photo/'+imageId+'.jpeg?crop=CU_1:1&width=500&quality=80';
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
    
    function checkname(answer) {
        var correctAnswer =  document.getElementById("correctAnswer").value;
        if(answer == correctAnswer){
            var correctElement = document.getElementById("name"+correctAnswer);
            correctElement.classList.add("btn-success");
            correctElement.classList.remove("btn-secondary");
            setTimeout(function(){
                correctElement.classList.add("btn-secondary");
                correctElement.classList.remove("btn-success");
                $('.btn-danger').addClass('btn-secondary');
                $('.btn-danger').removeClass('btn-danger');
                $('#names').addClass('hidden');
                $('#parties').removeClass('hidden');
            }, 2000);
        } else {
            var incorrectElement = document.getElementById("name"+answer);
            incorrectElement.classList.add("btn-danger");
            incorrectElement.classList.remove("btn-secondary");
        }
    }
	
    function checkparty(answer) {
        var correctParty =  document.getElementById("correctParty").value;
        if(answer == correctParty){
            var correctElement = document.getElementById("party"+correctParty);
            correctElement.classList.add("correctLogo");
            setTimeout(function(){
                $('.incorrectLogo').removeClass('incorrectLogo');
                $('.correctLogo').removeClass('correctLogo');
                $('#parties').addClass('hidden');
                $('#names').addClass('hidden');
				$('#constituencies').removeClass('hidden');
            }, 2000);
        } else {
            var incorrectElement = document.getElementById("party"+answer);
            incorrectElement.classList.add("incorrectLogo");
        }
    }
	
    function checkconst(answer) {
        var correctConstituency =  document.getElementById("correctConstituency").value;
        if(answer == correctConstituency){
            var correctElement = document.getElementById("const"+correctConstituency);
            correctElement.classList.add("btn-success");
            correctElement.classList.remove("btn-secondary");
            setTimeout(function(){
                correctElement.classList.add("btn-secondary");
                correctElement.classList.remove("btn-success");
                $('.btn-danger').addClass('btn-secondary');
                $('.btn-danger').removeClass('btn-danger');
                $('#constituencies').addClass('hidden');
                document.getElementById("image").src = 'images/blankface.jpg';
                getRandomMember();
            }, 2000);
        } else {
            var incorrectElement = document.getElementById("const"+answer);
            incorrectElement.classList.add("btn-danger");
            incorrectElement.classList.remove("btn-secondary");
        }
    }

	function shuffle(array) {
        var i = array.length,
            j = 0,
            temp;

        while (i--) {

            j = Math.floor(Math.random() * (i+1));

            // swap randomly chosen element with current element
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;

        }

        return array;
    }