console.log("Set up script init.");

const yaml = require('js-yaml');
const fs   = require('fs');
const path   = require('path');

var rootPath=path.normalize(__dirname+'/../..');;
var configFileName = rootPath+"/.perses.yml";
var config = "";

console.log("Loading Perses Config ("+configFileName+").");
try {
    config = yaml.safeLoad(fs.readFileSync(configFileName, 'utf8'));

} catch (e) {
  console.error(e);
  process.exit(1);
}

config.apk_path = rootPath+"/app/build/outputs/apk/app-debug.apk" 

configYAML = yaml.safeDump(config);

try {
    fs.writeFileSync(rootPath+'/.perses-full.yml', configYAML);
  } catch(err) {
    console.error(err);
  }

console.log("Obtaining credentials.");  

if( process.env.AWS_SECRET_KEY == undefined ){
    console.error("AWS_SECRET_KEY not available in environment");
    process.exit(1);  
} else if( process.env.AWS_ACCESS_KEY == undefined ){
    console.error("AWS_ACCESS_KEY not available in environment");
    process.exit(1);  
}else{

    var credentials ={
        access_key: process.env.AWS_ACCESS_KEY,
        secret_key: process.env.AWS_SECRET_KEY,
        key_path: "test",
        key_name: "test"
    } 
    var credentialsYAML = yaml.safeDump(credentials);
    
    try {
        fs.writeFileSync(rootPath+'/.perses-credentials.yml', credentialsYAML);
      } catch(err) {
        console.error(err);
      }
    
}



process.exit(0);