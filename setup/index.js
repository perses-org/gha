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

config.apk_path = rootPath+"/build/outputs/apk/debug/app-debug.apk";

config.apk_test_path = rootPath+"/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk";

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
} else if( process.env.KEY_NAME == undefined ){
    console.error("KEY_NAME not available in environment");
    process.exit(1);  
} else if( process.env.KEY_PEM == undefined ){
    console.error("KEY_PEM not available in environment");
    process.exit(1);  
}else{
    
    pemFileName = rootPath+'/.perses-key.pem';

    try {
        fs.writeFileSync(pemFileName, process.env.KEY_PEM, { mode: 0o600 });
      } catch(err) {
        console.error(err);
    }


    var credentials ={
        access_key: process.env.AWS_ACCESS_KEY,
        secret_key: process.env.AWS_SECRET_KEY,
        key_name: process.env.KEY_NAME,
        key_path: pemFileName
    } 

    var credentialsYAML = yaml.safeDump(credentials);
    
    try {
        fs.writeFileSync(rootPath+'/.perses-credentials.yml', credentialsYAML);
      } catch(err) {
        console.error(err);
      }
    
}



process.exit(0);