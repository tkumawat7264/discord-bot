const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const User = require('../../model/User.model')

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('create-user')
      .setDescription('create a user in database.')
      .addStringOption((option) =>
        option
          .setName('firstname')
          .setRequired(true)
          .setDescription('Set your username'),
      )
      .addStringOption((option) =>
        option
          .setName('lastname')
          .setRequired(true)
          .setDescription('Set your username'),
      ),
    async execute(interaction) {
      // interaction.user is the object representing the User who ran the command
      // interaction.member is the GuildMember object, which represents the user in the specific guild
      const firstName = interaction.options.getString('firstname')
      const lastName = interaction.options.getString('lastname')
      try {
        await User.create({ firstName: firstName, lastName: lastName })
        await interaction.reply({
          content: `The following user was created firstname ${firstName} and lastname ${lastName}.`,
          ephemeral: true,
        }) // this message will only visible to person to executes the command
      } catch (err) {
        await interaction.reply({
          content: `error occurred while creating user.`,
          ephemeral: true,
        })
      }
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('user-details')
      .setDescription('create a user in database.'),
    async execute(interaction) {
      try {
        // [{name:id ,value:id}]
        const users = await User.findAll()
        // const userArr = users.map((user) => {
        //   return {
        //     name: 'name',
        //     value: user.dataValues.firstName,
        //     inline: true,
        //   }
        // })
        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle('User Details')
          .setDescription('Users stored in DB are listed below')
          .addFields({
            name: 'ID',
            value: users.map((user) => user.dataValues.id).join('\n'),
            inline: true,
          })
          .addFields({
            name: 'First name',
            value: users.map((user) => user.dataValues.firstName).join('\n'),
            inline: true,
          })
          .addFields({
            name: 'Last name',
            value: users.map((user) => user.dataValues.lastName).join('\n'),
            inline: true,
          })
          .setTimestamp()

        await interaction.reply({ embeds: [embed] })
      } catch (err) {
        console.log(err)
        await interaction.reply({
          content: 'Error occurred while returning user',
        })
      }
    },
  },
]
