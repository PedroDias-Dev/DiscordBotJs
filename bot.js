const Discord = require("discord.js")
const fetch = require("node-fetch")
const client = new Discord.Client()

var TokenDiscord = require('./auth.json').Token;

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
      })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

function getPokemon(pokemon){
    return fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon)
      .then(res => {return res.json()})
      .then(data => {
          movesReturn = [];

          data.moves.forEach(item => {
              //console.log(item.move.name)
              movesReturn.push(item.move.name)
          });

          // console.log(movesReturn)
          return movesReturn;
      })
}


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on("message", msg => {
  if (msg.author.bot) return
    
  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }
})

client.on("message", msg => {
    if (msg.content === "$help") {
      msg.reply("the commands avaiable are:");
      msg.reply("1. $inspire \n2.$pokemon");
    }
})

client.on("message", msg => {
    if (msg.author.bot) return
      
    if (msg.content.startsWith("$pokemon")) {
        let pokemon = msg.content.split('$pokemon ')[1];
        

        var order = 1;
        getPokemon(pokemon).then(moves => {
          msg.channel.send(pokemon + ' has ' + moves.length + ' move(s) in total.')
          msg.channel.send('his move(s) are:')

          moves.forEach(item => {
            msg.channel.send(order + '. ' + item);

            order = order + 1;
          });  
        }) //.catch(err => msg.channel.send('there was an error, or the pokemon u your looking for does not exist. [ERROR: ' + err + ' ]'))
        .catch(err => msg.channel.send('there was an error, or the pokemon u your looking for does not exist.'))

    }
  })



client.login(TokenDiscord);
