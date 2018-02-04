#!/usr/bin/env node

"use strict";

var program = require("commander");
var path = require("path");
var fs = require("fs");
var ggbgfx = require("ggbgfx");

program
  .version("1.0.0")
  .arguments("<source>")
  .option("-o, --outfile [file]", "The name of the output file.")
  .option(
    "-n, --name [name]",
    "The name of the C variable definition. Defaults to source name."
  )
  .option("-b, --bank [bankNo]", "Add pragma bank to top of output files")
  .option("-r, --raw", "Raw data output, don't include C variable definitons")
  .action(function(source) {
    var inputFile = path.resolve(process.cwd(), source);
    var output = "";
    return ggbgfx
      .imageToSpriteString(inputFile)
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
