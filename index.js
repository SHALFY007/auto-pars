import puppeteer from "puppeteer";
import fs from 'fs'

const URL = "https://auto.ru/volgograd/cars/ford/all/?page=";

(async () => {
    let flag = true
    let counter = 1
    let res = []

    try {
        let browser = await puppeteer.launch({
            headless: false,
            slowMo: 100,
            devtools: true
        })

        let page = await browser.newPage()

        await page.setViewport({
            width: 1440, height: 900
        })

        while(flag) {
            await page.goto(`${URL}${counter}`)
            await page.waitForSelector('img.LazyImage__image')

            setTimeout(() => {

            }, 2000)

            let html = await page.evaluate(async () => {
                let page = [];

                try {
                    let divs = document.querySelectorAll('div.ListingItem__main')

                    divs.forEach(div => {
                        let obj = {
                            title: div.querySelector('a.ListingItemTitle__link').innerText !== null ?
                            div.querySelector('a.ListingItemTitle__link').innerText : 'NO TITLE',
                            link: div.querySelector('a.ListingItemTitle__link').href !== null ?
                            div.querySelector('a.ListingItemTitle__link').href : 'NO LINK',
                            price: div.querySelector('a.ListingItemPriceNew__link-cYuLr').innerText !== null ?
                            div.querySelector('a.ListingItemPriceNew__link-cYuLr').innerText : 'NO PRICE',
                            year: div.querySelector('div.ListingItem__year').innerText !== null ?
                            div.querySelector('div.ListingItem__year').innerText : "NO YEAR",
                            kmAge: div.querySelector('div.ListingItem__kmAge').innerText !== null ?
                            div.querySelector('div.ListingItem__kmAge').innerText : "NO kmAge"
                        }

                        console.log(obj)
                        page.push(obj)
                    })
                    
                } catch (error) {
                    console.log(error)
                }

                return page

            }, {waitUntil: 'a.ListingPagination__page'})

            await res.push(html)

            for (let i in res) {
                console.log(res[i])
            }

            if (counter === 4) flag = false

            counter++
        }

        res = res.flat()

        fs.writeFile('auto.json', JSON.stringify({'data': res}), err => {
            if (err) throw err

            console.log("JSON saved")
            console.log("JSON length- " + res.length) 
        })
        
    } catch (error) {
        console.log(error)
    }

})()