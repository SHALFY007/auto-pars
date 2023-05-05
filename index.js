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
            await page.waitForSelector('a.ListingPagination__page')

            let html = await page.evaluate(async () => {

            }, {waitUntil: 'a.ListingPagination__page'})
        }
        
    } catch (error) {
        console.log(error)
    }

})()