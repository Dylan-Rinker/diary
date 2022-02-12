#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs";
import inquirer from 'inquirer';
// inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
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
	const entry = {
		"uuid": uuid,
		"title": title,
		"body": body,
		"labels": labels,
		"created": new Date(),
		"updated": new Date(),
	};

	writeEntry(entry);
}

function writeEntry(entry) {
	const db = fs.readFileSync("./database.json", "utf8");
	console.log(JSON.parse(db));

	let newDB = JSON.parse(db);
	
	newDB.entries.push(entry) // How to I do this immutably?
	
	fs.writeFileSync("./database.json", JSON.stringify(newDB));
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
	.option("-l, --label <label>", "label to read")
	.option("-s, --search", "search entry to read")
	.option("-u, --uuid <uuid>", "uuid to read")
	.action((options) => {
		console.log(`Options: ${options}`);

		if (isOptionsEmpty(options)) {
			readDiary();
		}

		if (options.search) {
			listEntries();
			console.log('This is the options search.')
		}
	});

function readDiary(quantity) {
	const db = fs.readFile("./database.json", "utf8", (err, data) => {
		if (err) {
			console.log(err);
			return
		};

		if (data) {
			let db = JSON.parse(data);
			let entries = db.entries
			console.log(entries)
			console.log(entries.length)
			console.log(entries[0])
			console.log(entries.reverse().slice(0,10))
			
			return entries
		}

		console.log(chalk.yellow('No data found'))
	});

}

function listEntries() {
	const entries = returnEntries();
	console.log(`entries: ${entries}`);
	let formattedEntries = formatEntries(entries);
	console.log(`formattedEntries: ${formattedEntries}`);
	// const answers = await inquirer.prompt({
	// 	type: "list",
	// 	name: "entry",
	// 	message: "Which entry do you want to read?",
	// 	choices: formattedEntries,
	// });

	// console.log(answers);
}

function formatEntries(entries) {
	let formattedEntries = entries.map(entry => {
		return `${entry.title} ${entry.uuid} ${entry.created}`
	});
	return formattedEntries;
}

function isOptionsEmpty(options) {
	if (Object.keys(options).length === 0) {
		return true;
	}
	return false;
}

program.command("edit")
	.description("Edit an entry to your diary")
	.argument("<uuid>", "uuid of entry to edit")
	.action(() => {
		console.log("This is the edit operation");
	});

program.command("delete")
	.description("Delete an entry from your diary")
	.option("-u, --uuid <uuid>", "uuid of entry to delete")
	.action(async (options) => {
		console.log('Options:', options)
		if (Object.keys(options).length === 0) {
			await deletePrompt();
		}

		if (options.uuid) {
			if (!(isUUIDValid(options.uuid))) {
				console.log(chalk.red("The uuid is not valid."));
			}
			else {
				deleteEntry(options.uuid);
			}
		}
	});

function isUUIDValid(uuid) {
	if (!(uuid.length === 12 || uuid.length === 36)) {
		return false
	}
	
	// ToDo: Maybe is UUID in list of UUIDs?
	return true;
}

function deleteEntry(uuid) {
	const db = fs.readFileSync("./database.json", "utf8");
	let newDB = JSON.parse(db);
	
	switch (uuid.length) {
		case 12:
			newDB.entries = newDB.entries.filter(entry => {
				let miniUUID = entry.uuid.split('-')[4]
				return miniUUID !== uuid;
			});
			break;
		case 36:
			console.log('the uuid is 36')
			newDB.entries = newDB.entries.filter(entry => {
				return entry.uuid !== uuid;
			});
			break;
		default:
			console.log('The UUID length is not valid.')
	}

	fs.writeFileSync("./database.json", JSON.stringify(newDB));
}

async function deletePrompt() {
	const entries = returnEntries();
	console.log(`entries: ${entries}`);
	let formattedEntries = formatEntries(entries);

	inquirer.prompt({
		type: "list",
		name: "delete",
		message: "Which entries do you want to delete?",
		choices: formattedEntries,
	}).then(answers => {
		console.log(answers);

		if (answers.delete === "Entry") {
			deleteEntry();
		}
		else if (answers.delete === "Label") {
			deleteLabel();
		}
		else if (answers.delete === "Both") {
			deleteEntry();
			deleteLabel();
		}
	});
}

function returnEntries() {
	let db = fs.readFileSync("./database.json", "utf8")
	let data = JSON.parse(db);
	let entries = data.entries
	console.log(`entries: ${entries}`);
	return entries;
}

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
	.option("-ga, --get-all", "get all configurations")
	.option("-s, --set <key>", "set configuration")
	.action((options) => {
		console.log(options)
		if (options.get) {
			fs.readFileSync("./config.json", 'utf8', (err, data) => {
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
		if (options.getAll) {
			fs.readFileSync("./config.json", 'utf8', (err, data) => {
				if (err) {
					return console.log(err);
				}
				if (data) {
					const config = JSON.parse(data);
					console.log(config)
				}
			})
	}
		if (options.set) {
			console.log(`The current date format is ${options.set}`)
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