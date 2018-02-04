#!/usr/bin/env node

"use strict";

var program = require("commander");

program
  .version("1.0.0")
  .command("sprite [image]", "Convert PNG into sprite data")
  .command(
    "tileset [images...]",
    "Convert one or more PNGs into a tileset PNG containing all unique tiles"
  )
  .command(
    "tilemap [image] [tileset]",
    "Convert a source PNG and a tileset PNG into a tilemap data"
  )
  .command("tiledata [image]", "Convert a source PNG into tile data")
  .parse(process.argv);
