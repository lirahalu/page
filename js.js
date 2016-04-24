/**
 * Created by kin on 2016/2/29.
 */
var WINDOW_WIDTH ;//��ҳ�ɼ������
var WINDOW_HEIGHT ;//��ҳ�ɼ������
var RADIUS;//Բ�İ뾶
var MARGIN_TOP;//����ԭ��Y��
var MARGIN_LEFT;//����ԭ��X��

var endTime = new Date();//��ȡ��ǰʱ��
endTime.setTime(endTime.getTime()+3600*24000);//����ʱ��Ϊ��ǰʱ���ټ�һ��
var curShowTimeSeconds = 0;

var balls = [];//����С��
var colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];//С�����ɫ

$(function(){

    WINDOW_WIDTH = document.body.clientWidth;//��ȡ��ҳ�ɼ������
    WINDOW_HEIGHT = document.body.clientHeight;//��ȡ��ҳ�ɼ������

    MARGIN_LEFT = Math.round(WINDOW_WIDTH /10);//���Ƹ����������X
    MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);//���Ƹ����������Y
    RADIUS = Math.round(WINDOW_WIDTH/5*4/108)-1;//��İ뾶


    var canvas = document.getElementById('canvas');//��ȡ����
    var context = canvas.getContext("2d");//��ȡ�����Ļ���

    //��Ļ����Ӧ
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();

    setInterval(
        function () {
            render(context);//���ƻ���
            update();//����
        }, 50//20֡
    );
});

function getCurrentShowTimeSeconds() {
    var curTime = new Date();//��ȡ��ǰʱ��
    var ret = endTime.getTime() - curTime.getTime();//��ȡ��ֵ
    ret = Math.round( ret/1000 );//ȥ��������
    return ret;//���ز�ֵ
}

function update(){
    //ʱ��ı仯
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();
    //��ȡ��һ��ʱ��
    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 );
    var nextSeconds = nextShowTimeSeconds % 60;
    //��ȡ��ǰʱ��
    var curHours = parseInt( curShowTimeSeconds / 3600);
    var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600)/60 );
    var curSeconds = curShowTimeSeconds % 60;
    //�Ƚϲ��죬���в�����ڲ���ĵ�����������
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
        //���µ�ǰʱ��
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    //�������λ��
    updateBalls();//��ı仯
}

function updateBalls(){//��ı仯

    for( var i = 0 ; i < balls.length ; i ++ ){//ȡС���������ѭ��

        balls[i].x += balls[i].vx;//С���X���X������ٶ�
        balls[i].y += balls[i].vy;//С���Y���Y������ٶ�
        balls[i].vy += balls[i].g;//С���Y����ٶ�

        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){//��ײ���
            balls[i].y = WINDOW_HEIGHT-RADIUS;//С���ŵ�
            balls[i].vy = - balls[i].vy*0.7;//��������Ħ��ϵ��
        }
    }
    //�ж�С���Ƿ����ɾ��
    var cnt = 0;//����
    for( var i = 0 ; i < balls.length ; i ++ )
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )//�ж��Ƿ���˻�����Ե
            balls[cnt++] = balls[i];//���¶���С��

    while( balls.length > cnt ){
        balls.pop();//ɾ��ĩβ��С��ֻ����cnt��С��
    }
}

function addBalls( x , y , num ){//���С��

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){//����Ϊ1�����С��
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),//С���X����
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),//С���Y����
                    g:1.5+Math.random(),//С��ļ��ٶ�
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,//ȡ-1����1��ֵ*4
                    vy:-5,//Y���ٶ�
                    color: colors[ Math.floor( Math.random()*colors.length ) ]//�����ɫ
                };

                balls.push( aBall ); //������С��
            }
}

function render( cxt ){

    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);//�������

    var hours = parseInt( curShowTimeSeconds / 3600);//��ȡСʱ��
    var minutes = parseInt( (curShowTimeSeconds - hours * 3600)/60 );//��ȡ������
    var seconds = curShowTimeSeconds % 60;//��ȡ����

    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt );//Сʱ��ʮλ��
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt );//Сʱ�ĸ�λ��
    renderDigit( MARGIN_LEFT + 30*(RADIUS+1) , MARGIN_TOP , 10 , cxt );//ð��
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);//���ӵ�ʮλ��
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);//���ӵĸ�λ��
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);//ð��
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);//���ʮλ��
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);//��ĸ�λ��

    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;//С������ɫ
        //����С��
        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI);
        cxt.closePath();

        cxt.fill();
    }
}

function renderDigit( x , y , num , cxt ){

    cxt.fillStyle = "blue";//����ʱ��ɫ

    for( var i = 0 ; i < digit[num].length ; i ++ )
        for(var j = 0 ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){//�ж��Ƿ����ʱ���

                cxt.beginPath();
                cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI );
                cxt.closePath();

                cxt.fill()
            }
}