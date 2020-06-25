//things should be fix 
// 1.   check if it's have a row, if it's , then everything from that row up, will fall down one block (50 px)  (done)
// 2.   check flip, sometime it's not working (fixed)
// 3.   when you reach the top, stop, lose (done)
// 3.5  and score update (done)
// 3.8  update score in the HTML to match the actual score (done)
// 4.   cannot flip if you are overlap other block (done)
// 5.   show future block,  (done)
// 5.5  when moving block left or right under other block, will make it stop moving down and stuck there (done)
// 6.   if you flip fast enough, it will cause bugged (lowest priority) (seem to be fine for now, no problem of this happen)
// 7. add you lose (done)

var store = [];
var currentTetris =  {"type":"O","W": 50, "H": 50, "r": "box" , "W": 50, "H": 50, "x": 200 , "y":-100 , "x2":250 , "y2": -100 , "x3":200 , "y3":-50 , "x4":250 , "y4":-50};
var nextTetris = null;
var score =  0;
let stopMovingForNow = false;
let youLose = false;
/*--score html---*/
let score_7 = document.querySelector(".js-7-number");
let score_6 = document.querySelector(".js-6-number");
let score_5 = document.querySelector(".js-5-number");
let score_4 = document.querySelector(".js-4-number");
let score_3 = document.querySelector(".js-3-number");
let score_2 = document.querySelector(".js-2-number");
let score_1 = document.querySelector(".js-1-number");
/*--array of tetris--*/
var arrayOfTetris = [
    //I has 2 shapes: vertical and straight
    {"type":"I", "r": "vertical" , "W": 50, "H": 50, "x": 200 , "y":-200 , "x2":200 , "y2": -150 , "x3":200 , "y3":-100 , "x4":200 , "y4":-50},
    //O has only 1 shape
    {"type":"O","W": 50, "H": 50, "r": "box" , "W": 50, "H": 50, "x": 200 , "y":-100 , "x2":250 , "y2": -100 , "x3":200 , "y3":-50 , "x4":250 , "y4":-50},
    //T has 4 shapes: face up(normal), face down, face left, face right
    //the face is the 3 sides box
    {"type":"T","W": 50, "H": 50, "r": "face-up" , "W": 50, "H": 50, "x": 200 , "y":-100 , "x2":250 , "y2": -100 , "x3":300 , "y3":-100 , "x4":250 , "y4":-50},
    //J has 4 shapes: face up , face left, face down, face right
    //face is the 4th box
    {"type":"J","W": 50, "H": 50, "r": "face-up" , "W": 50, "H": 50, "x": 200 , "y":-150 , "x2":200 , "y2": -100 , "x3":200 , "y3":-50 , "x4":150 , "y4":-50},
    //L has 4 shapes: face up, face down. face left, face right
    {"type":"L","W": 50, "H": 50, "r": "face-up" , "W": 50, "H": 50, "x": 200 , "y":-150 , "x2":200 , "y2": -100 , "x3":200 , "y3":-50 , "x4":250 , "y4":-50},
    //S has 2 shapes: skew, vertical
    {"type":"S","W": 50, "H": 50, "r": "skew" , "W": 50, "H": 50, "x": 200 , "y":-50 , "x2":250 , "y2": -50 , "x3":250 , "y3":-100 , "x4":300 , "y4":-100},
    //Z has 2 shapes: Z , vertical
    {"type":"Z","W": 50, "H": 50, "r": "z" , "W": 50, "H": 50, "x": 200 , "y":-100 , "x2":250 , "y2": -100 , "x3":250 , "y3":-50 , "x4":300 , "y4":-50}
];

let canvas = document.querySelector("#game-canvas");
let ctx = canvas.getContext("2d")

//game board
function drawBoard(myCtx,x,y,w,h,c){
    myCtx.fillStyle = c;
    myCtx.fillRect(x,y,w,h);
}
//draw
function drawShape(myCtx,x,y,x2,y2,x3,y3,x4,y4, w, h, c,s){
    if(s == "O"){
        myCtx.fillStyle = "#f2c202";
    }else if (s == "I"){
        myCtx.fillStyle = "#04aac7";
    }else if (s == "T"){
        myCtx.fillStyle = "#9e029e";
    }else if (s == "J"){
        myCtx.fillStyle = "#004dd1";
    }else if (s == "L"){
        myCtx.fillStyle = "#d17600";
    }else if (s == "S"){
        myCtx.fillStyle = "#1ba802";
    }else if (s == "Z"){
        myCtx.fillStyle = "#cf404c";
    }

    myCtx.fillRect(x,y,w,h);
    myCtx.fillRect(x2,y2,w,h);
    myCtx.fillRect(x3,y3,w,h);
    myCtx.fillRect(x4,y4,w,h);

    myCtx.strokeStyle=c;
    myCtx.lineWidth = 2;
    myCtx.strokeRect(x,y,w,h);
    myCtx.strokeRect(x2,y2,w,h);
    myCtx.strokeRect(x3,y3,w,h);
    myCtx.strokeRect(x4,y4,w,h);

}
function nextText(ctx, x,y, fontSize, fontName, textAlign){
    ctx.fillStyle = "black";
    ctx.font = `${fontSize}px ${fontName}`;
    ctx.textAlign = `${textAlign}`;
    ctx.fillText("Next", x, y)
}

function drawNextShape(myCtx, type){
    let arrayOfTetrisNext = [
        //I has 2 shapes: vertical and straight
        {"type":"I", "r": "vertical" , "W": 50, "H": 50, "x": 650 , "y":100 , "x2":650 , "y2": 150 , "x3":650 , "y3":200 , "x4":650, "y4":250},
        //O has only 1 shape
        {"type":"O","W": 50, "H": 50, "r": "box" , "W": 50, "H": 50, "x": 600 , "y":100, "x2":650 , "y2": 100 , "x3":600 , "y3":150 , "x4":650 , "y4":150},
        //T has 4 shapes: face up(normal), face down, face left, face right
        //the face is the 3 sides box
        {"type":"T","W": 50, "H": 50, "r": "face-up" , "W": 50, "H": 50, "x": 600 , "y":100 , "x2":650 , "y2": 100 , "x3":700 , "y3":100 , "x4":650 , "y4":150},
        //J has 4 shapes: face up , face left, face down, face right
        //face is the 4th box
        {"type":"J","W": 50, "H": 50, "r": "face-up" , "W": 50, "H": 50, "x": 650 , "y":100 , "x2":650 , "y2": 150 , "x3":650 , "y3":200 , "x4":600 , "y4":200},
        //L has 4 shapes: face up, face down. face left, face right
        {"type":"L","W": 50, "H": 50, "r": "face-up" , "W": 50, "H": 50, "x": 650 , "y":100 , "x2":650 , "y2": 150 , "x3":650 , "y3":200 , "x4":700 , "y4":200},
        //S has 2 shapes: skew, vertical
        {"type":"S","W": 50, "H": 50, "r": "skew" , "W": 50, "H": 50, "x": 700 , "y":100 , "x2":650 , "y2": 100 , "x3":650 , "y3":150 , "x4":600 , "y4":150},
        //Z has 2 shapes: Z , vertical
        {"type":"Z","W": 50, "H": 50, "r": "z" , "W": 50, "H": 50, "x": 600 , "y":100 , "x2":650 , "y2": 100 , "x3":650 , "y3":150 , "x4":700 , "y4":150}
    ];
    
    if(type == "I"){
        drawShape(myCtx, arrayOfTetrisNext[0].x,arrayOfTetrisNext[0].y, arrayOfTetrisNext[0].x2, arrayOfTetrisNext[0].y2, arrayOfTetrisNext[0].x3, arrayOfTetrisNext[0].y3, arrayOfTetrisNext[0].x4, arrayOfTetrisNext[0].y4, arrayOfTetrisNext[0].W, arrayOfTetrisNext[0].H, "white", "I");
    }else if (type == "O"){
        drawShape(myCtx, arrayOfTetrisNext[1].x,arrayOfTetrisNext[1].y, arrayOfTetrisNext[1].x2, arrayOfTetrisNext[1].y2, arrayOfTetrisNext[1].x3, arrayOfTetrisNext[1].y3, arrayOfTetrisNext[1].x4, arrayOfTetrisNext[1].y4, arrayOfTetrisNext[1].W, arrayOfTetrisNext[1].H, "white", "O");
    }else if (type == "T"){
        drawShape(myCtx, arrayOfTetrisNext[2].x,arrayOfTetrisNext[2].y, arrayOfTetrisNext[2].x2, arrayOfTetrisNext[2].y2, arrayOfTetrisNext[2].x3, arrayOfTetrisNext[2].y3, arrayOfTetrisNext[2].x4, arrayOfTetrisNext[2].y4, arrayOfTetrisNext[2].W, arrayOfTetrisNext[2].H, "white", "T");
    }else if (type == "J"){
        drawShape(myCtx, arrayOfTetrisNext[3].x,arrayOfTetrisNext[3].y, arrayOfTetrisNext[3].x2, arrayOfTetrisNext[3].y2, arrayOfTetrisNext[3].x3, arrayOfTetrisNext[3].y3, arrayOfTetrisNext[3].x4, arrayOfTetrisNext[3].y4, arrayOfTetrisNext[3].W, arrayOfTetrisNext[3].H, "white", "J");
    }else if (type == "L"){
        drawShape(myCtx, arrayOfTetrisNext[4].x,arrayOfTetrisNext[4].y, arrayOfTetrisNext[4].x2, arrayOfTetrisNext[4].y2, arrayOfTetrisNext[4].x3, arrayOfTetrisNext[4].y3, arrayOfTetrisNext[4].x4, arrayOfTetrisNext[4].y4, arrayOfTetrisNext[4].W, arrayOfTetrisNext[4].H, "white", "L");
    }else if (type == "S"){
        drawShape(myCtx, arrayOfTetrisNext[5].x,arrayOfTetrisNext[5].y, arrayOfTetrisNext[5].x2, arrayOfTetrisNext[5].y2, arrayOfTetrisNext[5].x3, arrayOfTetrisNext[5].y3, arrayOfTetrisNext[5].x4, arrayOfTetrisNext[5].y4, arrayOfTetrisNext[5].W, arrayOfTetrisNext[5].H, "white", "S");
    }else if (type == "Z"){
        drawShape(myCtx, arrayOfTetrisNext[6].x,arrayOfTetrisNext[6].y, arrayOfTetrisNext[6].x2, arrayOfTetrisNext[6].y2, arrayOfTetrisNext[6].x3, arrayOfTetrisNext[6].y3, arrayOfTetrisNext[6].x4, arrayOfTetrisNext[6].y4, arrayOfTetrisNext[6].W, arrayOfTetrisNext[6].H, "white", "Z");
    }
}
function drawLose(myCtx){
    drawBoard(myCtx, 0, 250, 550, 150 ,"white");
    ctx.fillStyle = "red";
    ctx.font = "55px Arial";
    ctx.textAlign = "center";
    ctx.fillText("You Lose! F5 to retry!", 280, 350 )
}

function draw(myCtx, cT, sT, nT){
    myCtx.clearRect(0, 0, canvas.width, canvas.height);
    //w: 800
    //h: 700
    //board side
    drawBoard(myCtx, 0, 0, 550, 700, "#666565");
    //information side
    drawBoard(myCtx, 550, 0, 250, 700, "#b1ccfa");
    //Say Next Block
    nextText(myCtx, 680, 70, 50, "Arial", "center")
    //DRAW THAT NEXT BLOCK UNDER IT!
    drawNextShape(myCtx, nT.type);
    
    //different type will draw different kind of tetris block
    if(cT.type == "I"){
        drawShape(myCtx,cT.x, cT.y,cT.x2, cT.y2,cT.x3, cT.y3,cT.x4, cT.y4,cT.W, cT.H, "white", "I");
    }else if (cT.type == "O"){
        drawShape(myCtx,cT.x, cT.y,cT.x2, cT.y2,cT.x3, cT.y3,cT.x4, cT.y4,cT.W, cT.H, "white", "O");
    }else if (cT.type == "T"){
        drawShape(myCtx,cT.x, cT.y,cT.x2, cT.y2,cT.x3, cT.y3,cT.x4, cT.y4,cT.W, cT.H, "white", "T");
    }else if (cT.type == "J"){
        drawShape(myCtx,cT.x, cT.y,cT.x2, cT.y2,cT.x3, cT.y3,cT.x4, cT.y4,cT.W, cT.H, "white", "J");
    }else if (cT.type == "L"){
        drawShape(myCtx,cT.x, cT.y,cT.x2, cT.y2,cT.x3, cT.y3,cT.x4, cT.y4,cT.W, cT.H, "white", "L");
    }else if (cT.type == "S"){
        drawShape(myCtx,cT.x, cT.y,cT.x2, cT.y2,cT.x3, cT.y3,cT.x4, cT.y4,cT.W, cT.H, "white", "S");
    }else if (cT.type == "Z"){
        drawShape(myCtx,cT.x, cT.y,cT.x2, cT.y2,cT.x3, cT.y3,cT.x4, cT.y4,cT.W, cT.H, "white", "Z");
    }
    //draw it out
    for(let i = 0; i < sT.length; i++){
        drawShape(myCtx, sT[i].x, sT[i].y, sT[i].x2, sT[i].y2, sT[i].x3, sT[i].y3, sT[i].x4, sT[i].y4, sT[i].W, sT[i].H, "white", sT[i].type);
    }
    if(youLose){
        drawLose(myCtx);
    }
}

//call function
randomShape(arrayOfTetris);


/*-------functions--------*/
function randomShape(myArrayOfTetris){
    let r = Math.floor(Math.random()* 7);
    let rId =Math.floor(Math.random()* 1000000);
    let copyCat = myArrayOfTetris[r];
    copyCat.id = rId;
    nextTetris = copyCat;
}

/*change shape functions*/
function translateO(){
    //I do nothing
};
function translateI(cT, sT){
//we got a problem;
//if y of x1 is at position that less than 500 yaxis
//if this function call, the 4th position will be outside of the board
//so we have to handle this problems
    if(cT.r == "straight"){
        let x = cT.x;
        let xResult = 700;
        for(let i = 0; i < sT.length; i++){
            if(sT[i].x == x && sT[i].y < xResult){
                xResult = sT[i].y;
            }
            if(sT[i].x2 == x && sT[i].y2 < xResult){
                xResult = sT[i].y2;
            }
            if(sT[i].x3 == x && sT[i].y3 < xResult){
                xResult = sT[i].y3;
            }
            if(sT[i].x4 == x && sT[i].y4 < xResult){
                xResult = sT[i].y4;
            }
        }
        if(cT.y + 150 < xResult){
            cT.x2 = cT.x;
            cT.x3 = cT.x;
            cT.x4 = cT.x;
    
            cT.y2 = cT.y + 50;
            cT.y3 = cT.y + 100;
            cT.y4 = cT.y + 150;
            cT.r = "vertical";
        }else{
            // no convert
        }
    }else if (cT.r == "vertical"){
        //when you are trying to go straight, ask, is there anything in the way of going straight ?
        //if no, good a head, if yes, nope, no change
        let x = cT.x;
        let y = cT.y;
        let position = 3;
        let conflictBlock = false;
        //since we know tat straight is start from cT.x, we will take that poiont, and we know that from cT.x there will be 3 more block, 
        //we can run a loop and check is there anything that is 3 block from position cT.x
        for(let p = 0; p < position; p++){
            if(x == 500){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x - 100){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x - 150){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x - 150){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x - 150){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x - 150){
                            conflictBlock = true;
                        }
                    }
                }     
            }else if (x == 450){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x - 100){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x + 50){
                            conflictBlock = true;
                        }
                    }
                } 
            }else if (x == 400){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x + 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x + 100){
                            conflictBlock = true;
                        }
                    }
                }
            }else if (x <= 350){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x + 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x + 100){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y && sT[i].x == x + 150){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y && sT[i].x2 == x + 150){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y && sT[i].x3 == x + 150){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y && sT[i].x4 == x + 150){
                            conflictBlock = true;
                        }
                    }
                }
            }     
        }
            
        if(!conflictBlock){
            if(cT.x > 300){
                cT.x = 350;
                cT.x2 = cT.x + 50;
                cT.x3 = cT.x + 100;
                cT.x4 = cT.x + 150;
                
                cT.y2 = cT.y;
                cT.y3 = cT.y;
                cT.y4 = cT.y;
    
                cT.r = "straight";
            }else {
                cT.x2 = cT.x + 50;
                cT.x3 = cT.x + 100;
                cT.x4 = cT.x + 150;
                
                cT.y2 = cT.y;
                cT.y3 = cT.y;
                cT.y4 = cT.y;
    
                cT.r = "straight";
            } 
        }else{
            //no change
        }
         
             
    }
};
function translateT(cT, sT){
    //4 shapes
    if(cT.r == "face-up"){
        //go to face-right
        /*--x--*/
        cT.x = cT.x2;
        cT.x3 = cT.x2;
        cT.x4 = cT.x2 - 50;
        /*--y--*/
        cT.y = cT.y2 - 50;
        cT.y3 =  cT.y2 + 50;
        cT.y4 =  cT.y2;

        cT.r = "face-right";
    }else if(cT.r == "face-right"){
        //go to face-down
        let x2 = cT.x2;
        let y2 = cT.y2;
        let position = 2;
        let conflictBlock = false;

        for(let p = 0; p < position; p++){
            if(p == 0){
                //check left from x2
                for(let i = 0; i < sT.length; i++){
                    // there are scenario
                    //when x2 is on 500 x axis,
                    //or on normal axis that is less than 500
                    if(x2 == 500){
                        if(sT[i].y == y2 && sT[i].x == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 100){
                            conflictBlock = true;
                        }
                    }else{
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                   
                }
            }else if (p == 1){
                //check right from x2
                for(let i = 0; i < sT.length; i++){
                    if(sT[i].y == y2 && sT[i].x == x2 + 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y2 == y2 && sT[i].x2 == x2 + 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y3 == y2 && sT[i].x3 == x2 + 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y4 == y2 && sT[i].x4 == x2 + 50){
                        conflictBlock = true;
                    }
                }
            }
        }
        if(!conflictBlock){
            if(cT.x >= 500){
                cT.x2 -= 50;
                cT.x = cT.x2 + 50;
                cT.x3 = cT.x2 - 50;

                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 - 50;
            }
            /*--x--*/
            cT.x = cT.x2 + 50;
            cT.x3 = cT.x2 - 50;
            cT.x4 = cT.x2;
            /*--y--*/
            cT.y = cT.y2;
            cT.y3 = cT.y2;
            cT.y4 = cT.y2 - 50;
            cT.r = "face-down";
        }else{
            //no change
        }
    }else if(cT.r == "face-down"){
        //go to face-left
        let x2 = cT.x2;
        let xResult = 700;

        for(let i = 0; i < sT.length; i++){
            if(sT[i].x == x2 && sT[i].y < xResult){
                xResult = sT[i].y;
            }
            if(sT[i].x2 == x2 && sT[i].y2 < xResult){
                xResult = sT[i].y2;
            }
            if(sT[i].x3 == x2 && sT[i].y3 < xResult){
                xResult = sT[i].y3;
            }
            if(sT[i].x4 == x2 && sT[i].y4 < xResult){
                xResult = sT[i].y4;
            }
        }
        if(cT.y2 + 50 < xResult){
             /*--x--*/
            cT.x = cT.x2;
            cT.x3 = cT.x2;
            cT.x4 = cT.x2 + 50;
            /*--y--*/
            cT.y = cT.y2 + 50;
            cT.y3 = cT.y2 -50;
            cT.y4 = cT.y2;
            cT.r = "face-left";
        }else{
            //
        }

    }else if(cT.r == "face-left"){
        //go to face-up
        
        let x2 = cT.x2;
        let y2 = cT.y2;
        let position = 2;
        let conflictBlock = false;

        for(let p = 0; p < position; p++){
            if(p == 0){
                //check left from x2
                for(let i = 0; i < sT.length; i++){
                    //
                    if(sT[i].y == y2 && sT[i].x == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                        conflictBlock = true;
                    }
                }
            }else if (p == 1){
                //check right from x2
                if(x2 == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 +  100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 100){
                            conflictBlock = true;
                        }
                    }
                }else{
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 +  50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                } 
            }
        }
        if(!conflictBlock){
            if(cT.x == 0){
                cT.x2 += 50;
                cT.x = cT.x2 - 50;
                cT.x3 = cT.x2 + 50;
    
                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 + 50;;
            }
            cT.x = cT.x2 - 50;
            cT.x3 = cT.x2 + 50;
            cT.x4 = cT.x2;
    
            cT.y = cT.y2;
            cT.y3 = cT.y2;
            cT.y4 = cT.y2 + 50;
            cT.r = "face-up";
        }else{
            //nothing
        }
       
    }
};
function translateJ(cT, sT){
    if(cT.r == "face-up"){
        //convert to face-right
        let x2 = cT.x2;
        let y2 = cT.y2;
        let position = 3;
        let conflictBlock = false;

        for(let p = 0; p < position; p++){
            if(x2 == 500){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 100){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 - 50 && sT[i].x == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2- 50 && sT[i].x2 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2- 50 && sT[i].x3 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2- 50 && sT[i].x4 == x2 - 100){
                            conflictBlock = true;
                        }
                    }
                }
            }else if (x2 < 500){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 - 50 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2- 50 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2- 50 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2- 50 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }
            }
        }

        if(!conflictBlock){
            if(cT.x >= 500){
                /*--x--*/
                cT.x2 -= 50;
                cT.x3 = cT.x2 - 50;
                cT.x4 = cT.x2 - 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 - 50;
                cT.r = "face-right";
    
            }else{
                /*--x--*/
                cT.x = cT.x2 + 50;
                cT.x3 = cT.x2 - 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 - 50;
                cT.r = "face-right";
            }
        }else{
            //nothing
        }
    }
    else if (cT.r == "face-right"){
        //go face-down
        let x2 = cT.x2;
        let xResult = 700;

        for(let i = 0; i < sT.length; i++){
            if(sT[i].x == x2 && sT[i].y < xResult){
                xResult = sT[i].y;
            }
            if(sT[i].x2 == x2 && sT[i].y2 < xResult){
                xResult = sT[i].y2;
            }
            if(sT[i].x3 == x2 && sT[i].y3 < xResult){
                xResult = sT[i].y3;
            }
            if(sT[i].x4 == x2 && sT[i].y4 < xResult){
                xResult = sT[i].y4;
            }
        }
        if(cT.y2 + 50 < xResult){
            /*--x--*/
            cT.x = cT.x2;
            cT.x3 = cT.x2;
            cT.x4 = cT.x2 + 50;
            /*--y--*/
            cT.y = cT.y2 + 50;
            cT.y3 = cT.y2 - 50;
            cT.r = "face-down";
        }else{
            //
        }
        
    }
    else if (cT.r == "face-down"){
        let x2 = cT.x2;
        let y2 = cT.y2;
        let position = 3;
        let conflictBlock = false;

        for(let p = 0; p < position; p++){
            if(x2 == 0){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 100){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 + 50 && sT[i].x == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 + 50 && sT[i].x2 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 + 50 && sT[i].x3 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 + 50 && sT[i].x4 == x2 + 100){
                            conflictBlock = true;
                        }
                    }
                }
            }else if (x2 > 0){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 + 50 && sT[i].x == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 + 50 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 + 50 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 + 50 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }
            }
        }
        if(!conflictBlock){
            if(cT.x == 0){
                /*--x--*/
                cT.x2 += 50;
                cT.x3 = cT.x2 + 50;
                cT.x4 = cT.x2 + 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 + 50;
                cT.r = "face-left";
            }else{
                /*--x--*/
                cT.x = cT.x2 - 50;
                cT.x3 = cT.x2 + 50;
                
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 + 50;
                cT.r = "face-left";
            }
        }
    }
    else if (cT.r == "face-left"){
        //go face-up
        let x2 = cT.x2;
        let y2 = cT.y2;
        let xResult = 700;
        let conflictBlock = false;
        for(let i = 0; i < sT.length; i++){
            if(sT[i].x == x2 && sT[i].y < xResult){
                xResult = sT[i].y;
            }
            if(sT[i].x2 == x2 && sT[i].y2 < xResult){
                xResult = sT[i].y2;
            }
            if(sT[i].x3 == x2 && sT[i].y3 < xResult){
                xResult = sT[i].y3;
            }
            if(sT[i].x4 == x2 && sT[i].y4 < xResult){
                xResult = sT[i].y4;
            }
        }

        //check for the 4th block, if anything that block it, don't rotate
        let position = 1;
        for(let p = 0; p < position; p++){
            if(p == 0){
                for(let i = 0; i < sT.length; i++){
                    if(sT[i].y == y2 + 50 && sT[i].x == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y2 == y2 + 50 && sT[i].x2 == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y3 == y2 + 50 && sT[i].x3 == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y4 == y2 + 50 && sT[i].x4 == x2 - 50){
                        conflictBlock = true;
                    }
                }
            }
        }

        if(!conflictBlock){
            if(cT.y2 + 50 < xResult){
                /*--x--*/
                cT.x = cT.x2;
                cT.x3 = cT.x2;
                cT.x4 = cT.x2 - 50;
                /*--y--*/
                cT.y = cT.y2 - 50;
                cT.y3 = cT.y2 + 50;
                cT.y4 = cT.y2 + 50;
                cT.r = "face-up";
            }else{
                //nothing
            }
        }
    }
};
function translateL(cT, sT){
    if(cT.r == "face-up"){
        //face-right
        let x2 = cT.x2;
        let y2 = cT.y2;
        let position = 3;
        let conflictBlock = false;

        for(let p = 0; p < position; p++){
            if(x2 == 0){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 100){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 + 50 && sT[i].x == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 + 50 && sT[i].x2 == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 + 50 && sT[i].x3 == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 + 50 && sT[i].x4 == x2){
                            conflictBlock = true;
                        }
                    }
                }
            }else if (x2 > 0){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 + 50 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 + 50 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 + 50 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 + 50 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }
            }
        }
        if(!conflictBlock){
            if(cT.x == 0){
                /*--x--*/
                cT.x2 += 50;
                cT.x = cT.x2 + 50;
                cT.x3 = cT.x2 - 50;
                cT.x4 = cT.x2 - 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 + 50;
                cT.r = "face-right";
            }else{
                /*--x--*/
                cT.x = cT.x2 + 50;
                cT.x3 = cT.x2 - 50;
                cT.x4 = cT.x2 - 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 + 50;
                cT.r = "face-right";
            }
        }   
    }else if (cT.r == "face-right"){
        //face-down
        /*--x--*/
        cT.x = cT.x2;
        cT.x3 = cT.x2;
        cT.x4 = cT.x2 - 50;
        /*--y--*/
        cT.y = cT.y2 + 50;
        cT.y3 = cT.y2 - 50;
        cT.y4 = cT.y2 - 50;
        cT.r = "face-down";
    }else if(cT.r == "face-down"){
        //face-left
        let x2 = cT.x2;
        let y2 = cT.y2;
        let position = 3;
        let conflictBlock = false;

        for(let p = 0; p < position; p++){
            if(x2 == 500){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 100){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 - 50 && sT[i].x == x2 ){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2- 50 && sT[i].x2 == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2- 50 && sT[i].x3 == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2- 50 && sT[i].x4 == x2){
                            conflictBlock = true;
                        }
                    }
                }
            }else if (x2 < 500){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 - 50 && sT[i].x == x2 + 50 ){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2- 50 && sT[i].x2 == x2+ 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2- 50 && sT[i].x3 == x2+ 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2- 50 && sT[i].x4 == x2+ 50){
                            conflictBlock = true;
                        }
                    }
                }
            }
        }
        if(!conflictBlock){
            if(cT.x2 == 500){
                /*--x--*/
                cT.x2 -=50;
                cT.x = cT.x2 - 50;
                cT.x3 = cT.x2 + 50;
                cT.x4 = cT.x2 + 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 - 50;
                cT.r = "face-left";
            }else {
                /*--x--*/
                cT.x = cT.x2 - 50;
                cT.x3 = cT.x2 + 50;
                cT.x4 = cT.x2 + 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 - 50;
                cT.r = "face-left";
            }
        }
    }else if (cT.r == "face-left"){
        //face-up
        let x2 = cT.x2;
        let xResult = 700;

        for(let i = 0; i < sT.length; i++){
            if(sT[i].x == x2 && sT[i].y < xResult){
                xResult = sT[i].y;
            }
            if(sT[i].x2 == x2 && sT[i].y2 < xResult){
                xResult = sT[i].y2;
            }
            if(sT[i].x3 == x2 && sT[i].y3 < xResult){
                xResult = sT[i].y3;
            }
            if(sT[i].x4 == x2 && sT[i].y4 < xResult){
                xResult = sT[i].y4;
            }
        }
        if(cT.y2 + 50 < xResult){
            /*--x--*/
            cT.x = cT.x2;
            cT.x3 = cT.x2;
            cT.x4 = cT.x2 + 50;
            /*--y--*/
            cT.y = cT.y2 - 50;
            cT.y3 = cT.y2 + 50;
            cT.y4 = cT.y2 + 50;
            cT.r = "face-up";
        }else{
            //
        }
        
    }
};
function translateS(cT, sT){
    if(cT.r == "skew"){
        //vertical
        //is there anything belove the 4th block ? or in conflict with it if I were to switch ?
        //yes ? no switch , no ? switch it then
        let x2 = cT.x2;
        let y2 = cT.y2;
        let xResult = 700;
        let conflictBlock = false;
        
        for(let i = 0; i < sT.length; i++){
            if(sT[i].x == x2 && sT[i].y < xResult){
                xResult = sT[i].y;
            }
            if(sT[i].x2 == x2 && sT[i].y2 < xResult){
                xResult = sT[i].y2;
            }
            if(sT[i].x3 == x2 && sT[i].y3 < xResult){
                xResult = sT[i].y3;
            }
            if(sT[i].x4 == x2 && sT[i].y4 < xResult){
                xResult = sT[i].y4;
            }
        }

        let position = 2;
        for(let p = 0; p < position; p++){
            if(p == 0){
                for(let i = 0; i < sT.length; i++){
                    if(sT[i].y == y2 && sT[i].x == x2 + 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y2 == y2  && sT[i].x2 == x2 + 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y3 == y2  && sT[i].x3 == x2 + 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y4 == y2  && sT[i].x4 == x2 + 50){
                        conflictBlock = true;
                    }
                }
            }else if (p == 1){
                for(let i = 0; i < sT.length; i++){
                    if(sT[i].y == y2 + 50 && sT[i].x == x2 + 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y2 == y2+ 50  && sT[i].x2 == x2 + 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y3 == y2+ 50  && sT[i].x3 == x2 + 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y4 == y2+ 50  && sT[i].x4 == x2 + 50){
                        conflictBlock = true;
                    }
                }
            }  
        }
        if(!conflictBlock){
            if(cT.y2 + 50 < xResult){
                /*--x--*/
                cT.x = cT.x2;
                cT.x3 = cT.x2 + 50;
                cT.x4 = cT.x2 + 50;
                /*--y--*/
                cT.y = cT.y2 - 50;
                cT.y3 = cT.y2;
                cT.y4 = cT.y2 + 50;
                cT.r = "vertical";
            }else{
                //
            }
        }
        
    }
    else if (cT.r == "vertical"){
        //skew
        let x2 = cT.x2;
        let y2 = cT.y2;
        let position = 2;
        let conflictBlock = false;

        for(let p = 0; p < position; p++){
            if(x2 == 0){
                if (p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }else if(p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 - 50 && sT[i].x == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 - 50 && sT[i].x2 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 - 50 && sT[i].x3 == x2 + 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 - 50 && sT[i].x4 == x2 + 100){
                            conflictBlock = true;
                        }
                    }
                }
            }else if (x2 > 0){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 - 50 && sT[i].x == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 - 50 && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 - 50 && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 - 50 && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }
            }
        }
        if(!conflictBlock){  
            if(cT.x == 0){
                /*--x--*/
                cT.x2 += 50;
                cT.x = cT.x2 - 50;
                cT.x3 = cT.x2;
                cT.x4 = cT.x2 + 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2 - 50;
                cT.y4 = cT.y2 - 50;
                cT.r = "skew";
            }else {
                /*--x--*/
                cT.x = cT.x2 - 50;
                cT.x3 = cT.x2;
                cT.x4 = cT.x2 + 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2 - 50;
                cT.y4 = cT.y2 - 50;
                cT.r = "skew";
            }
        }else{
            //
        }
        
    }
};
function translateZ(cT, sT){
    if(cT.r == "z"){
        //vertical

        let x2 = cT.x2;
        let y2 = cT.y2;
        let position = 2;
        let conflictBlock = false;
        
        for(let p = 0; p < position; p++){
            if(p == 0){
                for(let i = 0; i < sT.length; i++){
                    if(sT[i].y == y2 && sT[i].x == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                        conflictBlock = true;
                    }
                }
            }else if (p == 1){
                for(let i = 0; i < sT.length; i++){
                    if(sT[i].y == y2 + 50 && sT[i].x == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y2 == y2 + 50  && sT[i].x2 == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y3 == y2 + 50  && sT[i].x3 == x2 - 50){
                        conflictBlock = true;
                    }
                    if(sT[i].y4 == y2 + 50  && sT[i].x4 == x2 - 50){
                        conflictBlock = true;
                    }
                }
            }
        }

        if(!conflictBlock){
            /*--x--*/
            cT.x = cT.x2;
            cT.x3 = cT.x2 - 50;
            cT.x4 = cT.x2 - 50;
            /*--y--*/
            cT.y = cT.y2 - 50;
            cT.y3 = cT.y2;
            cT.y4 = cT.y2 + 50;
            cT.r = "vertical";
        }
    }
    else if (cT.r == "vertical"){
        //z
        let x2 = cT.x2;
        let y2 = cT.y2;
        let position = 3;
        let conflictBlock = false;

        for(let p = 0; p < position; p++){
            if(x2 == 500){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 100){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 100){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 + 50 && sT[i].x == x2 ){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 + 50  && sT[i].x2 == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 + 50  && sT[i].x3 == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 + 50  && sT[i].x4 == x2){
                            conflictBlock = true;
                        }
                    }
                }
            }else if (x2 < 500){
                if(p == 0){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 && sT[i].x == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 && sT[i].x2 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 && sT[i].x3 == x2 - 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 && sT[i].x4 == x2 - 50){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 1){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 + 50 && sT[i].x == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 + 50 && sT[i].x2 == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 + 50 && sT[i].x3 == x2){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 + 50 && sT[i].x4 == x2){
                            conflictBlock = true;
                        }
                    }
                }else if (p == 2){
                    for(let i = 0; i < sT.length; i++){
                        if(sT[i].y == y2 + 50 && sT[i].x == x2 + 50 ){
                            conflictBlock = true;
                        }
                        if(sT[i].y2 == y2 + 50  && sT[i].x2 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y3 == y2 + 50  && sT[i].x3 == x2 + 50){
                            conflictBlock = true;
                        }
                        if(sT[i].y4 == y2 + 50  && sT[i].x4 == x2 + 50){
                            conflictBlock = true;
                        }
                    }
                }
            }

        }
        if(!conflictBlock){
            if(cT.x == 500){
                /*--x--*/
                cT.x2 -= 50;
                cT.x = cT.x2 - 50;
                cT.x3 = cT.x2;
                cT.x4 = cT.x2 + 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2 + 50;
                cT.y4 = cT.y2 + 50;
                cT.r = "z";
            }else {
                /*--x--*/
                cT.x = cT.x2 - 50;
                cT.x3 = cT.x2;
                cT.x4 = cT.x2 + 50;
                /*--y--*/
                cT.y = cT.y2;
                cT.y3 = cT.y2 + 50;
                cT.y4 = cT.y2 + 50;
                cT.r = "z";
            }
        }
    }
};

/*middle man between change shape input and function*/
function translateShape(myCurrentTetris){
    //we don't pass anything if it's and O type
    if(myCurrentTetris.type == "I"){
        translateI(myCurrentTetris, store);
    }else if (myCurrentTetris.type == "T"){
        translateT(myCurrentTetris, store);
    }else if (myCurrentTetris.type == "J"){
        translateJ(myCurrentTetris, store);
    }else if (myCurrentTetris.type == "L"){
        translateL(myCurrentTetris, store);
    }else if (myCurrentTetris.type == "S"){
        translateS(myCurrentTetris, store);
    }else if (myCurrentTetris.type == "Z"){
        translateZ(myCurrentTetris, store);
    }
}

function checkBlockLeft(cT, sT,){
    for(let i = 0; i < 4; i++){
        if(i == 0){
            for(let j = 0; j < sT.length; j++){
                if(sT[j].x4 == cT.x - 50 && sT[j].y4 == cT.y ){
                    return true;
                }
                if(sT[j].x3 == cT.x - 50 && sT[j].y3 == cT.y ){
                    return true;
                }
                if(sT[j].x2 == cT.x - 50 && sT[j].y2 == cT.y ){
                    return true;
                }
                if(sT[j].x == cT.x - 50 && sT[j].y == cT.y ){
                    return true;
                }  
            }
        }else if (i == 1){
            for(let j = 0; j < sT.length; j++){
                if(sT[j].x4 == cT.x2 - 50&& sT[j].y4 == cT.y2 ){
                    return true;
                }
                if(sT[j].x3 == cT.x2 - 50&& sT[j].y3 == cT.y2 ){
                    return true;
                }
                if(sT[j].x2 == cT.x2 - 50&& sT[j].y2 == cT.y2 ){
                    return true;
                }
                if(sT[j].x == cT.x2 - 50 && sT[j].y == cT.y2 ){
                    return true;
                } 
            }
        }else if (i == 2){
            for(let j = 0; j < sT.length; j++){
                if(sT[j].x4 == cT.x3 - 50&& sT[j].y4 == cT.y3 ){
                    return true;
                }
                if(sT[j].x == cT.x3 - 50&& sT[j].y == cT.y3 ){
                    return true;
                }
                if(sT[j].x2 == cT.x3 - 50&& sT[j].y2 == cT.y3 ){
                    return true;
                }
                if(sT[j].x3 == cT.x3 - 50&& sT[j].y3 == cT.y3 ){
                    return true;
                }
            }
        }else if (i == 3){
            for(let j = 0; j < sT.length; j++){
                if(sT[j].x4 == cT.x4 - 50&& sT[j].y4 == cT.y4 ){
                    return true;
                }
                if(sT[j].x == cT.x4 - 50 && sT[j].y == cT.y4 ){
                    return true;
                }
                if(sT[j].x2 == cT.x4 - 50&& sT[j].y2 == cT.y4 ){
                    return true;
                }
                if(sT[j].x3 == cT.x4 - 50&& sT[j].y3 == cT.y4 ){
                    return true;
                }
            }
        }
    }
}
function whatShapeAndMoveLeft(cT, sT){
    if(cT.type == "I"){
        let foundBlock = checkBlockLeft(cT, sT);
        if(!foundBlock){
            if(cT.x - 50 >= 0){
                cT.x -= 50;
                cT.x2 -= 50;
                cT.x3 -= 50;
                cT.x4 -= 50;
            }
        }      
    }else if (cT.type == "O"){
        let foundBlock = checkBlockLeft(cT, sT);
        if(!foundBlock){
            if(cT.x - 50 >= 0){
                cT.x -= 50;
                cT.x2 -= 50;
                cT.x3 -= 50;
                cT.x4 -= 50;
            }
        } 
    }else if (cT.type == "T"){
        if(cT.r == "face-up"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }else if (cT.r == "face-right"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x4 - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }else if (cT.r == "face-down"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x3 - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }else if (cT.r == "face-left"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
    }else if (cT.type == "J"){
        if(cT.r == "face-up"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x4 - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
        else if (cT.r == "face-right"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x4 - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
        else if (cT.r == "face-down"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
        else if (cT.r == "face-left"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
    }else if (cT.type == "L"){
        if(cT.r == "face-up"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }else if (cT.r == "face-right"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x4 - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }else if (cT.r == "face-down"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x4 - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }else if (cT.r == "face-left"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
    }else if (cT.type == "S"){
        if(cT.r == "skew"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
        else if (cT.r == "vertical"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
    }else if (cT.type == "Z"){
        if(cT.r == "z"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
        else if (cT.r =="vertical"){
            let foundBlock = checkBlockLeft(cT, sT);
            if(!foundBlock){
                if(cT.x4 - 50 >= 0){
                    cT.x -= 50;
                    cT.x2 -= 50;
                    cT.x3 -= 50;
                    cT.x4 -= 50;
                }
            } 
        }
    }
}
function checkBlockRight(cT, sT){
    for(let i = 0; i < 4; i++){
        if(i == 0){
            for(let j = 0; j < sT.length; j++){
                if(sT[j].x4 == cT.x + 50 && sT[j].y4 == cT.y ){
                    return true;
                }
                if(sT[j].x3 == cT.x + 50 && sT[j].y3 == cT.y ){
                    return true;
                }
                if(sT[j].x2 == cT.x + 50 && sT[j].y2 == cT.y ){
                    return true;
                }
                if(sT[j].x == cT.x + 50 && sT[j].y == cT.y ){
                    return true;
                }  
            }
        }else if (i == 1){
            for(let j = 0; j < sT.length; j++){
                if(sT[j].x4 == cT.x2 + 50&& sT[j].y4 == cT.y2 ){
                    return true;
                }
                if(sT[j].x3 == cT.x2 + 50&& sT[j].y3 == cT.y2 ){
                    return true;
                }
                if(sT[j].x2 == cT.x2 + 50&& sT[j].y2 == cT.y2 ){
                    return true;
                }
                if(sT[j].x == cT.x2 + 50 && sT[j].y == cT.y2 ){
                    return true;
                } 
            }
        }else if (i == 2){
            for(let j = 0; j < sT.length; j++){
                if(sT[j].x4 == cT.x3 + 50&& sT[j].y4 == cT.y3 ){
                    return true;
                }
                if(sT[j].x == cT.x3 + 50&& sT[j].y == cT.y3 ){
                    return true;
                }
                if(sT[j].x2 == cT.x3 + 50&& sT[j].y2 == cT.y3 ){
                    return true;
                }
                if(sT[j].x3 == cT.x3 + 50&& sT[j].y3 == cT.y3 ){
                    return true;
                }
            }
        }else if (i == 3){
            for(let j = 0; j < sT.length; j++){
                if(sT[j].x4 == cT.x4 + 50&& sT[j].y4 == cT.y4 ){
                    return true;
                }
                if(sT[j].x == cT.x4 + 50 && sT[j].y == cT.y4 ){
                    return true;
                }
                if(sT[j].x2 == cT.x4 + 50&& sT[j].y2 == cT.y4 ){
                    return true;
                }
                if(sT[j].x3 == cT.x4 + 50&& sT[j].y3 == cT.y4 ){
                    return true;
                }
            }
        }
    }
}

function whatShapeAndMoveRight(cT, sT){
    if(cT.type == "I"){
        let foundBlock = checkBlockRight(cT, sT);
        if(!foundBlock){
            if(cT.x4 + 50 < 550){
                cT.x += 50;
                cT.x2 += 50;
                cT.x3 += 50;
                cT.x4 += 50;
            }
        }
    }else if (cT.type == "O"){
        let foundBlock = checkBlockRight(cT, sT);
        if(!foundBlock){
            if(cT.x4 + 50 < 550){
                cT.x += 50;
                cT.x2 += 50;
                cT.x3 += 50;
                cT.x4 += 50;
            }
        }
    }else if (cT.type == "T"){
        if(cT.r == "face-up"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x3 + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }else if (cT.r == "face-right"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }else if (cT.r == "face-down"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }else if (cT.r == "face-left"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x4 + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }
    }else if (cT.type == "J"){
        if(cT.r == "face-up"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }
        else if (cT.r == "face-right"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }
        else if (cT.r == "face-down"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x4 + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }
        else if (cT.r == "face-left"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x4 + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }
    }else if (cT.type == "L"){
        if(cT.r == "face-up"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x4 + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }else if (cT.r == "face-right"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }else if (cT.r == "face-down"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }else if (cT.r == "face-left"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x4 + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }  
    }else if (cT.type == "S"){
        if(cT.r == "skew"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x4 + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }
        else if (cT.r == "vertical"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x4 + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }
    }else if (cT.type == "Z"){
        if(cT.r == "z"){
            let foundBlock = checkBlockRight(cT, sT);
            if(!foundBlock){
                if(cT.x4 + 50 < 550){
                    cT.x += 50;
                    cT.x2 += 50;
                    cT.x3 += 50;
                    cT.x4 += 50;
                }
            }
        }
        else if (cT.r =="vertical"){
            let foundBlock = checkBlockRight(cT, sT);
        if(!foundBlock){
            if(cT.x + 50 < 550){
                cT.x += 50;
                cT.x2 += 50;
                cT.x3 += 50;
                cT.x4 += 50;
            }
        }
        }
    }
}

function listeningToMove(){
    document.addEventListener("keydown", function(e){
        if(e.keyCode == 39){
            //right
            whatShapeAndMoveRight(currentTetris, store);
        }else if (e.keyCode == 37){
            //left
            whatShapeAndMoveLeft(currentTetris, store);
        }else if (e.keyCode == 38){
            //we call translateShape() here
            if(!stopMovingForNow){
                translateShape(currentTetris);
            }
        }
    });
}
//move everything down 1 block
function scoreAndMoveDown(sT, yaxis){
    //console.log("I eat!!!!")
    //now we loop through the array "sT"
    //if every i of the sT
    //we run through the array to find anything that match, if found, delete the sT position out of the object
    //yaxis is the y that need to be delete
    for(let i = 0; i < sT.length; i++){
        if(sT[i].y){
            if(sT[i].y == yaxis){
                delete sT[i].y;
                delete sT[i].x;
            }
        }
        if(sT[i].y2){
            if(sT[i].y2 == yaxis){
                delete sT[i].y2;
                delete sT[i].x2;
            }
        }
        if(sT[i].y3){
            if(sT[i].y3 == yaxis){
                delete sT[i].y3;
                delete sT[i].x3;
            }
        }
        if(sT[i].y4){
            if(sT[i].y4 == yaxis){
                delete sT[i].y4;
                delete sT[i].x4;
            }
        }
    }
    //anything above (the lesser yaxis) yaxis move down 1 block (50px)
    for(let j = 0; j < sT.length; j++){
        //console.log("call move down!")
        //console.log("sT[j].y sT[j].y2 sT[j].y3 sT[j].y4 :", sT[j].y, sT[j].y2, sT[j].y3, sT[j].y4)
        //console.log("yaxis:", yaxis)
        if(sT[j].y){
            if(sT[j].y < yaxis){
                //console.log("call in y:")
                sT[j].y += 50;
            }
        }
        if(sT[j].y2){
            if(sT[j].y2 < yaxis){
                //console.log("call in y2:")
                sT[j].y2 += 50;
            }
        }
        if(sT[j].y3){
            if(sT[j].y3 < yaxis){
                //console.log("call in y3:")
                sT[j].y3 += 50;
            }
        }
        if(sT[j].y4){
            if(sT[j].y4 < yaxis){
                //console.log("call in y4:")
                sT[j].y4 += 50;
            }
        }
    }
    score += 1000;
}
//check for 11 block score
function checkToScore(sT){
    //console.log("check to score")
    //this function run specifically when the block hit the bottom or hit other block and stop and store into the store
    let currentY = 700;
    let num = 0;
    //loop through each Y (every 50 pixels)
    if(sT.length >= 1){
        for(let i = 700; i >= 0; i--){
            //console.log("in loop i")
            //set "y" to current Iteraction "i"
            currentY = i;
           
            //[[121121, y2, y4, y5], [121121, y2, y4, y5]]
            for(let j = 0; j < sT.length; j++){
                //console.log("in loop j", sT.length)
                if(sT[j].y){
                    if(sT[j].y == i){
                        num += 1;
                     }
                }
                if(sT[j].y2){
                    if(sT[j].y2 == i){
                        num += 1;
                    }
                }
                if(sT[j].y3){
                    if(sT[j].y3 == i){
                        num += 1;
                    }
                }
                if(sT[j].y4){
                    if(sT[j].y4 == i){
                        num += 1;
                    }
                }
            }
            //count number in the array         
            if(num == 11){
                //console.log("in check 11")
                //go through, destroy block, and add score
                scoreAndMoveDown(sT, currentY);
                return checkToScore(sT);
            }else{
                //reset array
                num = 0;
            }
            //go next loop
        }
    }
    //end of the loop
    //console.log("outside of loop")
}
function movingBlockDown(cT, sT){
    //store to sT
    //moving cT down
    if(cT.type == "I"){
        //console.log("check for type: I")
        if(cT.r == "straight"){
            //console.log("check for r: straight")
            let x = cT.x;
            let x2 = cT.x2;
            let x3 = cT.x3;
            let x4 = cT.x4;

            let y = cT.y;
            let y2 = cT.y2;
            let y3 = cT.y3;
            let y4 = cT.y4;
            //for loop through the sT
            //in this 4 xs
            //which one of this has the lowest number 
            let xResult = 700;
            let x2Result = 700;
            let x3Result = 700;
            let x4Result = 700;
            //loop 4 time because we want to find 4 result

            for(let i = 0 ; i < 4; i++){
                //console.log("in for loop : i")
                if(sT.length >= 1){
                    //console.log("check length")
                    if (i == 0){
                        for(let j = 0 ; j < sT.length; j++){
                            //console.log("for loop i == 0")
                            // loop through all the sT and all xs
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                } 
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                } 
                            }

                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                } 
                            }
                            
                        }
                    }else if (i == 1){
                        for(let j = 0 ; j < sT.length; j++){
                            //console.log("for loop i == 1")
                            // loop through all the sT and all xs
                            if(sT[j].x >= 0){
                                if(sT[j].x == x2 && sT[j].y < x2Result && sT[j].y > y2){
                                    x2Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x2 && sT[j].y2 < x2Result && sT[j].y2 > y2){
                                    x2Result = sT[j].y2;
                                } 
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x2 && sT[j].y3 < x2Result && sT[j].y3 > y2){
                                    x2Result = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x2 && sT[j].y4 < x2Result && sT[j].y4 > y2){
                                    x2Result = sT[j].y4;
                                } 
                            }
                            
                        }
                    }else if (i == 2){
                        for(let j = 0 ; j < sT.length; j++){
                            //console.log("for loop i == 2")
                            // loop through all the sT and all xs
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2> y3){
                                    x3Result = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                }
                            }
                           
                        }
                    }else if (i == 3){
                        for(let j = 0 ; j < sT.length; j++){
                            //console.log("for loop i == 3")
                            // loop through all the sT and all xs
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }
                            }                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4== x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                }
                            }
                        }
                    }
                }else{
                    //700
                }  
            }
            //console.log("done checking straight, time for if drop!")
            //1st highest
            if(xResult <= x2Result && xResult <= x3Result && xResult <= x4Result){
                if(cT.y + 50 < xResult){
                    //console.log("xResult")
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    //store to sT
                    //chose randomNext
                    //say current = Next
                    //
                    //check if cT has anything block yaxis abover 0, if it does, then you lose, if not, proceed like normal
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                   
                }
            }
            //2nd highest
            else if (x2Result <= xResult && x2Result <= x3Result && x2Result <= x4Result){
                if(cT.y2 + 50 < x2Result){
                    //console.log("x2Result")
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    //store to sT
                    //chose randomNext
                    //say current = Next
                    //
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
            //3rd highest
            else if (x3Result <= xResult && x3Result <= x2Result && x3Result <= x4Result){
                if(cT.y3 + 50 < x3Result){
                    //console.log("x3Result")
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    //store to sT
                    //chose randomNext
                    //say current = Next
                    //
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
            //4th highest
            else if (x4Result <= xResult && x4Result <= x2Result && x4Result <= x3Result){
                if(cT.y4 + 50 < x4Result){
                    //console.log("x4Result")
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    //store to sT
                    //chose randomNext
                    //say current = Next
                    //
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);  
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
        else if (cT.r == "vertical"){
            let x4 = cT.x4;
            let y4 = cT.y4;
            let x4Result = 700;
            //console.log("x4:", cT.x4);
            if(sT.length >= 1){
                for(let i = 0 ; i < sT.length; i++){
                    if(sT[i].x >= 0){
                        if(sT[i].x == x4 && sT[i].y < x4Result && sT[i].y > y4){
                            x4Result = sT[i].y;
                        }
                    }

                    if(sT[i].x2 >= 0){
                        if(sT[i].x2 == x4 && sT[i].y2 < x4Result && sT[i].y2 > y4){
                            x4Result = sT[i].y2; 
                        }  
                    }

                    if(sT[i].x3 >= 0){
                        if(sT[i].x3 == x4 && sT[i].y3 < x4Result && sT[i].y3 > y4){
                            x4Result = sT[i].y3;
                        }  
                    }
                    //console.log("sT[i].x4:",sT[i].x4)
                    if(sT[i].x4 >= 0){
                        if(sT[i].x4 == x4 && sT[i].y4 < x4Result && sT[i].y4 > y4){
                            x4Result = sT[i].y4;
                        } 
                    }
                }
            }else{
                //700
            }
            //console.log("store:", sT);
            
            //console.log("x4Result:", x4Result);
            if(cT.y4 + 50 < x4Result){
                cT.y += 50;
                cT.y2 += 50;
                cT.y3 += 50;
                cT.y4 += 50;
            }else{
               // console.log("already pushed! stop moving it!")
                let overZero = false;
                if(cT.y < 0){
                    overZero = true;
                }
                if(cT.y2 < 0){
                    overZero = true;
                }
                if(cT.y3 < 0){
                    overZero = true;
                }
                if(cT.y4 < 0){
                    overZero = true;
                }
                if(overZero){
                    clearInterval(movingDownInterval);
                    youLose = true;
                }else{
                    sT.push(cT);
                    currentTetris = nextTetris;
                    randomShape(arrayOfTetris);
                    //check if we have a row of 11 block, to score
                    checkToScore(sT);
                }
            }
        }
    }else if (cT.type == "O"){
        if(cT.r == "box"){
            let x3 = cT.x3;
            let x4 = cT.x4;
            let y3 = cT.y3;
            let y4 = cT.y4;
            let x3Result = 700;
            let x4Result = 700;

            for(let i = 0; i < 2; i++){
                if(sT.length >= 1){                
                    if (i == 0){
                        for(let j = 0 ; j < sT.length; j++){ 
                            // loop through all the sT and all xs
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }                         
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2 > y3){
                                    x3Result = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                } 
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                } 
                            }   
                        }
                    }else if (i == 1){
                        for(let j = 0 ; j < sT.length; j++){
                            // loop through all the sT and all xs
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                }
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                }
                            }
                           
                        }
                    }
                }else{
                    //nothing, 700
                }
            }
            //

            if(x3Result <= x4Result){
                if(cT.y3 + 50 < x3Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;

                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x4Result <= x3Result){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;

                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        randomShape(arrayOfTetris);
                        currentTetris = nextTetris;
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
    }else if (cT.type == "T"){
        if(cT.r == "face-up"){
            let x = cT.x;
            let x4 = cT.x4;
            let x3 = cT.x3;

            let y = cT.y;
            let y4 = cT.y4;
            let y3 = cT.y3;

            let xResult = 700;
            let x4Result = 700;
            let x3Result = 700;

            for(let i = 0; i < 3; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                } 
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                }
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                }  
                            }
                            
                        }
                    }
                    else if(i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2 > y3){
                                    x3Result = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                }
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }
                    else if(i == 2){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y3;
                                }
                            }
                           
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y4;
                                } 
                            }
                            
                        }
                    }
                }else{
                    // 700
                }
            }
            //
            if(x4Result <= xResult && x4Result <= x3Result){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x3Result <= xResult && x3Result <= x4Result){
                if(cT.y3 + 50 < x3Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (xResult <= x3Result && xResult <= x4Result){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
        else if (cT.r == "face-right"){
            let x3 = cT.x3;
            let x4 = cT.x4;

            let y3 = cT.y3;
            let y4 = cT.y4;

            let x3Result = 700;
            let x4Result = 700;

            for(let i = 0; i < 2; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2 > y3){
                                    x3Result = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                }
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                } 
                            }
                            
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                } 
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }
                }else{
                    //700
                }
            }
            //
            if(x3Result <= x4Result){
                if(cT.y3 + 50 < x3Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x4Result <= x3Result){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else {
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }

        }
        else if (cT.r == "face-down"){
            let x = cT.x;
            let x2 = cT.x2;
            let x3 = cT.x3;

            let y = cT.y;
            let y2 = cT.y2;
            let y3 = cT.y3;

            let xResult = 700;
            let x2Result = 700;
            let x3Result = 700;

            for(let i = 0; i < 3; i++){
                if(sT.length >= 1){
                    if(i == 0){ 
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y ){
                                    xResult = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult&& sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                } 
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                } 
                            }
                            
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x2 && sT[j].y < x2Result && sT[j].y > y2){
                                    x2Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x2 && sT[j].y2 < x2Result && sT[j].y2 > y2){
                                    x2Result = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x2 && sT[j].y3 < x2Result && sT[j].y3 > y2){
                                    x2Result = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x2 && sT[j].y4 < x2Result && sT[j].y4 > y2){
                                    x2Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }else if (i == 2){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2 > y3){
                                    x3Result = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                }
                            }
                           
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }
                }else{
                    //700
                }
            }
            //

            if(xResult <= x2Result && xResult <= x3Result){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x2Result <= xResult && x2Result <= x3Result){
                if(cT.y2 + 50 < x2Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x3Result <= xResult && x3Result <= x2Result){
                if(cT.y3 + 50 < x3Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
        else if (cT.r == "face-left"){
            let x = cT.x;
            let x4 = cT.x4;
            let y = cT.y;
            let y4 = cT.y4;
            let xResult = 700;
            let x4Result = 700;

            for(let i = 0; i < 2; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                }
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                } 
                            }
                           
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }  
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }
                }else{
                    //700
                }
            }
            //
            if(xResult <= x4Result){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x4Result <= xResult){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }

        }
    }else if (cT.type == "J"){
        if(cT.r == "face-up"){
            let x3 = cT.x3;
            let x4 = cT.x4;
            let y3 = cT.y3;
            let y4 = cT.y4;
            let x3Result = 700;
            let x4Result = 700;

            for(let i = 0; i < 2; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2 > y3){
                                    x3Result = sT[j].y2;
                                }  
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                } 
                            }
                           
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                }
                            }
                           
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                }  
                            }
                            
                        }
                    }
                }else{  
                    //
                }
            }
            //
            if(x3Result <= x4Result){
                if(cT.y3 + 50 < x3Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x4Result <= x3Result){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
        else if (cT.r == "face-right"){
            let x = cT.x;
            let x2 = cT.x2;
            let x3 = cT.x3;
            let y = cT.y;
            let y2 = cT.y2;
            let y3 = cT.y3;
            let xResult = 700;
            let x2Result = 700;
            let x3Result = 700;

            for(let i = 0; i < 3; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                           
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                } 
                            }
                           
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                }
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                }  
                            }
                            
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x2 && sT[j].y < x2Result && sT[j].y > y2){
                                    x2Result = sT[j].y;
                                }
                            }
                           
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x2 && sT[j].y2 < x2Result && sT[j].y2 > y2){
                                    x2Result = sT[j].y2;
                                } 
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x2 && sT[j].y3 < x2Result && sT[j].y3 > y2){
                                    x2Result = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x2 && sT[j].y4 < x2Result && sT[j].y4 > y2){
                                    x2Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }else if (i == 2){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2 > y3){
                                    x3Result = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                }
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                } 
                            }
                           
                        }
                    }
                }else{
                    //700
                }
            }
            //
            if(xResult <= x2Result && xResult <= x3Result){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if(x2Result <= xResult && x2Result <= x3Result){
                if(cT.y2 + 50 < x2Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x3Result <= x2Result && x3Result <= xResult){
                if(cT.y3 + 50 < x3Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
        else if (cT.r == "face-down"){
            let x = cT.x;
            let x4 = cT.x4;
            let y = cT.y;
            let y4 = cT.y4;
            let xResult = 700;
            let x4Result = 700;

           for(let i = 0; i < 2; i++){
               if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                           
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                } 
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                }   
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                }
                            }
                            
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }   
                            }
                           
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                }   
                            }
                           
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                } 
                            }
                           
                        }
                    }
               }else{
                   //700
               }
           }
           //
 
           if(xResult - 100 <= x4Result){
               //console.log("xResult")
               if(cT.y + 50 < xResult){
                   cT.y += 50;
                   cT.y2 += 50;
                   cT.y3 += 50;
                   cT.y4 += 50;
               }else{
                let overZero = false;
                if(cT.y < 0){
                    overZero = true;
                }
                if(cT.y2 < 0){
                    overZero = true;
                }
                if(cT.y3 < 0){
                    overZero = true;
                }
                if(cT.y4 < 0){
                    overZero = true;
                }
                if(overZero){
                    clearInterval(movingDownInterval);
                    youLose = true;
                }else{
                    sT.push(cT);
                    currentTetris = nextTetris;
                    randomShape(arrayOfTetris);
                   
                    //check if we have a row of 11 block, to score
                    checkToScore(sT);
                }
               }
           }else if (x4Result < xResult - 100){
            //console.log("x4Result")
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                       
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
           }
        }
        else if (cT.r == "face-left"){
            let x = cT.x;
            let x2 = cT.x2;
            let x4 = cT.x4;
            let y = cT.y;
            let y2 = cT.y2;
            let y4 = cT.y4;
            let xResult = 700;
            let x2Result = 700;
            let x4Result = 700;

            for(let i =0; i < 3; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                }  
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                } 
                            }
                            
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x2 && sT[j].y < x2Result && sT[j].y > y2){
                                    x2Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x2 && sT[j].y2 < x2Result && sT[j].y2 > y2){
                                    x2Result = sT[j].y2;
                                }  
                            }
                           
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x2 && sT[j].y3 < x2Result && sT[j].y3 > y2){
                                    x2Result = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x2 && sT[j].y4 < x2Result && sT[j].y4 > y2){
                                    x2Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }else if (i == 2){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }  
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                } 
                            }
                           
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }
                }else {
                    //700
                }
            }
            //
            if(xResult <= x2Result && xResult + 50 <= x4Result){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                       
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x2Result <= xResult && x2Result + 50 <= x4Result){
                if(cT.y2 + 50 < x2Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x4Result  <= xResult + 50 && x4Result  <= x2Result + 50){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
    }else if (cT.type == "L"){
        if(cT.r == "face-up"){
            let x3 = cT.x3;
            let x4 = cT.x4;
            let y3 = cT.y3;
            let y4 = cT.y4;
            let x3Result = 700;
            let x4Result = 700;

            for(let i = 0; i < 2; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2 > y3){
                                    x3Result = sT[j].y2;
                                } 
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }  
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                }   
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }
                }else{
                    //700
                }
            }
            //
            if(x3Result <= x4Result){
                if(cT.y3 + 50 < x3Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x4Result <= x3Result){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }

        }
        else if (cT.r == "face-right"){
            let x = cT.x;
            let x2 = cT.x2;
            let x4 = cT.x4;
            let y = cT.y;
            let y2 = cT.y2;
            let y4 = cT.y4;
            let xResult = 700;
            let x2Result = 700;
            let x4Result = 700;

            for(let i = 0; i < 3; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                }
                            }
                            
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x2 && sT[j].y < x2Result && sT[j].y > y2){
                                    x2Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x2 && sT[j].y2 < x2Result && sT[j].y2 > y2){
                                    x2Result = sT[j].y2;
                                }
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x2 && sT[j].y3 < x2Result && sT[j].y3 > y2){
                                    x2Result = sT[j].y3;
                                } 
                            }
                            
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x2 && sT[j].y4 < x2Result && sT[j].y4 > y2){
                                    x2Result = sT[j].y4;
                                }
                            }
                            
                        }
                    }else if (i == 2){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }  
                            }
                            
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                }
                            }
                           
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                } 
                            }
                            
                        }
                    }
                }else{
                    //
                }
            }
            //
            
            if (x2Result <= xResult && x2Result + 50 < x4Result ){
                if(cT.y2 + 50 < x2Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (xResult <= x2Result && xResult + 50  < x4Result ){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x4Result <= x2Result + 50  && x4Result <= xResult + 50 ){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                       
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
        else if (cT.r == "face-down"){
           let x = cT.x;
           let x4 = cT.x4;
            let y = cT.y;
            let y4 = cT.y4;
           let xResult = 700;
           let x4Result = 700;
            
           for(let i = 0; i < 2; i++){
               if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                }  
                            }         
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                } 
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                }   
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                }
                            }   
                        }
                    }
               }else{
                   //700
               }
           }
           //
           if(xResult -100  <= x4Result ){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                       
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
           }else if(x4Result < xResult -100 ){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                       
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
        else if (cT.r == "face-left"){
            let x = cT.x;
            let x2 = cT.x2;
            let x3 = cT.x3;
            let y = cT.y;
            let y2 = cT.y2;
            let y3 = cT.y3;
            let xResult = 700;
            let x2Result = 700;
            let x3Result = 700;

            for(let i = 0; i < 3; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                } 
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                } 
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                } 
                            } 
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x2 && sT[j].y < x2Result && sT[j].y > y2){
                                    x2Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x2 && sT[j].y2 < x2Result && sT[j].y2 > y2){
                                    x2Result = sT[j].y2;
                                }  
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x2 && sT[j].y3 < x2Result && sT[j].y3 > y2){
                                    x2Result = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x2 && sT[j].y4 < x2Result && sT[j].y4 > y2){
                                    x2Result = sT[j].y4;
                                }
                            }
                        }
                    }else if (i == 2){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2 > y3){
                                    x3Result = sT[j].y2;
                                } 
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                }
                            } 
                        }
                    }
                }else{
                    //
                }
            }
            //
            if(xResult <= x2Result && xResult <= x3Result){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x2Result <= xResult && x2Result <= x3Result){
                if(cT.y2 + 50 < x2Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x3Result <= xResult && x3Result <= x2Result){
                if(cT.y3 + 50 < x3Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                       
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
    }else if (cT.type == "S"){
        if(cT.r == "skew"){
            let x = cT.x;
            let x2 = cT.x2;
            let x4 = cT.x4;
            let y = cT.y;
            let y2 = cT.y2;
            let y4 = cT.y4;
            let xResult = 700;
            let x2Result = 700;
            let x4Result = 700;

            for(let i = 0; i < 3; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0 ; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                }
                            }  
                        }
                    }else if (i == 1){
                        for(let j = 0 ; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x2 && sT[j].y < x2Result && sT[j].y > y2){
                                    x2Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x2 && sT[j].y2 < x2Result && sT[j].y2 > y2){
                                    x2Result = sT[j].y2;
                                }  
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x2 && sT[j].y3 < x2Result && sT[j].y3 > y2){
                                    x2Result = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x2 && sT[j].y4 < x2Result && sT[j].y4 > y2){
                                    x2Result = sT[j].y4;
                                }
                            }
                        }
                    }else if (i == 2){
                        for(let j = 0 ; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                } 
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                } 
                            }  
                        }
                    }
                }else{
                    //700
                }
            }
            //
            if(xResult <= x2Result && xResult <= x4Result){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else {
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x2Result <= xResult && x2Result <= x4Result){
                if(cT.y2 + 50 < x2Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else {
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x4Result < xResult && x4Result < x2Result){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else {
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                       
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }

        }
        else if (cT.r == "vertical"){
            let x2 = cT.x;
            let x4 = cT.x4;
            let y2 = cT.y2;
            let y4 = cT.y4;
            let x2Result = 700;
            let x4Result = 700;

            for(let i = 0; i < 2; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x2 && sT[j].y < x2Result && sT[j].y > y2){
                                    x2Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x2 && sT[j].y2 < x2Result && sT[j].y2 > y2){
                                    x2Result = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x2 && sT[j].y3 < x2Result && sT[j].y3 > y2){
                                    x2Result = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x2 && sT[j].y4 < x2Result && sT[j].y4 > y2){
                                    x2Result = sT[j].y4;
                                }
                            }
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                } 
                            }
                        }
                    }
                }else{
                    //700
                }
            }
            //
            if(x4Result <= x2Result){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                       
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x2Result < x4Result){
                if(cT.y2 + 50 < x2Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                       
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
    }else if (cT.type == "Z"){
        if(cT.r == "z"){
            let x= cT.x;
            let x3 = cT.x3;
            let x4 = cT.x4;
            let y = cT.y;
            let y3 = cT.y3;
            let y4 = cT.y4;
            let xResult = 700;
            let x3Result = 700;
            let x4Result = 700;

            for(let i = 0; i < 3; i++){
                if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x && sT[j].y < xResult && sT[j].y > y){
                                    xResult = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x && sT[j].y2 < xResult && sT[j].y2 > y){
                                    xResult = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x && sT[j].y3 < xResult && sT[j].y3 > y){
                                    xResult = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x && sT[j].y4 < xResult && sT[j].y4 > y){
                                    xResult = sT[j].y4;
                                } 
                            } 
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x3 && sT[j].y < x3Result && sT[j].y > y3){
                                    x3Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x3 && sT[j].y2 < x3Result && sT[j].y2 > y3){
                                    x3Result = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x3 && sT[j].y3 < x3Result && sT[j].y3 > y3){
                                    x3Result = sT[j].y3;
                                } 
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x3 && sT[j].y4 < x3Result && sT[j].y4 > y3){
                                    x3Result = sT[j].y4;
                                }
                            }   
                        }
                    }else if (i == 2){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                } 
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                } 
                            } 
                        }
                    }
                }else{
                    //700
                }
            }
            //
            if(x3Result <= x4Result && x3Result <= xResult){
                if(cT.y3 + 50 < x3Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (x4Result <= x3Result && x4Result <= xResult){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }else if (xResult < x4Result && xResult < x3Result){
                if(cT.y + 50 < xResult){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                    
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
            }
        }
        else if (cT.r == "vertical"){
           let x2 = cT.x2;
           let x4 = cT.x4;
            let y2 = cT.y2;
            let y4 = cT.y4;
           let x2Result = 700;
           let x4Result = 700;

           for(let i = 0; i < 2; i++){
               if(sT.length >= 1){
                    if(i == 0){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x2 && sT[j].y < x2Result && sT[j].y > y2){
                                    x2Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x2 && sT[j].y2 < x2Result && sT[j].y2 > y2){
                                    x2Result = sT[j].y2;
                                }  
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x2 && sT[j].y3 < x2Result && sT[j].y3 > y2){
                                    x2Result = sT[j].y3;
                                } 
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x2 && sT[j].y4 < x2Result && sT[j].y4 > y2){
                                    x2Result = sT[j].y4;
                                } 
                            }   
                        }
                    }else if (i == 1){
                        for(let j = 0; j < sT.length; j++){
                            if(sT[j].x >= 0){
                                if(sT[j].x == x4 && sT[j].y < x4Result && sT[j].y > y4){
                                    x4Result = sT[j].y;
                                }
                            }
                            if(sT[j].x2 >= 0){
                                if(sT[j].x2 == x4 && sT[j].y2 < x4Result && sT[j].y2 > y4){
                                    x4Result = sT[j].y2;
                                }
                            }
                            if(sT[j].x3 >= 0){
                                if(sT[j].x3 == x4 && sT[j].y3 < x4Result && sT[j].y3 > y4){
                                    x4Result = sT[j].y3;
                                }
                            }
                            if(sT[j].x4 >= 0){
                                if(sT[j].x4 == x4 && sT[j].y4 < x4Result && sT[j].y4 > y4){
                                    x4Result = sT[j].y4;
                                }
                            }  
                        }
                    }
               }else {
                   //700
               }
           }
           //
           if(x4Result <= x2Result){
                if(cT.y4 + 50 < x4Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
           }else if (x2Result < x4Result){
                if(cT.y2 + 50 < x2Result){
                    cT.y += 50;
                    cT.y2 += 50;
                    cT.y3 += 50;
                    cT.y4 += 50;
                }else{
                    let overZero = false;
                    if(cT.y < 0){
                        overZero = true;
                    }
                    if(cT.y2 < 0){
                        overZero = true;
                    }
                    if(cT.y3 < 0){
                        overZero = true;
                    }
                    if(cT.y4 < 0){
                        overZero = true;
                    }
                    if(overZero){
                        clearInterval(movingDownInterval);
                        youLose = true;
                    }else{
                        sT.push(cT);
                        currentTetris = nextTetris;
                        randomShape(arrayOfTetris);
                        
                        //check if we have a row of 11 block, to score
                        checkToScore(sT);
                    }
                }
           }
        }
    }
    //reset shape here
    arrayOfTetris =  [
        //I has 2 shapes: vertical and straight
        {"type":"I", "r": "vertical" , "W": 50, "H": 50, "x": 200 , "y":-200 , "x2":200 , "y2": -150 , "x3":200 , "y3":-100 , "x4":200 , "y4":-50},
        //O has only 1 shape
        {"type":"O","W": 50, "H": 50, "r": "box" , "W": 50, "H": 50, "x": 200 , "y":-100 , "x2":250 , "y2": -100 , "x3":200 , "y3":-50 , "x4":250 , "y4":-50},
        //T has 4 shapes: face up(normal), face down, face left, face right
        //the face is the 3 sides box
        {"type":"T","W": 50, "H": 50, "r": "face-up" , "W": 50, "H": 50, "x": 200 , "y":-100 , "x2":250 , "y2": -100 , "x3":300 , "y3":-100 , "x4":250 , "y4":-50},
        //J has 4 shapes: face up , face left, face down, face right
        //face is the 4th box
        {"type":"J","W": 50, "H": 50, "r": "face-up" , "W": 50, "H": 50, "x": 200 , "y":-150 , "x2":200 , "y2": -100 , "x3":200 , "y3":-50 , "x4":150 , "y4":-50},
        //L has 4 shapes: face up, face down. face left, face right
        {"type":"L","W": 50, "H": 50, "r": "face-up" , "W": 50, "H": 50, "x": 200 , "y":-150 , "x2":200 , "y2": -100 , "x3":200 , "y3":-50 , "x4":250 , "y4":-50},
        //S has 2 shapes: skew, vertical
        {"type":"S","W": 50, "H": 50, "r": "skew" , "W": 50, "H": 50, "x": 200 , "y":-50 , "x2":250 , "y2": -50 , "x3":250 , "y3":-100 , "x4":300 , "y4":-100},
        //Z has 2 shapes: Z , vertical
        {"type":"Z","W": 50, "H": 50, "r": "z" , "W": 50, "H": 50, "x": 200 , "y":-100 , "x2":250 , "y2": -100 , "x3":250 , "y3":-50 , "x4":300 , "y4":-50}
    ];
}

function updateScore(score){
    let arrayOfScore = score.toString().split("");
    if(arrayOfScore.length == 7){
        score_7.textContent = arrayOfScore[0];
        score_6.textContent = arrayOfScore[1];
        score_5.textContent = arrayOfScore[2];
        score_4.textContent = arrayOfScore[3];
        score_3.textContent = arrayOfScore[4];
        score_2.textContent = arrayOfScore[5];
        score_1.textContent = arrayOfScore[6];
    }else if (arrayOfScore.length == 6){
        score_6.textContent = arrayOfScore[0];
        score_5.textContent = arrayOfScore[1];
        score_4.textContent = arrayOfScore[2];
        score_3.textContent = arrayOfScore[3];
        score_2.textContent = arrayOfScore[4];
        score_1.textContent = arrayOfScore[5];
    }else if (arrayOfScore.length == 5){
        score_5.textContent = arrayOfScore[0];
        score_4.textContent = arrayOfScore[1];
        score_3.textContent = arrayOfScore[2];
        score_2.textContent = arrayOfScore[3];
        score_1.textContent = arrayOfScore[4];
    }else if (arrayOfScore.length == 4){
        score_4.textContent = arrayOfScore[0];
        score_3.textContent = arrayOfScore[1];
        score_2.textContent = arrayOfScore[2];
        score_1.textContent = arrayOfScore[3];
    }else if (arrayOfScore.length == 3){
        score_3.textContent = arrayOfScore[0];
        score_2.textContent = arrayOfScore[1];
        score_1.textContent = arrayOfScore[2];
    }else if (arrayOfScore.length == 2){
        score_2.textContent = arrayOfScore[0];
        score_1.textContent = arrayOfScore[1];
    }else if (arrayOfScore.length == 1){
        score_1.textContent = arrayOfScore[0];
    }
}

/*---calls---*/
listeningToMove();

let movingDownInterval = setInterval(function movingDownIntervalFunction(){
    movingBlockDown(currentTetris, store);
    updateScore(score);
},500)

let gameInterval = setInterval(function gameIntervalFunction(){
    draw(ctx, currentTetris, store, nextTetris);
}, 1)


//step by step
/*
-first
    -draw the layout
    -width is 11 block, height is 14 block
    -50 px for 1 block
    -250 pixel for information like what's next
    -othe than that, it's game board

-variables
    -store
    -currentTetris
    -nextTetris
    -scores
    -arrayOfTetris - you random out of this
    -
-draw
    -draw board
    -draw information
    -draw shapes
        -4X
        -4Y
        -w
        -h
        -ctx
-shape
    -I - 2 shapes
    -O - 1 shape
    -T - 4 shapes
    -J - 4 shapes
    -L - 4 shapes
    -S - 2 shapes
    -Z - 2 shapes
-change shape
    -https://en.wikipedia.org/wiki/Tetromino#:~:text=A%20tetromino%20is%20a%20geometric,edges%20and%20not%20the%20corners).
    -Fixed Tetrominoes
-function
    -randomTetris() - set up next tetris to drop
    -translateShape() - there are a range of shapes to go through
    -draw()
    -movingDown()
    -evaluate() - is it 11 in a row of block
    -movingLeftOrRight
    -etc...
-interval
    -1 second game
    -500 moving down
*/
