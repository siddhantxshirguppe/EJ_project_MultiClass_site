var g_choro_bug = false;
function generateFinalDataset()
{
    var dataset_01 = document.querySelector("#dataset_01").value;
    var dataset_02 = document.querySelector("#dataset_02").value;
    var colorset_01_s = document.querySelector("#colorset_01_s").value;
    var colorset_02_s = document.querySelector("#colorset_02_s").value;
    var colorset_01_e = document.querySelector("#colorset_01_e").value;
    var colorset_02_e = document.querySelector("#colorset_02_e").value;
    var is_normalized = document.querySelector("#norm_switch").checked;
    var styleset_final ="";
    var dataset_final = "";
    g_choro_bug = false;
    if(dataset_01 === 'na' && dataset_02 === 'na') {
        console.log("Final dataset is na");
        dataset_final = "na";
    } else if(dataset_01 === 'na' || dataset_02 === 'na') {
        g_choro_bug = true;
        console.log("Final dataset is non-na: " + (dataset_01 === 'na' ? dataset_02 : dataset_01));
        dataset_final = (dataset_01 === 'na' ? dataset_02 : dataset_01);
        styleset_final = 
        {
            "classes": [
                {
                    "name": "class_"+(dataset_01 === 'na' ? dataset_02 : dataset_01),
                    "alias": "class_"+(dataset_01 === 'na' ? dataset_02 : dataset_01),
                    "color0": (dataset_01 === 'na' ? colorset_02_s : colorset_01_s),
                    "color1": (dataset_01 === 'na' ? colorset_02_e : colorset_01_e)
                }
            ],
        
        }
    } else if(dataset_01 === dataset_02) {
        console.log("Final same dataset is: " + dataset_01);
        dataset_final = dataset_01;
        styleset_final = 
        {
            "classes": [
                {
                    "name": "class_"+dataset_final,
                    "alias": "class_"+dataset_final,
                    "color0":  colorset_01_s,
                    "color1": colorset_01_e
                }
            ],
        
        }
    } else {
        // Combine datasets and print in dictionary order
        var combinedDatasets = [dataset_01, dataset_02];
        combinedDatasets.sort(); // Sort the datasets
        dataset_final = combinedDatasets.join("_");
        console.log("Final dataset is the combination of " + dataset_final);
        styleset_final = 
        {
            "classes": [
                {
                    "name": "class_"+dataset_01,
                    "alias": "class_"+dataset_01,
                    "color0":  colorset_01_s,
                    "color1": colorset_01_e
                },
                {
                    "name": "class_"+dataset_02,
                   "alias": "class_"+dataset_02,
                    "color0":  colorset_02_s,
                    "color1": colorset_02_e
                }
            ],
        
        }
    }
    console.log("sidnorm:"+is_normalized);
    if(is_normalized)
    {
        dataset_final = dataset_final + "_norm";
    }

    return { dataset: dataset_final, styleset: styleset_final };
}



function generateSpec()
{
        var urlConfig = {/* URL configuration */};
        var composeConfig = {/* Compose configuration */};
        var rescaleConfig = {/* Rescale configuration */};
        var composeSpec = document.querySelector("#compose").value;
        var final_obj = generateFinalDataset();
        var final_dataset = final_obj.dataset;
        var final_style = final_obj.styleset; 

        //change from choropleth to time if g_choro_bug is true. to fix white bg bug for single datasets
        if(g_choro_bug && composeSpec === 'choropleth')
        {
            if(final_dataset != 'race')
            {
                composeSpec = 'time';
            }
            
        }

        if(final_dataset === 'race')
        {
            console.log("sidrace final dataset:"+final_dataset)
            final_style =  
            {
                "classes": [
                    {
                        "name": "white",
                        "color1":  "blue",
                    },
                    {
                        "name": "hispanic",
                        "color1":  "red",
                    },
                    {
                        "name": "black",
                        "color1":  "green",
                    },
                    {
                        "name": "asian",
                        "color1":  "orange",
                    },
                    {
                        "name": "other",
                        "color1":  "purple",
                    },
                ],
            
            }
        }

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
                        "width": 30,
                        "height": 30
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
                        "height":30,
                        "width":30
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
            style:final_style,
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

        window.render(1,'DataSet: '+configs.dataset, {
            "data": configs.url,
            "style":configs.style,
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
                "title":"Class"
            },
            "stroke": {
                "type": "topojson",
                "url": "sid_data/Communities-Chicago.topojson",
                "feature": "Communities-Chicago",
                "color": "rgba(0, 0, 0, 0.3)"
            },
        }
        , true);
        console.log("render spec 01 called!!");

        //----------------------------------------
        window.render(2,'DataSet: '+configs.dataset, {
            "data": configs.url,
            "style":configs.style,
            "rebin": {
                "type": "topojson",
                "url": "sid_data/Communities-Chicago.topojson",
                "feature": "Communities-Chicago",
                "aggregation":"sum",
                "stroke":"red"
            },
            "compose": configs.compose,
            "rescale":configs.rescale, 
            "legend":{
                "title":"Class"
            },
            "stroke": {
                "type": "topojson",
                "url": "sid_data/Communities-Chicago.topojson",
                "feature": "Communities-Chicago",
                "color": "rgba(0, 0, 0, 0.3)"
            },
        }
        , true);
        console.log("render spec 02 called!!");
    }

}