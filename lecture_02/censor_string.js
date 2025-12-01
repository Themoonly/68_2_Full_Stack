function censorWorld(sentence, worldToCensor) {
    const regex = new RegExp(worldToCensor, 'gi');
    const cencoredText = sentence.replace(regex, '***');
    return cencoredText;
}

const originalpost = "JavaScript is fun, but sometimes javascript can be tricky.";
const cleanpost = censorWorld(originalpost, "javascript");

console.log(cleanpost); 
// Output: "*** is fun, but sometimes *** can be tricky."