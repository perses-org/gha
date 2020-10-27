console.log("Check script.");

const fs   = require('fs');
const path   = require('path');
const yaml = require('js-yaml');

var rootPath=path.normalize(__dirname+'/../..');;


var resultFileName;
var result = {};


var configFileName = ".perses-tests.yml";
var tests = {};

console.log("Loading Perses Config ("+configFileName+").");
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
    resultFileName = rootPath+"/.results"+(value.id).replace(/\s/g, '')+".json"
    try {
      result = JSON.parse(fs.readFileSync(resultFileName, 'utf8'));
      
      if (result.mean > value.expect.mean.under){
        console.error("TEST FAILED: result > max --> "+result.mean+ ">"+value.expect.mean.under);
        process.exit(1);
      }else{
        console.log("TEST PASSED: result < max --> "+result.mean+ " > "+value.expect.mean.under);
      }
      

  
    } catch (e) {
      console.error(e);
    }

  }
    
});



