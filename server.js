const Express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')

const app = Express();

var links = require("./links.json")

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.render("linkCreator")
})

app.post("/newlink", (req, res) => {
    let url = req.body.url;
    let short = req.body.shortname;

    if (short == "") {
        short = generateShortenUrl();
    }

    links[short] = url
    let shortPrint = `http://localhost:3000/link/${short}`
    saveLinks(links);

    res.render('endCreation', {
        url: shortPrint
    })
})

app.get("/link/:shorturl", (req, res) => {
    let shorturl = req.params.shorturl

    if (checkIfDoesntExist(shorturl)) {
        // Le shortener n'est pas renseigné

        res.render('error', {
            err: "Ce shortener n'existe pas. 🙁"
        })
    } else {
        let url = links[shorturl];


        res.redirect(url)
    }

})

function saveLinks(links) {
    fs.writeFileSync("./links.json", JSON.stringify(links))
}

function checkIfDoesntExist(short) {
    return Object.keys(links).indexOf(short) == -1
}

function generateShortenUrl() {
    const shortLength = 16;
    const chars = "AZERTYUIOPQSDFGHJKLMWXCVBNazertyuiopqsdfghjklmwxcvbn1234567890"

    let s = "";
    while (!checkIfDoesntExist(s) && s == "") {
        for (let i = 0; i < shortLength; i++) {
            s += randomChoice(chars);
        }
    }

    return s;
}

function randomChoice(ls) {
    return ls[Math.floor(Math.random() * ls.length)];
}

app.listen(3000, () => {
    console.log("Serveur online sur le port 3000");
})