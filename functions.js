    
    function getRandomMember() {
         $.ajax({
            headers:  {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            url: 'https://cors-anywhere.herokuapp.com/https://api.parliament.uk/Live/fixed-query/person_photo_index?format=application%2Fjson',
            dataType: 'JSON',
            type: 'GET',
            success: function (data) {
                var m = Math.floor(Math.random() * (data.results.bindings.length));
                
                var imageId = data.results.bindings[m].image.value;
                var imageId = imageId.replace('https://id.parliament.uk/','');
                var imageURL = 'https://api.parliament.uk/Live/photo/'+imageId+'.jpeg?crop=CU_1:1&width=186&quality=80';
                document.getElementById("image").src = imageURL;
                var img = document.getElementById("image");
                console.log('You\'ve requested the image for: '+data.results.bindings[m].displayAs.value);
                
                correctAnswer = Math.floor(Math.random() * 4);
                document.getElementById("name"+correctAnswer).innerHTML = data.results.bindings[m].displayAs.value;
                document.getElementById("correctAnswer").value = correctAnswer;
                for(i=0; i<4; i++){
                    if(i !== correctAnswer){
                        document.getElementById("name"+i).innerHTML = data.results.bindings[Math.floor(Math.random() * (data.results.bindings.length))].displayAs.value;
                    }
                }
                
                correctConstituency = Math.floor(Math.random() * 4);
                document.getElementById("const"+correctConstituency).innerHTML = data.results.bindings[m].mnisId.value;
                document.getElementById("correctConstituency").value = correctConstituency;
                for(i=0; i<4; i++){
                    if(i !== correctConstituency){
                        document.getElementById("const"+i).innerHTML = data.results.bindings[Math.floor(Math.random() * (data.results.bindings.length))].mnisId.value;
                    }
                }
                
                if (img.complete) {
                } else {
                    img.addEventListener('load', imageLoaded(imageId))
                    img.addEventListener('error', function() {})
                }              
            }
        });
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
                // getRandomMember();
                correctElement.classList.add("btn-secondary");
                correctElement.classList.remove("btn-success");
                $('.btn-danger').addClass('btn-secondary');
                $('.btn-danger').removeClass('btn-danger');
                $('#names').addClass('hidden');
                $('#constituencies').removeClass('hidden');
            }, 2000);
        } else {
            var incorrectElement = document.getElementById("name"+answer);
            incorrectElement.classList.add("btn-danger");
            incorrectElement.classList.remove("btn-secondary");
        }
    }
    
    function checkconst(answer) {
        var correctConstituency =  document.getElementById("correctConstituency").value;
        if(answer == correctConstituency){
            var correctElement = document.getElementById("const"+correctConstituency);
            correctElement.classList.add("btn-success");
            correctElement.classList.remove("btn-secondary");
            setTimeout(function(){
                getRandomMember();
                correctElement.classList.add("btn-secondary");
                correctElement.classList.remove("btn-success");
                $('.btn-danger').addClass('btn-secondary');
                $('.btn-danger').removeClass('btn-danger');
                $('#constituencies').addClass('hidden');
                $('#names').removeClass('hidden');
            }, 2000);
        } else {
            var incorrectElement = document.getElementById("const"+answer);
            incorrectElement.classList.add("btn-danger");
            incorrectElement.classList.remove("btn-secondary");
        }
    }