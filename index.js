const fs = require('fs');
const Mustache = require('mustache');
const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
const plot = fs.readFileSync("./story/plot.md", "utf-8");
const notes = fs.readFileSync("./story/notes.md", "utf-8");
const story = data.story;
story.plot = plot;
story.notes = notes;
// 1. Hash-style access remains as is (characters.hero)
const characters = data.characters;
// 2. Add array version with roles injected
const charArray = Object.entries(characters).map(([role, info]) => ({
	role,
	...info
}));
// 3. Combine both into the render context
let renderData = {
	characters,   // access via characters.role
	story,
	charArray     // access via loop
};
// Load template
const template = fs.readFileSync('./input.md', 'utf-8');
// Render & tweak
renderData.story.title = "Story";
renderData.story.plot = Mustache.render(renderData.story.plot, renderData);
renderData.story.notes = Mustache.render(renderData.story.notes, renderData);
let mdRender = Mustache.render(template, renderData);
mdRender = mdRender
	.replace(/## (.+?)\s*\1/gi, "")
	.replace(/&gt;/g, ">")
	.replace(/&lt;/g, "<")
	.replace(/&#39;/g, "'")
	.replace(/^# _"(Story)"_/gm, "# $1")
	.replace(/<!--[\s\S]*-->/g, "")
	.replace(/^\s*/g, "")
	.replace(/\s*$/g, "");
// Write final render
function writeToFile(file, content) {
	fs.writeFile(file, content, (err) => {
		if (err) {
			return console.error(`Something went wrong when writing to ${file}: `, err);
		};
		//console.log(`Content successfully written to ${file}`);
		//console.log(content);
	})
};
writeToFile("output.md", mdRender);