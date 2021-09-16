const prompt = require('prompt-sync')();
const log4js = require('log4js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const logger = log4js.getLogger('APP_LOG');
logger.level = "debug";

startCrawler();

async function startCrawler(){
  const url = prompt('請輸入指定巴哈勇者小屋的網址:');

  if(url === ''){
    logger.error('你必須輸入巴哈勇者小屋的網址，否則爬蟲將無法運行。');
    process.exit(1);
  }

  logger.info('開始爬蟲...');

  const articles = [];

  const firstPageContent = await getContent(url);
  let contentList = await getContentList([], firstPageContent);
  const pagesNum = parseInt(getPagesNum(firstPageContent));

  //Get other listing page content
  for(let i = 2; i <= pagesNum; i++){
    const pageUrl = `${url}&page=${i}`;
    const pageContent = await getContent(pageUrl);
    contentList = await getContentList(contentList, pageContent);
  }

  //Get article page content
  for(let i = 0; i <= contentList.length; i++){
    const pageUrl = contentList[i];
    if(pageUrl){
      const pageContent = await getContent(pageUrl);
      const article = getArticle(pageContent);
      fs.writeFileSync(`./article/${article.title}.html`, article.content);
    }
  }
}

function cleanText(text){
  const cleanText = text.replace('\/', '')
  .trim();
  return cleanText;
}

function getArticle(html){
  $ = cheerio.load(html);
  const title = cleanText($('.TS1').text());
  const content = $('.MSG-list8C').html();
  const article = {
    title,
    content,
  };
  return article;
}

function getPagesNum(html){
  $ = cheerio.load(html);
  const pageNum = $('#BH-pagebtn .BH-pagebtnA a:last-child').text();
  return pageNum;
}

function getContentList(contentLinks, html){
  let links = contentLinks;
  return new Promise(function(resolve, reject) {
    $ = cheerio.load(html);
    const contents = $('.HOME-mainbox1 .BH-txtmore');
    contents.each(function(index){
      let link = $(this).attr('href');
      link = 'https://home.gamer.com.tw/'+ link;
      links.push(link);
    });
    resolve(links);
  });
}

async function getContent(url){
  const response = await fetch(url);
  const html = await response.text();
  return html;
}
