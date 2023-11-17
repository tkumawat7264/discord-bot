const {
  Client,
  GatewayIntentBits,
  MessageActionRow,
  MessageButton,
  Events,
  REST,
  Routes,
  Collection,
} = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const dotenv = require('dotenv')
const sequelize = require('./db/database')
const User = require('./model/User.model')
dotenv.config()
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})
client.commands = new Collection()
const commands = []
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const commandModule = require(filePath)

    if (Array.isArray(commandModule)) {
      // If the module exports an array, flatten it into the commands array
      // console.log(commandModule.data.name)
      // client.commands.set(commandModule.data.name, commandModule)
      commands.push(
        ...commandModule.map((cmd) => {
          client.commands.set(cmd.data.name, cmd)
          return cmd.data.toJSON()
        }),
      )
    } else if ('data' in commandModule && 'execute' in commandModule) {
      // If the module exports a single command object
      client.commands.set(commandModule.data.name, commandModule)
      commands.push(commandModule.data.toJSON())
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      )
    }
  }
}
// events files
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event = require(filePath)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN)

// and deploy your commands!
;(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    )

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID,
      ),
      { body: commands },
    )

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    )
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()

client.on('messageCreate', async (message) => {
  if (message.content === '!showButtons') {
    // Send a message with buttons
    await message.channel.send({
      content: 'This is a message with components',
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Click me!',
              style: 1,
              custom_id: 'sendProductsDetail',
            },
          ],
        },
      ],
    })
  } else if (message.content === '!select') {
    await message.channel.send({
      content:
        'Mason is looking for new arena partners. What classes do you play?',
      components: [
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: 'class_select_1',
              options: [
                {
                  label: 'Rogue',
                  value: 'rogue',
                  description: 'Sneak n stab',
                  emoji: {
                    name: 'rogue',
                    id: '625891304148303894',
                  },
                },
                {
                  label: 'Mage',
                  value: 'mage',
                  description: "Turn 'em into a sheep",
                  emoji: {
                    name: 'mage',
                    id: '625891304081063986',
                  },
                },
                {
                  label: 'Priest',
                  value: 'priest',
                  description: "You get heals when I'm done doing damage",
                  emoji: {
                    name: 'priest',
                    id: '625891303795982337',
                  },
                },
              ],
              placeholder: 'Choose a class',
              min_values: 1,
              max_values: 3,
            },
          ],
        },
      ],
    })
  } else if (message.content === '!text-model') {
    await message.channel.send({
      title: 'My Cool Modal',
      custom_id: 'cool_modal',
      components: [
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'name',
              label: 'Name',
              style: 1,
              min_length: 1,
              max_length: 4000,
              placeholder: 'John',
              required: true,
            },
          ],
        },
      ],
    })
  }
})
// Handle button interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return

  // Handle different button custom IDs
  if (interaction.customId === 'sendProductsDetail') {
    // Execute a command or send a list of products
    // Replace the following line with your own logic
    console.log(interaction)
    await interaction.reply(
      `${interaction.customId} - ${interaction.user.username}`,
    )
  }
})

client.login(process.env.DISCORD_TOKEN)

sequelize
  .sync()
  .then(() => {
    console.log('connection  established')
  })
  .catch((err) => {
    console.log(err)
  })
