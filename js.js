/**
 * Created by kin on 2016/2/29.
 */
var WINDOW_WIDTH ;//网页可见区域宽
var WINDOW_HEIGHT ;//网页可见区域高
var RADIUS;//圆的半径
var MARGIN_TOP;//坐标原点Y轴
var MARGIN_LEFT;//坐标原点X轴

var endTime = new Date();//获取当前时间
endTime.setTime(endTime.getTime()+3600*24000);//结束时间为当前时间再加一天
var curShowTimeSeconds = 0;

var balls = [];//定义小球
var colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];//小球的颜色

$(function(){

    WINDOW_WIDTH = document.body.clientWidth;//获取网页可见区域宽
    WINDOW_HEIGHT = document.body.clientHeight;//获取网页可见区域高

    MARGIN_LEFT = Math.round(WINDOW_WIDTH /10);//绘制各点阵的坐标X
    MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);//绘制各点阵的坐标Y
    RADIUS = Math.round(WINDOW_WIDTH/5*4/108)-1;//球的半径


    var canvas = document.getElementById('canvas');//获取画布
    var context = canvas.getContext("2d");//获取上下文环境

    //屏幕自适应
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();

    setInterval(
        function () {
            render(context);//绘制画布
            update();//更新
        }, 50//20帧
    );
});

function getCurrentShowTimeSeconds() {
    var curTime = new Date();//获取当前时间
    var ret = endTime.getTime() - curTime.getTime();//获取差值
    ret = Math.round( ret/1000 );//去除毫秒数
    return ret;//返回差值
}

function update(){
    //时间的变化
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();
    //获取下一个时间
    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 );
    var nextSeconds = nextShowTimeSeconds % 60;
    //获取当前时间
    var curHours = parseInt( curShowTimeSeconds / 3600);
    var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600)/60 );
    var curSeconds = curShowTimeSeconds % 60;
    //比较差异，如有差异就在差异的点阵上增加球
    if( nextSeconds != curSeconds ){
        if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }
        //更新当前时间
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    //更新球的位置
    updateBalls();//球的变化
}

function updateBalls(){//球的变化

    for( var i = 0 ; i < balls.length ; i ++ ){//取小球的数量做循环

        balls[i].x += balls[i].vx;//小球的X轴加X方向的速度
        balls[i].y += balls[i].vy;//小球的Y轴加Y方向的速度
        balls[i].vy += balls[i].g;//小球的Y轴加速度

        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){//碰撞检测
            balls[i].y = WINDOW_HEIGHT-RADIUS;//小球着地
            balls[i].vy = - balls[i].vy*0.7;//空气阻力摩擦系数
        }
    }
    //判断小球是否可以删掉
    var cnt = 0;//数量
    for( var i = 0 ; i < balls.length ; i ++ )
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )//判断是否出了画布边缘
            balls[cnt++] = balls[i];//重新定义小球

    while( balls.length > cnt ){
        balls.pop();//删除末尾的小球，只保留cnt个小球
    }
}

function addBalls( x , y , num ){//添加小球

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){//点阵为1，添加小球
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),//小球的X坐标
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),//小球的Y坐标
                    g:1.5+Math.random(),//小球的加速度
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,//取-1或者1的值*4
                    vy:-5,//Y的速度
                    color: colors[ Math.floor( Math.random()*colors.length ) ]//随机颜色
                };

                balls.push( aBall ); //添加这个小球
            }
}

function render( cxt ){

    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);//清除画布

    var hours = parseInt( curShowTimeSeconds / 3600);//获取小时数
    var minutes = parseInt( (curShowTimeSeconds - hours * 3600)/60 );//获取分钟数
    var seconds = curShowTimeSeconds % 60;//获取秒数

    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt );//小时的十位数
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt );//小时的个位数
    renderDigit( MARGIN_LEFT + 30*(RADIUS+1) , MARGIN_TOP , 10 , cxt );//冒号
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);//分钟的十位数
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);//分钟的个位数
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);//冒号
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);//秒的十位数
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);//秒的个位数

    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;//小球赋予颜色
        //绘制小球
        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI);
        cxt.closePath();

        cxt.fill();
    }
}

function renderDigit( x , y , num , cxt ){

    cxt.fillStyle = "blue";//倒计时颜色

    for( var i = 0 ; i < digit[num].length ; i ++ )
        for(var j = 0 ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){//判断是否绘制时间点

                cxt.beginPath();
                cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI );
                cxt.closePath();

                cxt.fill()
            }
}