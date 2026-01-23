longRunningOperation(() => {
    anotherLongRunningOperation(()=>{
        yetAnother(()=>{
            oneMore(()=>{
                lastone(()=>{
                    console.log('where are we?');
                });
            });
        })
    })
});