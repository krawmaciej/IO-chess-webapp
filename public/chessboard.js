var board = [];
var move_now;
var switcher = "";

function init() {

    for (var i = 0; i < 8; i++)
        board[i] = [];

    //BLACK
    for (var j = 0; j < 8; j++)
        board[1][j] = "&#9823"; //pawns
    board[0][0] = board[0][7] = "&#9820"; //rook
    board[0][1] = board[0][6] = "&#9822"; //knight
    board[0][2] = board[0][5] = "&#9821"; //bishop
    board[0][3] = "&#9819"; //queen
    board[0][4] = "&#9818"; //king

    //WHITE
    for (var j = 0; j < 8; j++)
        board[6][j] = "<div style='color:white;'>&#9823</div>"; //pawns
    board[7][0] = board[7][7] = "<div style='color:white;'>&#9820</div>"; //rook
    board[7][1] = board[7][6] = "<div style='color:white;'>&#9822</div>"; //knight
    board[7][2] = board[7][5] = "<div style='color:white;'>&#9821</div>"; //bishop
    board[7][3] = "<div style='color:white;'>&#9819</div>"; //queen
    board[7][4] = "<div style='color:white;'>&#9818</div>"; //king

    for (var i = 2; i < 6; i++) //blanks
        for (var j = 0; j < 8; j++)
            board[i][j] = "";

    function draw() {
        var area = document.getElementById("area");
        var c = 0;
        for (var i = 0; i < 8; i++) {
            c++;
            for (var j = 0; j < 8; j++) {
                if (c % 2 == 0) {
                    area.innerHTML += "<div id='" + i + "_" + j + "' onclick='move(this)' style='float:left; font-size:80px; display:flex; align-items:center; justify-content:center; background:grey; width:100px; height:100px;'>" + board[i][j] + "</div>"
                }
                else {
                    area.innerHTML += "<div id='" + i + "_" + j + "' onclick='move(this)' style='float:left; font-size:80px; display:flex; align-items:center; justify-content:center; background:#333; width:100px; height:100px;'>" + board[i][j] + "</div>"
                }
                c++;
            }
            area.innerHTML += "<br/>"
        }
    }
    draw();
}

function move(e) {
    var pos = e.id.split("_"); //id i_j

    if (switcher == "") { //blank checked
        move_now = board[pos[0]][pos[1]];
        board[pos[0]][pos[1]] = "";
        e.style.background = "magenta"; //active figure
        switcher = "1";
    }
    else { //figure checked
        var area = document.getElementById("area");
        area.innerHTML = ""; // new area
        board[pos[0]][pos[1]] = move_now;

        var c = 0;
        for (var i = 0; i < 8; i++) {
            c++;
            for (var j = 0; j < 8; j++) {
                if (c % 2 == 0) {
                    area.innerHTML += "<div onclick='move(this)' id='" + i + "_" + j + "' style='float:left; font-size:80px; display:flex; align-items:center; justify-content:center; background:grey; width:100px; height:100px;'>" + board[i][j] + "</div>"
                }
                else {
                    area.innerHTML += "<div id='" + i + "_" + j + "' onclick='move(this)' style='float:left; font-size:80px; display:flex; align-items:center; justify-content:center; background:#333; width:100px; height:100px;'>" + board[i][j] + "</div>"
                }
                c++;
            }
            area.innerHTML += "<br/>"
        }
        switcher = "";
    }
}