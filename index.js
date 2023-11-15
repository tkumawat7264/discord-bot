const {
  Client,
  GatewayIntentBits,
  MessageActionRow,
  MessageButton,
  Events,
} = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!showButtons") {
    // Send a message with buttons
    await message.channel.send({
      content: "This is a message with components",
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Click me!",
              style: 1,
              custom_id: "interactionCreate",
            },
          ],
        },
      ],
    });
  } else if (message.content === "!select") {
    await message.channel.send({
      content:
        "Mason is looking for new arena partners. What classes do you play?",
      components: [
        {
          type: 1,
          components: [
            {
              type: 3,
              custom_id: "class_select_1",
              options: [
                {
                  label: "Rogue",
                  value: "rogue",
                  description: "Sneak n stab",
                  emoji: {
                    name: "rogue",
                    id: "625891304148303894",
                  },
                },
                {
                  label: "Mage",
                  value: "mage",
                  description: "Turn 'em into a sheep",
                  emoji: {
                    name: "mage",
                    id: "625891304081063986",
                  },
                },
                {
                  label: "Priest",
                  value: "priest",
                  description: "You get heals when I'm done doing damage",
                  emoji: {
                    name: "priest",
                    id: "625891303795982337",
                  },
                },
              ],
              placeholder: "Choose a class",
              min_values: 1,
              max_values: 3,
            },
          ],
        },
      ],
    });
  } else if (message.content === "!text-model") {
    await message.channel.send({
      title: "My Cool Modal",
      custom_id: "cool_modal",
      components: [
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: "name",
              label: "Name",
              style: 1,
              min_length: 1,
              max_length: 4000,
              placeholder: "John",
              required: true,
            },
          ],
        },
      ],
    });
  }
});

// Handle button interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // Handle different button custom IDs
  if (interaction.customId === "sendProductsDetail") {
    // Execute a command or send a list of products
    // Replace the following line with your own logic
    await interaction.reply(
      "Here is the list of products: Product A, Product B, Product C"
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
