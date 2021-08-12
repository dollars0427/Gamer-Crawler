const prompt = require('prompt-sync')();
const log4js = require('log4js');
const fetch = require('node-fetch');

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

  const firstPageContent = await getContent(url);
}

async function getPages(html){

}

async function getContent(url){
  const response = await fetch(url);
  const html = await response.text();
  return html;
}
