const prompt = require('prompt');
const { fetchData, getLeader } = require("./helper")

const [, , leaderboard] = process.argv;
if(leaderboard) {
  getLeader();
  return;
} else {
  prompt.start();

  prompt.get(['searchTerm'], (err, result) => {
    if (err) throw err;

    const {searchTerm} = result;
    if(searchTerm) {
      fetchData(searchTerm)
      return;
    } else {
      console.log("You need to add a search term");
    }
  });
}


