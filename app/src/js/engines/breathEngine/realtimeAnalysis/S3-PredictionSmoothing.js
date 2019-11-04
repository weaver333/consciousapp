function calcSmoothedPrediction(lastBreathStates) {

// Faster hashmap algorithm for finding the most common item in the last breath states array for accurate prediction
(function(array){
    let result,  // This is the value we will return
    best = -1,   // Initialize the comparison for greedy
    lookup = {}; // Hashmap for essentially constant lookup
    // Loop to go through array and count elements
    for(let i = 0; i < array.length; i++){ 
       // could replace block with `x[a[i]] = (x[a[i]] + 1)|0`
       //but far less readable
       if (lookup[array[i]] == undefined){
          lookup[array[i]] = 0;
       } 
       lookup[array[i]]++; // Increment count
       if(lookup[array[i]] > best){ // Greedy for best element
          best = lookup[array[i]];
          result = array[i]
       }
    }
    //will return most frequent item in array cats
    sessionData.breathStateNow = result;
    return result; 
 })(lastBreathStates);
}

export default calcSmoothedPrediction;
