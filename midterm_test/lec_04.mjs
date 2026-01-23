function censorword(sentence,word){
    const regex = new RegExp (word, 'gi');
    const censortext = sentence.replace(regex,'****');
    return censortext;
}

const original = "Javascript is fun but something javascript can be tricky"

const cleanPost = censorword(original, "Javascript");

console.log(cleanPost)
// **** is fun but something **** can be tricky