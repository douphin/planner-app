const fs = require('fs');

exports.weather = async (req, res) => {
  try {
    
    
    //if (req.data == "false"){
    //  res.json({ dataNeeded : false })
    //  return;
    //}
    //
    //res.json({ dataNeeded : true })


    var tmwurl = "https://api.tomorrow.io/v4/weather/forecast?location=39.1031,84.5120&apikey=";
    var apikey = process.env.API_KEY_TOMORROW_WEATHER;

    const response = await fetch(tmwurl+apikey);
    const data = await response.json();

    // console.log(data);

    let newJSON = JSON.stringify(data);
    fs.writeFile("weatherJSON2.json", newJSON, function (err) {
      return;
    });
    res.json({ data });
  } catch (error) {

    try
    {
      fs.readFile("weatherJSON2.json", "utf8", function (err, data) {
        pdata = JSON.parse(data);
        res.json(pdata);
      });
    }
    catch (error)
    {
      console.error("Error getting weather in: ", error);
      res.status(500).json({ error: error.message });
  }
  }
};
