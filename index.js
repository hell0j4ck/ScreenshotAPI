const express = require('express')
const path = require('path');
const axios = require('axios')
const app = express()
const puppeteer = require('puppeteer-extra')
const pluginStealth = require('puppeteer-extra-plugin-stealth') 
const {executablePath} = require('puppeteer'); 
const { v4: uuid } = require('uuid');
const fs = require('fs')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set("view engine", "ejs");
app.set('views', __dirname + '/views')
app.set('pdfs', __dirname + '/pdfs')


app.listen(port = '3001', () => {

    console.log(`Listening on port ${port}...`)
})


app.get('/', (req, res) => {


    res.send("API Working. Please use instructions.")

})



// app.get('/form', (req, res) => {


//     res.render('form.ejs')

// })


app.get('/pdf', async (req, res) => {

    // USE req.query to post url as query string
    // USE req.body to post the url in the request body from form
    console.log('RECEIVED SOMETHING!')
    console.log(req.body)
    console.log(req.query)
    
    const { url } = req.query
    console.log(url)

    // Use stealth 
    puppeteer.use(pluginStealth()) 

    // Creates browser instance 
    const browser = await puppeteer.launch({headless:"new"});

    // Creates page instance
    const page = await browser.newPage();


    page.setDefaultNavigationTimeout(300000)

    // If Link is not valid, it will redirect to the form submission via the catch 
    try {

        // Goes to URL and establishes page
        await page.goto(url, { waitUntil: 'networkidle0' });

         

        await page.emulateMediaType('screen');


        // Generates a unique ID for the PDF 
        const fileId = uuid()
        const fileName = `result-${fileId}.pdf`



        // Prints to PDF and saves under PATH
        const pdf = await page.pdf({
            path: `./pdfs/result-${fileId}.pdf`,
            margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
            printBackground: true,
            format: 'A4',
        });

      
        
        // Closes the browser session

        await browser.close();

        // res.send("HELLO!")
        res.sendFile(path.join(__dirname, `/pdfs/${fileName}`));


        // res.render('result.ejs', { fileId, fileName })   
        

        
        // This uses the Filesystem module to delete the generated file after 10 seconds AFTER sending to the client
        // This prevents the server from being overloaded with thousands of unwanted files
        setTimeout(()=>{

            fs.unlink(path.join(__dirname, `/pdfs/${fileName}`), function (err) {
                if (err) throw err;
                console.log(`File deleted!`);
              });

        },10000)


    } catch (e) {

        
        console.log('There Seems To Be An Error: ' + e)
        res.sendFile(path.join(__dirname, `/pdfs/default.pdf`));




    }




})


app.get('/screenshot', async (req, res) => {

    // USE req.query to post url as query string
    // USE req.body to post the url in the request body from form
    console.log('RECEIVED SOMETHING!')
    console.log(req.body)
    console.log(req.query)
    
    const { url } = req.query
    console.log(url)

    // Use stealth 
    puppeteer.use(pluginStealth()) 

    // Creates browser instance 
    const browser = await puppeteer.launch({headless:"new"});

    // Creates page instance
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(300000)

    // If Link is not valid, it will redirect to the form submission via the catch 
    try {

        // Goes to URL and establishes page
        await page.goto(url, { waitUntil: 'networkidle0' });


        await page.emulateMediaType('screen');


        // Generates a unique ID for the PDF 
        const fileId = uuid()
        const fileName = `result-${fileId}.png`




        // Takes a Screenshot and saves under PATH
        await page.screenshot({
            "type": "png", // can also be "jpeg" or "webp" (recommended)
            "path": `./screenshots/result-${fileId}.png`,  // where to save it
            "fullPage": true,  // will scroll down to capture everything if true
        });


        
        // Closes the browser session

        await browser.close();

      
        res.sendFile(path.join(__dirname, `/screenshots/${fileName}`));


        // This uses the Filesystem module to delete the generated file after 10 seconds AFTER sending to the client
        // This prevents the server from being overloaded with thousands of unwanted files
        setTimeout(()=>{

            fs.unlink(path.join(__dirname, `/screenshots/${fileName}`), function (err) {
                if (err) throw err;
                console.log(`File deleted!`);
              });

        },10000)

        


    }catch(e) {

        console.log('There Seems To Be An Error: ' + e)
        res.sendFile(path.join(__dirname, `/pdfs/default.pdf`));




    }




})

// NOT REQUIRED FOR API
app.get('/fetchPdf', (req, res) => {

    const { fileName } = req.query
    console.log(req.query)
    res.sendFile(path.join(__dirname, `/pdfs/${fileName}`));

})




