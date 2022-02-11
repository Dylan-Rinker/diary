#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs";
import inquirer from 'inquirer';
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
import { Command } from 'commander';
import { v4 as uuidv4 } from 'uuid';
const program = new Command();
// import * as data from './package.json';

program
	.name("diary")
	.description("A command line interface for your diary.")
	// .version(pkg.version);
	.version("1.0.0");

program.command("write")
	.description("Write an entry to your diary")
	.action(() => {
		writeFunction()
	});

async function writeFunction() {
	const title = await writeTitle();
	const body = await writeBody();
	const labels = await writeLabels();
	const uuid = uuidv4();

	// Create a json object with title, body, labels, and uuid
	const object = {
		"uuid": uuid,
		"title": title,
		"body": body,
		"labels": labels,
	};
	console.log(object);
}

async function writeTitle() {
	const answers = await inquirer.prompt({
    name: 'title',
    type: 'input',
    message: 'What is the title?',
    default() {
      return;
    },
  });

	console.log(`The title is ${answers.title}`);
	return answers.title;
}

async function writeBody() {
	const answers = await inquirer.prompt({
		name: 'body',
		type: 'editor',
		message: 'What is the body?',
		default() {
			return;
		},
	});

	console.log(`The body is ${answers.body}`);
	return answers.body;
}

async function writeLabels() {
	const answers = await inquirer.prompt({
		name: 'labels',
		type: 'input',
		message: 'What are the labels?',
		default() {
			return;
		},
	});

	console.log(`The labels are ${answers.labels}`);
	return answers.labels;
}

program.command("read")
	.description("Read entries from your diary")
	.option("-d, --date <date>", "date to read")
	.action((options) => {
		console.log(chalk.red(`This is the read tes operation. This option is ${options.date}`));
	});

program.command("edit")
	.description("Edit an entry to your diary")
	.argument("<uuid>", "uuid of entry to edit")
	.action(() => {
		console.log("This is the edit operation");
	});

program.command("delete")
	.description("Delete an entry from your diary")
	.argument("<uuid>", "uuid of entry to delete")
	.action(() => {
		console.log("This is the delete operation");
	});

program.command("search")
	.description("Search your diary.")
	// .argument("<string>", "string to search")
	.option("-l, --label <label>", "label to search")
	.option("-s, --string <string>", "string to search")
	.action((options) => {
		if (options.label) {
			console.log(`This is the search operation. This label option is ${options.label}`);
		}
		if (options.string) {
			console.log(`This is the search operation. This string option is ${options.string}`);
		}
	});

program.command("config")
	.description("Get and set configuration options.")
	.option("-g, --get <key>", "get configuration")
	.option("-s, --set <key>", "set configuration")
	.action((options) => {
		console.log(options)
		if (options.get) {
			fs.readFile("./config.json", 'utf8', (err, data) => {
				if (err) {
					return console.log(err);
				}
				if (data) {
					const config = JSON.parse(data);
					if (!(config[options.get])) {
						console.log('That config variable cannot be found')
					}
					
					if (config[options.get]) {
						console.log(`${options.get}: ${config[options.get]}`)
					}

				}
			})
			// ToDo: This will have to read from the globally installed config file after npm install -g.
		}
		if (options.set) {
			console.log(`The current date formate is ${options.set}`)
			inquirer.prompt(
				{
					name: 'date',
					type: 'list',
					message: 'What date format would you like to use?',
					choices: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD'],
				}
			)
		}
	}
		
			);

program.parse(process.argv);

// A function that check if a key exists in the config file.
function checkIfKeyExists() {

}
