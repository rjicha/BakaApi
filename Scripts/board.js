$(window).on("load", function() { 
    loadChanges();

    $("footer").html("Poslední aktualizace: " + new Date().toLocaleTimeString("cs-CZ"));
    setInterval("location.reload()", 1800000);
});

function slideshow(currentTable, tablesCount) {
    if (currentTable > tablesCount) 
        currentTable = 1;

    fade(1000, currentTable);   
    
    if (tablesCount > 1)
        setTimeout(function() { slideshow(currentTable + 1, tablesCount)}, reload);
};

function fade(speed, currentItem) {
    $("table").fadeOut(speed);
    $("#table" + currentItem).fadeIn(speed);
}

function loadAvailableDays() {
    $.getJSON(apiAddress + "schedulechangedays", function(data) {
        var items = [];

        $.each(data, function(key, day) {
            items.push("<li><a href='#' data-date='" + day.BakaDateString + "'>" + new Date(day.Date).toLocaleDateString() + "</a></li>");
        });

        $("<ul/>", { html: items.join("") }).appendTo("#availableChangeDays");
    });
}

function loadChanges() {
    $.getJSON(apiAddress + "schedulechanges", function(data) {
        $("h1").html('Suplování na ' + new Date(data.Date).toLocaleDateString("cs-CZ"));

        showData(data);

        var tables = $("table");
        $.each(tables, function(index, table) {
            $(table).attr("id", "table" + (index + 1));
            $(table).prepend('<tr><td class="tbl-counter" colspan="5">' + (index + 1) + '/' + tables.length + '</td></tr>');
        });

        $(tables).hide();
        slideshow(1, tables.length);
    });
}

function showData(data) {
    var clsGroups = data.Changes;
    var usedRows = 0;
    var classes = [];

    $.each(clsGroups, function(cls, changes) {
        if (usedRows + changes.length >= maxRows) {
            createTable(classes);
            usedRows = 0;
            classes = [];
        }

        classes.push(createClass(cls, changes));
        usedRows += changes.length;
    });

    if (classes.length > 0) {
        createTable(classes);
    }
}

function createTable(classes) {
    $("<table />", { html: classes.join(""), class: "table" }).appendTo("#SuplPanel");
}

var cCounter = 0;
function createClass(cls, changes) {
    var trCssClass = "color" + ((++cCounter % 3) + 1); 

    var row = '<tr class="' + trCssClass + '"><td rowspan="' + changes.length + '">' + cls + '</td>';
    row += createChange(changes[0]);
    row += '</tr>';

    for(i = 1; i < changes.length; i++) {
        row += '<tr class="' + trCssClass + '">';
        row += createChange(changes[i]);
        row += '</tr>';
    }

    return row;
}

function createChange(change) {
    if(change.Type == 0) {
        return "<td>" + change.Hour + "</td>" +
            "<td>" + change.Course + " (" + change.Group + ")</td>" +
            "<td>" + change.Action + " " + change.Teacher + "</td>" +
            "<td>" + change.Room + "</td>";
    } else {
        return "<td>" + change.Class + "</td>" +
            "<td colspan='3'>" + change.Description + "</td>";
    }
}