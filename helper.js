const fs = require("fs");
const request = require("request");

const getRandom = (arr) => {
  const indexEl = Math.floor(Math.random() * 10);
  const findRes = arr.find((el, index) => index === indexEl);
  if (findRes === undefined || findRes === -1) {
    return arr[0];
  } else {
    return findRes;
  }
};

const getLeader = () => {
  if (fs.existsSync("./jokes.txt")) {
        fs.readFile(`${__dirname}/jokes.txt`, (err, content) => {
          if (err) throw err;
          const jokes = JSON.parse(content);
          const leader = jokes.sort((a, b) => b.count - a.count)[0]
          console.log(`
          The highest searched joke is 
          ****${leader.joke}**** 
          with **${leader.count}** searches
            `);
          return;
        })
      } else {
        console.log("Sorry, No jokes yet");
        return;
      }
}
const fetchData = (term) => {
  const option = {
    url: `https://icanhazdadjoke.com/search?term=${term}&limit=10`,
    headers: {
      Accept: "application/json",
    },
  };
  request.get(option, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      const { results } = data;
      if (results.length === 0) {
        console.log(
          "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        );
        console.log("Sorry, no jokes were found for the search term");
        console.log(
          "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        );
        return;
      }
      const joke = getRandom(results);
      console.log(
          "+++++++++++++++++++++Your Jokes+++++++++++++++++++++++++++++++++++++++"
        );
        console.log(joke.joke);
        console.log(
            "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
          );
      if (fs.existsSync("./jokes.txt")) {
        fs.readFile(`${__dirname}/jokes.txt`, (err, content) => {
          if (err) throw err;
          const dag = JSON.parse(content);
          const exist = dag.findIndex((item) => item.id === joke.id);
          if (exist !== -1) {
            dag.forEach((item) => {
              if (item.id === joke.id) {
                item.count++;
              }
              fs.writeFile("jokes.txt", JSON.stringify(dag), (err) => {
                if (err) throw err;
                console.log("joke added to file successfully");
              });
            });
          } else {
            dag.push({
              id: joke.id,
              joke: joke.joke,
              count: 1,
            });
            fs.writeFile("jokes.txt", JSON.stringify(dag), (err) => {
              if (err) throw err;
              console.log("joke added to file successfully");
            });
          }
        });
      } else {
        const jokes = [];
        jokes.push({
          id: joke.id,
          joke: joke.joke,
          count: 1,
        });
        fs.writeFile("jokes.txt", JSON.stringify(jokes), (err) => {
          if (err) throw err;
          console.log("joke added to file successfully");
        });
      }
    }
  });
};

module.exports = {
  getLeader,
  fetchData
}