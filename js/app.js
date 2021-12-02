const requestURL = "https://api.genderize.io/?name=";
var submitName = ""; // name for saving in local storage
var genderToSave = ""; // gender for saving in local storage

// Check is the entered name correct or not
function validateName() {
    let name = document.getElementById("name").value;
    let regex = /^[a-zA-Z ]*$/; // name must include letters and space
    if(!regex.test(name)){
        document.getElementById("warning").innerHTML = "Your name can have only capital and small letters and white space";
        return null;
    }else if (name.length < 1 || name.length > 255) { // length of name must less than 255 charachters
        document.getElementById("warning").innerHTML = "Your name should have more than one and 255 charachters at most";
        return null;
    }else{
        document.getElementById("warning").innerHTML = "";
        return name;
    }
}

// Get the gender of given name from the local storage
function getSavedAnswer(name){
    let myStorage = window.localStorage;
    return myStorage.getItem(name);
}

// Send a GET request with entered name as query parameters to the API for predicting the gender by submit button
function submitForm(event){
    event.preventDefault();
    let name = validateName();
    event.preventDefault();
    if (!name){
        document.getElementById("stored-answer").innerHTML = "";
        document.getElementById("male").checked = false;
        document.getElementById("female").checked = false;
        document.getElementById("gender-prediction").innerHTML = "";
        document.getElementById("probability-prediction").innerHTML = "";
        return false;
    }
    let xhr = new XMLHttpRequest();
    xhr.open("GET", requestURL + name, true);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) { // fetch operation is complete
            if (xhr.status === 200) {
                let obj = JSON.parse(this.response);
                submitName = name; // store the name which its gender predict by API for saving in local storage
                genderToSave = obj.gender;// when no radio buttons is checked, the prediction gender will save in local storage by save button
                if (obj.gender != null){ 
                    document.getElementById("gender-prediction").innerHTML = obj.gender;
                    document.getElementById("probability-prediction").innerHTML = obj.probability;
                    document.getElementById("warning").innerHTML = "";
                }else { // when the API can not predict the gender
                    document.getElementById("warning").innerHTML = `Can not predict the gender of ${name}`;
                    document.getElementById("gender-prediction").innerHTML = "";
                    document.getElementById("probability-prediction").innerHTML = "";
                }
            }else {
                document.getElementById("warning").innerHTML = "Network Error";
                document.getElementById("gender-prediction").innerHTML = "";
                document.getElementById("probability-prediction").innerHTML = "";
            }
        }
    };
    xhr.send();

    document.getElementById("stored-answer").innerHTML = getSavedAnswer(name); // show the answer that saved in local storage
    document.getElementById("male").checked = false;
    document.getElementById("female").checked = false;
}

// Check is the gender of given name save in local storage or not
function isSaved(name) {
    if (getSavedAnswer(name) != null) {
        return true;
    }
    return false;
}

// Clear the saved gender of given name from local storage
function clearFromStorage(name){
    let myStorage = window.localStorage;
    if(isSaved(name)){
        myStorage.removeItem(name);
    }
}

// Save the gender of entered name in local storage by save button
function saveGender(){
    let maleRadioButtonChecked = document.getElementById("male").checked;
    let femaleRadioButtonChecked = document.getElementById("female").checked;
    // when a radio button is checked, it will determine the gender that save in local storage
    if(maleRadioButtonChecked == true){
        genderToSave = "male";
    }else if(femaleRadioButtonChecked == true){
        genderToSave = "female";
    }
    clearFromStorage(submitName);
    let myStorage = window.localStorage;
    myStorage.setItem(submitName, genderToSave);
    document.getElementById("male").checked = false;
    document.getElementById("female").checked = false;
    document.getElementById("stored-answer").innerHTML = getSavedAnswer(submitName);
}

// Clear the saved gender of entered name from local storage by clear button
function clearSavedAnswer(){
    let name = document.getElementById("name").value;
    clearFromStorage(name);
    document.getElementById("male").checked = false;
    document.getElementById("female").checked = false;
    document.getElementById("stored-answer").innerHTML = getSavedAnswer(name);
}