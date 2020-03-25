#!/usr/bin/env node

"use strict";

var program = require("commander");
var path = require("path");
var ggbgfx = require("ggbgfx");

program
  .version("1.0.0")
  .arguments("<images...>")
  .option("-o, --outfile [file]", "The name of the output file.")
  .action(function(images) {
    if (!program.outfile) {
      process.stderr.write("no outfile given!");
      process.exit(1);
    }
    var outFile = path.resolve(process.cwd(), program.outfile);
    ggbgfx.imagesToTilesetImage(images, outFile).catch(function(error) {
      process.stderr.write(error.toString());
      process.exit(1);
    });
  });
program.parse(process.argv);
