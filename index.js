const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs');
app.use(cors())

const url = 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices.html'

app.get('/', function (req, res) {
    res.json('This is my webscraper')
})

app.get('/results', (req, res) => {
    axios(url)
        .then(response => {
            res.setHeader("Content-Type", "text/html")
            const html = response.data
            const $ = cheerio.load(html)
            const articles = []
            let aHtmls = '';
            $('a', html).each((aIndex, a) => { //<-- cannot be a function expression
                const text = $(a).text().toLowerCase();
                if (text.includes('notice') 
                    && (text.includes('interest to sponsor') || text.includes('parents and grandparents'))) {
                    var href = $(a).attr('href');
                    aHtmls = aHtmls.concat(`<li><a href='http://www.canada.ca${href}'>${text}</a></li>`);
                }
            })
            var saved = '';
            fs.readFile('output.txt', 'utf8', (err, data) => {
                if (err) {
                  console.error(err);
                  return;
                }
                saved = data;
            });
            if (saved !== aHtmls) {
                var writer = fs.createWriteStream('output.txt');
                    response = {
                    name: '',
                    id: ''
                    }
                writer.write(aHtmls);
            }
            res.end(aHtmls);
        }).catch(err => console.log(err))

})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

