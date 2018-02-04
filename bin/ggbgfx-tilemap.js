#!/usr/bin/env node

"use strict";

var program = require("commander");
var path = require("path");
var fs = require("fs");
var ggbgfx = require("ggbgfx");

program
  .version("1.0.0")
  .arguments("<source> <tileset>")
  .option("-o, --outfile [file]", "The name of the output file.")
  .option(
    "-n, --name [name]",
    "The name of the C variable definition. Defaults to source name."
  )
  .option(
    "-s, --offset [n]",
    "Offset tilemap numbers by n tiles. Needed if not loading tilemap at initial memory location."
  )
  .option("-b, --bank [bankNo]", "Add pragma bank to top of output files")
  .option("-r, --raw", "Raw data output, don't include C variable definitons")
  .action(function(source, tileset) {
    var inputFile = path.resolve(process.cwd(), source);
    var tilesetFile = path.resolve(process.cwd(), tileset);

    var output = "";
    return ggbgfx
      .imageAndTilesetToTilemap(
        inputFile,
        tilesetFile,
        parseInt(program.offset) || 0
      )
      .then(function(data) {
        program.name = typeof program.name === "string" ? program.name : null;
        if (!program.raw) {
          if (program.bank) {
            output += "#pragma bank=" + program.bank + "\n\n";
          }
          var name = (program.name ||
            path.basename(source).replace(/\.[^/.]+$/, ""))
            .replace(/ /g, "_")
            .replace(/[^A-Za-z0-9_]/g, "");
          output += "const unsigned char " + name + "[] = {\n";
        }
        output += data;
        if (!program.raw) {
          output += "\n};\n";
        }
        if (program.outfile) {
          var outFile = path.resolve(process.cwd(), program.outfile);
          fs.writeFileSync(outFile, output);
        } else {
          process.stdout.write(output);
        }
      })
      .catch(function(error) {
        process.stderr.write(error);
        process.exit(1);
      });
  });
program.parse(process.argv);
