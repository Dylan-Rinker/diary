#!/usr/bin/env node

import chalk from "chalk";
import { Command } from 'commander';
const program = new Command();
import pkg from './package.json';

// program
// 	.name("diary")
// 	.description("A command line interface for your diary.")
// 	.version(pkg.version);

// program.command("write")
// 	.description("Write an entry to your diary")
// 	.argument("<string>", "string to write")
// 	.action(() => {
// 		console.log("This is the write operation");
// 		console.log(``);
// 	});

// program.command("read")
// 	.description("Read entries from your diary")
// 	.option("-d, --date <date>", "date to read")
// 	.action((options) => {
// 		console.log(chalk.red(`This is the read tes operation. This option is ${options.date}`));
// 	});

// program.command("edit")
// 	.description("Edit an entry to your diary")
// 	.argument("<uuid>", "uuid of entry to edit")
// 	.action(() => {
// 		console.log("This is the edit operation");
// 	});

// program.command("search")
// 	.description("Search your diary.")
// 	// .argument("<string>", "string to search")
// 	.option("-l, --label <label>", "label to search")
// 	.option("-s, --string <string>", "string to search")
// 	.action((options) => {
// 		if (options.label) {
// 			console.log(`This is the search operation. This label option is ${options.label}`);
// 		}
// 		if (options.string) {
// 			console.log(`This is the search operation. This string option is ${options.string}`);
// 		}
// 	});

// program.parse(process.argv);
// const DATE_COLOR = green;

// console.log( DATE_COLOR("Hello!") );

console.log("hello");