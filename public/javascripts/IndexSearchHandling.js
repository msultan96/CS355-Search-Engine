var submitID =$("#SUBMIT-ID");

submitID.click(function(){
    crawler.queryCrawler(submitID.val);
});

