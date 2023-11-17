const { SlashCommandBuilder, ChannelType } = require('discord.js')
// const wait = require('node:timers/promises').setTimeout

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .addStringOption((option) =>
      option
        .setName('username')
        .setRequired(true)
        .setDescription('Set your username'),
    )

    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('The gif category')
        .setRequired(true)
        .addChoices(
          { name: 'Funny', value: 'gif_funny' },
          { name: 'Meme', value: 'gif_meme' },
          { name: 'Movie', value: 'gif_movie' },
        ),
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to echo into')
        // Ensure the user can only select a TextChannel for output
        .addChannelTypes(ChannelType.GuildText),
    )
    .addBooleanOption((option) =>
      option
        .setName('ephemeral')
        .setDescription('Whether or not the echo should be ephemeral'),
    ),
  // .addSubcommand((subcommand) =>
  //   subcommand
  //     .setName('user')
  //     .setDescription('Info about a user')
  //     .addUserOption((option) =>
  //       option.setName('target').setDescription('The user'),
  //     ),
  // ),
  async execute(interaction) {
    // await interaction.deferReply()
    // await wait(4000)
    // await interaction.editReply('Pong!')
    // await interaction.reply('Pong!')
    // await interaction.followUp('Pong again!');
    // await interaction.deleteReply()
    // const message = await interaction.fetchReply();
    const userInput = interaction.options.getString('username')
    const gifCategory = interaction.options.getString('category')
    console.log(interaction.options)
    await interaction.reply(
      `The username you choose ${userInput} and gif category you selected ${gifCategory}`,
    )
  },
}
