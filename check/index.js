console.log("Check script.");

const fs   = require('fs');
const path   = require('path');
const yaml = require('js-yaml');

var rootPath=path.normalize(__dirname+'/../..');;


var resultFileName;
var result = {};
var success = true;


var configFileName = "perses-tests.yaml";
var tests = {};

console.log("Loading Perses Tests ("+configFileName+").");
try {
  tests = yaml.safeLoad(fs.readFileSync(configFileName, 'utf8'));

} catch (e) {
  console.error(e);
  process.exit(1);
}

// console.log("Loading Perses Results ("+resultFileName+").");
// try {
//     result = JSON.parse(fs.readFileSync(resultFileName, 'utf8'));

// } catch (e) {
//   console.error(e);
//   process.exit(1);
// }


tests.forEach(function(value){
  if(value.type==="apipecker"){
    checkPerformanceResults(value)
  }
  if(value.type==="espresso"){
    checkUIResults()
  }

    
});

function checkPerformanceResults(value){
  console.log(">>>> Checking Performance tests...")
    resultFileName = "./logs/results"+(value.id).replace(/\s/g, '')+".json"
    try {
      result = JSON.parse(fs.readFileSync(resultFileName, 'utf8'));
      
      if (result.mean > value.expect.mean.under){
        console.error(value.id +": FAILED: result > max --> "+result.mean+ ">"+value.expect.mean.under);
        process.exit(1);
      }else{
        console.log(value.id +": PASSED: result < max --> "+result.mean+ " > "+value.expect.mean.under);
      }    
  
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
}


function checkUIResults(){
  
  fs.readdir(path.join('./logs/devices-logs/espresso/'), function(err, filenames) {
    if (err) {
      return console.log(err);
    }
    console.log(">>>> Checking Espresso tests...")
    console.log("-------------")
    files=filenames.length
    
    filenames.forEach(function(filename) {

      file=fs.readFileSync('./logs/devices-logs/espresso/' + filename, 'utf-8');


      //    TODO: CATCH TIME 
        let arr = file.split(/\r?\n/);
        arr.forEach((line, idx)=> {
            
          if(line.includes("OK")){
            console.log("Results of "+filename)
            console.log(line)
            //Time
            console.log(arr[idx-2])
          }

          if(line.includes("FAILURES")){
            console.log("Results of "+filename)
            console.log(line)
            console.log(arr[idx+1])
            success=false;
          }
        });

        console.log("-------------")
    });
    if(!success){
      console.error("FAILURE: Espresso tests have not been passed!");
      process.exit(1);
    }else{
      console.log("SUCCESS: Espresso tests have been passed correctly!")
    }
  });
}



