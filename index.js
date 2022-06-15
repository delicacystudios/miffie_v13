const { Client, Collection } = require('discord.js');
const config = require('./config.js');
const fs = require('fs');
const mongoose = require('mongoose');
const { Manager } = require('erela.js');
const Spotify = require('erela.js-spotify');

const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES'] });

client.commands = new Collection();
client.slashCommands = new Collection();
client.config = config;
client.color = config.color;

// Connect to mongoDB
mongoose.connect(config.db).then((connection) => {
    console.log(`Connected to database: ${connection.connections[0].name}`);
}).catch((error) => {
    console.log(`Unavle to connect to the database. Error : ${error}`);
});

// Lavalink client
client.manager = new Manager({
    nodes: [config.lavalink],
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
    plugins: [
        new Spotify({
            clientID: config.spotifyClientId,
            clientSecret: config.spotifyClientSecret
        })
    ]
});

// Load all events
fs.readdirSync("./events/", (err, files) => {
  if(err) console.log(err)
  let JSevents = files.filter(t => t.split(".").pop() === "js")

  JSevents.forEach(file => {
    let eventN = file.split(".")[0]
    console.log(`Loaded event: ${eventN}.js`)
    let event = require(`./events/${eventN}`)
    client.on(eventN, event.bind(null, client))     
  })
});

// Load all commands
const ascii = require('ascii-table');
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

fs.readdirSync("./commands/").forEach(dir => {
  const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
  for (let file of commands) {
    let pull = require(`./commands/${dir}/${file}`);
    if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(file, '✅');
    } else {
        table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
        continue;
    }
    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
  }
})

client.login(config.token);