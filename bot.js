const Discord = require("discord.js")
const fetch = require("node-fetch")
const client = new Discord.Client()

var TokenDiscord = require('./auth.json').Token;
var TokenYoutube = require('./auth.json').TokenYTB;

const fs = require('fs');


// retorna o videoId do video mais recente
function getChannel() {
  return fetch("https://www.googleapis.com/youtube/v3/search?key=" + TokenYoutube + "&channelId=UCaL32Y9GfMDYAGt8gGel60w&part=snippet,id&order=date&maxResults=1")
    .then(res => {
      return res.json()
      })
    .then(data => {
      id = [];
      //console.log(data)

      data.items.forEach(item => {
        id.push(item.id.videoId)
      });

      return id.toString();

    })
};

// retorna os videoIds dos 8 videos mais recentes
function getChannel8() {
  return fetch("https://www.googleapis.com/youtube/v3/search?key=" + TokenYoutube + "&channelId=UCaL32Y9GfMDYAGt8gGel60w&part=snippet,id&order=date&maxResults=8")
    .then(res => {
      return res.json()
      })
    .then(data => {
      id = [];


      data.items.forEach(item => {
        id.push(item.id.videoId)
      });

      //console.log(id)
      return id;

    })
};

// processa getChannel8 e retorna titulo e viewCount
function getYTBvideos() {
  return getChannel8().then(data => {
    //console.log(data)

    titles = [];

    data.forEach(item => {
      fetch("https://www.googleapis.com/youtube/v3/videos?key=" + TokenYoutube + "&id="+ item + "&part=statistics&part=snippet")
        .then(res => {
          return res.json()
        })
        .then(data => {
          //console.log(data)

          data.items.forEach(item => {
            console.log(item.snippet.title)
            console.log(item.statistics.viewCount)

            titles.push(item.snippet.title)
            titles.push(item.statistics.viewCount)
          });

          //console.log(titles)
          // const dataJs = JSON.stringify(titles);
          // fs.writeFile('./videos.json', dataJs, err => {
          //   if (err) {
          //       console.log('Error writing file', err)
          //   } else {
          //       console.log('Successfully wrote file')
          //   }
          // })
      });
    })

    console.log(titles)




  });

}

// processa getChannel e retorna titulo e viewCount do video mais recente
function getYTB() {
  return getChannel().then(data => {

    return fetch("https://www.googleapis.com/youtube/v3/videos?key=" + TokenYoutube + "&id="+ data + "&part=statistics&part=snippet")
      .then(res => {
        return res.json()
      })
      .then(data => {

        titles = [];
        data.items.forEach(item => {
          //console.log(item.snippet.title)
          //console.log(item.statistics.viewCount)
          titles.push(item.snippet.title)
          titles.push(item.statistics.viewCount)

        });

        //console.log(titles)
        return titles;
    });
  });

}

// obtem quote
function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
      })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

// obtem todos os movimentos de um pokemon
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

    getYTBvideos().then(quote => console.log(quote))
})

client.on("message", msg => {
  if (msg.author.bot) return

  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }
})

client.on("message", msg => {
  if (msg.author.bot) return

  if (msg.content === "$video") {
    // getYTB().then(quote => {
    //   msg.channel.send(quote[0]);
    //   msg.channel.send('Views: ' + quote[1]);
    // })
    var myFunc01 = function() {
      var i = 0;
      while (i < 10) {
        (function(i) {
          setTimeout(function() {
            getYTB().then(quote => {
              msg.channel.send(quote[0]);
              msg.channel.send('Views: ' + quote[1]);
            })
          }, 5000 * i)
        })(i++)
      }
    };

    myFunc01();
  }
})

client.on("message", msg => {
    if (msg.content === "$help") {
      msg.reply("the commands avaiable are:");
      msg.reply("1. $inspire \n2.$pokemon");
    }
})

client.on("message", msg => {
  if (msg.content === "$elric") {
    msg.channel.send("isnt this mdfck pretty?", {files: ["./images/elric.png"]});
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
