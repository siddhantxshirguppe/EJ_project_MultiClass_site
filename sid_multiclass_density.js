function generateFinalDataset()
{
    var dataset_01 = document.querySelector("#dataset_01").value;
    var dataset_02 = document.querySelector("#dataset_02").value;
    var dataset_final = "";
    if(dataset_01 === 'na' && dataset_02 === 'na') {
        console.log("Final dataset is na");
        dataset_final = "na";
    } else if(dataset_01 === 'na' || dataset_02 === 'na') {
        console.log("Final dataset is non-na: " + (dataset_01 === 'na' ? dataset_02 : dataset_01));
        dataset_final = (dataset_01 === 'na' ? dataset_02 : dataset_01);
    } else if(dataset_01 === dataset_02) {
        console.log("Final same dataset is: " + dataset_01);
        dataset_final = dataset_01;
    } else {
        // Combine datasets and print in dictionary order
        var combinedDatasets = [dataset_01, dataset_02];
        combinedDatasets.sort(); // Sort the datasets
        dataset_final = combinedDatasets.join("_");
        console.log("Final dataset is the combination of " + dataset_final);
    }

    return dataset_final;
}

function generateSpec()
{
        var urlConfig = {/* URL configuration */};
        var composeConfig = {/* Compose configuration */};
        var rescaleConfig = {/* Rescale configuration */};
        var composeSpec = document.querySelector("#compose").value;
        var final_dataset = generateFinalDataset();
        console.log("sidlog compose selected!"+composeSpec+"dataset selected:"+final_dataset);

        urlConfig = {"url":"sid_data/DATASHADER_DATA/ALL_DATA_TEST/"+final_dataset+"_datashader_data.json"};

        //------------------
        rescaleConfig = {"type": "linear"};
        //------------------

        switch (composeSpec) {
            case "bars":
                composeConfig = 
                {
                    "mix": "glyph",
                    "glyphSpec": 
                    {
                        "template": "bars",
                        "height":"25",
                        "width":"25"
                    }
                };
                break;
            case "punchcard":
                composeConfig = 
                {
                    "mix": "glyph",
                    "glyphSpec": 
                    {
                        "template": "punchcard",
                        "height":"25",
                        "width":"25"
                    }
                };
                break;
            case "choropleth":
                composeConfig = 
                {
                    "mix": "mean"
                };
                break;
            case "time":
                composeConfig = 
                {
                    "mix": "time"
                };
                break;
            case "propline":
                composeConfig = 
                {
                    "mix": "propline",
                    "size": 4,
                    "widthprop": "percent",
                    "colprop": true
                };
                break;
            case "hatching":
                composeConfig = 
                {
                    "mix": "hatching",
                    "size": 4,
                    "widthprop": 1,
                    "colprop": false
                }
                break;
            case "weaving-hex":
                composeConfig = 
                {
                    "mix": "weaving",
                    "size": 10,
                    "shape": "hex"
                }
                break;
            case "weaving-tri":
                composeConfig = 
                {
                    "mix": "weaving",
                    "size": 10,
                    "shape": "tri"
                }
                break;
            case "weaving-square":
                composeConfig = 
                {
                    "mix": "weaving",
                    "size": 10,
                    "shape": "square"
                }
                break;
            case "weaving-random":
                composeConfig = 
                {
                    "mix": "weaving",
                    "size": 10,
                    "shape": "random"
                }
                break;
            default:
              console.log("I have no idea what fruit this is");
          }


        return {
            dataset:final_dataset,
            url: urlConfig,
            compose: composeConfig,
            rescale: rescaleConfig
        };
}

window.renderSpec = function()
{
    var dataset_final = "DATASHADER_DATA/ALL_DATA_TEST/income_population";
    if(dataset_final == 'na')
    {
        window.alert("No dataset selected!");
    }else{
        var configs = generateSpec();
        window.render('DataSet: '+configs.dataset, {
            "data": configs.url,
            "rebin": {
                "type": "topojson",
                "url": "sid_data/Communities-Chicago.topojson",
                "feature": "Communities-Chicago",
                "aggregation":"sum",
                "stroke":"black"
            },
            "compose": configs.compose,
            "rescale":configs.rescale, 
            "legend":{
                "title":"sid_legend"
            },
            "stroke": {
                "type": "topojson",
                "url": "sid_data/Communities-Chicago.topojson",
                "feature": "Communities-Chicago",
                "color": "rgba(0, 0, 0, 0.3)"
            },
        }
        , true);
        console.log("render spec called!!");
    }

}