const fs = require('fs');

var myArgs = process.argv.slice(2);  // Ignore "node ExtractThreats.js" portion

if (myArgs.length < 2) {             // At least: Dragon file + 1 project metadata column
	console.log('Usage:\n node ExtractThreats.js <threat model file> <ConstMetaDataItem1=Value1> <ConstMetaDataItem2=Value2>...<ConstMetaDataItemN=ValueN> [> <export csv file name>]');
	process.exit(1);
}

	//** Ingest threat model file

try {
	var rawdata = fs.readFileSync(myArgs[0]);
} catch (error) {
	console.error('ExtractThreats ERROR: Unable to open', 
				  myArgs[0], 'for reading.');
	process.exit();
}
var threatModel = JSON.parse(rawdata);
var metaDataCols = myArgs.length - 1;
		
function replaceCSVUnfriendlyChars(potentialCommaString){
	var returnString = ""; // ensure non-null for replace()

	returnString += potentialCommaString;
	returnString = returnString.replace(/,/g, ";");
	returnString = returnString.replace(/"/g, "\'");
	returnString = returnString.replace(/\n/g, " ");
	return returnString;
}

function dumpElementThreats(element, titlePrefix){

var myArgs = process.argv.slice(2);

	element.threats.forEach( (threat, threatIndex) => { 
		if (threat.status === "Open") {

				//** Detect odd differences a.k.a flows vs processes
				//** and output appropriately

			if ( element.attrs.text && element.attrs.text.text) {
				process.stdout.write(
					replaceCSVUnfriendlyChars(
						element.attrs.text.text)); // Item name
				process.stdout.write(":"); // Process name
			} else if ( element.labels && element.labels[0] && 
						element.labels[0].attrs &&
						element.labels[0].attrs.text && 
						element.labels[0].attrs.text.text) {
				process.stdout.write(
					replaceCSVUnfriendlyChars(
						element.labels[0].attrs.text.text)); // Item name
				process.stdout.write(":"); // Flow name
			}

			process.stdout.write(
				replaceCSVUnfriendlyChars(threat.title)); // Title
			process.stdout.write(", ");
			process.stdout.write(
				replaceCSVUnfriendlyChars(threat.description)); // Desc.
			process.stdout.write(" Mitigations so far:");
			process.stdout.write(
				replaceCSVUnfriendlyChars(threat.mitigation)); // Desc.

				// Now create fixed metadata for each key=value passed as argv
				// NOTE: special case for Tags (Azure DevOps) or Labels (Jira):
				//   Add STRIDE value from diagram in addition to your keyword
				// If you don't have a security bug label or tag, 
				// set "Tag= " on cli to allow STRIDE value to appear in CSV 

			for (let metaCol = 1; metaCol <= metaDataCols; metaCol++) {
				
				metaColKey=myArgs[metaCol].split("=")[0];
				metaColValue=myArgs[metaCol].split("=")[1];
				 
				process.stdout.write(", ");
				process.stdout.write(replaceCSVUnfriendlyChars(metaColValue));
				process.stdout.write(" ");

				if ("Tags" === metaColKey || "Labels" === metaColKey) {
					process.stdout.write(replaceCSVUnfriendlyChars(threat.type)); 
				}
			}
			process.stdout.write("\n");
		}
	} // => function					
	); // forEach args

} //dumpElementThreats()

function dumpDiagramThreats(diagram) {

		//** Ensure diagram has open threats, or return.

	var diagramHasThreats = 0;

	if (!diagram.diagramJson || !diagram.diagramJson.cells)
	{
		console.error("Diagram", diagram.title, "contains no threats."); 
		return;
	}
		// Ensure we have threats before proceeding with this diagram.

	diagram.diagramJson.cells.forEach( (diagramElement) => { 
											diagramHasThreats +=  diagramElement.hasOpenThreats ? 1 : 0;
										} 
	                                 );

	if (diagramHasThreats) {
		console.error(diagram.title, "has threats!");
	}
	else {
		console.error(diagram.title, "has no threats!");
		return;
	}

		//** Construct standard threat task title prefix

	var titlePrefix = "";

	titlePrefix+= replaceCSVUnfriendlyChars(threatModel.summary.title);
	titlePrefix+= ":";
	titlePrefix+= replaceCSVUnfriendlyChars(diagram.title);
	titlePrefix+= ":";

		//** Loop through threats for this elemet

	diagram.diagramJson.cells.forEach((element) => {
		if ( element.threats) {
			dumpElementThreats(element, titlePrefix);
		}

	});

} // dumpDiagramThreats()

		//	** Extract Threat Data
		// 
		// use stdout to contain CSV file. Write header.

	console.error('Current Threat Model: ', threatModel.summary.title, '\n');

	// Example DevOps line: process.stdout.write("Title,Description,Work Item Type,State,Story Points,Value Area,Iteration Path,Tags\n");
	process.stdout.write("Title,Description");
	
	for(let metaColHeaders = 1; metaColHeaders <= metaDataCols; metaColHeaders++) {
		process.stdout.write(", " );
		process.stdout.write( myArgs[metaColHeaders].split("=", 1)[0]); //Left of '=' : "Key" or "Header"
	}
	process.stdout.write("\n");

	//** Iterate through diagrams 															   

threatModel.detail.diagrams.forEach( diagram => dumpDiagramThreats(diagram));


