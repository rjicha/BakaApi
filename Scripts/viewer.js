$(window).on("load", function() {
    console.log("loading...");
    loadAvailableDays();
    
    $(document).on("click", "a[data-date]", showDay);
});

function showDay() {
    $("#SuplPanel").empty();
    var seletedDate = $(this).data("date");
    
    $.getJSON(apiAddress + "schedulechanges/" + seletedDate, function(data) {
        showData(data);
    });
}
