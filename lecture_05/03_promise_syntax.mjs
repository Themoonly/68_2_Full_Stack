let mypromise = new Promise(function(myResolve, myReject){
// producing code (may take some time)
    myResolve(); // when successful
    myReject(); // when error
});

// consuming code (must wait for a fulfilled promise)

mypromise.then(
    function(value){ /*code if successful*/ },
    function(error){ /*code if some error*/ }
);