var express = require("express"),
app = express(),
MBTiles = require('mbtiles');

if (process.argv.length < 3) {
console.log("Error! Missing TILES filename.\nUsage: node server.js TILES [PORT]");
process.exit(1);
}

var port = 3000;
if (process.argv.length === 4) {
port = parseInt(process.argv[3]);
}

var mbtilesLocation = String(process.argv[2]).replace(/\.mbtiles/,'') + '.mbtiles';

new MBTiles(mbtilesLocation, function(err, mbtiles) {
if (err) throw err;
app.get('/:z/:x/:y.*', function(req, res) {
var extension = req.param(0);
switch (extension) {
  case "terrain":{
    mbtiles.getTile(req.param('z'), req.param('x'), req.param('y'), function(err, terrain, headers) {
      if (err) {
        res.status(404).send('terrain rendering error: ' + err + '\n');
      } else {
        res.header("Content-Type", "application/octet-stream")
        res.send(terrain);
      }
    });
    break;
  }
  case "png": {
    mbtiles.getTile(req.param('z'), req.param('x'), req.param('y'), function(err, tile, headers) {
      if (err) {
        res.status(404).send('Tile rendering error: ' + err + '\n');
      } else {
        res.header("Content-Type", "image/png")
        res.send(tile);
      }
    });
    break;
  }
  case "grid.json": {
    mbtiles.getGrid(req.param('z'), req.param('x'), req.param('y'), function(err, grid, headers) {
      if (err) {
        res.status(404).send('Grid rendering error: ' + err + '\n');
      } else {
        res.header("Content-Type", "text/json")
        res.send(grid);
      }
    });
    break;
  }
}
});

});

// actually create the server
app.listen(port);
