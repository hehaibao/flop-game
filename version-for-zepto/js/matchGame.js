/*
 @desc 翻牌抽奖
 @author haibao [http://www.hehaibao.com] [hhb219@163.com]
 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 // 佛祖保佑  永无BUG
 // 佛曰:
 //      写字楼里写字间，写字间里程序员；
 //      程序人员写程序，又拿程序换酒钱。
 //      酒醒只在网上坐，酒醉还来网下眠；
 //      酒醉酒醒日复日，网上网下年复年。
 //      但愿老死电脑间，不愿鞠躬老板前；
 //      奔驰宝马贵者趣，公交自行程序员。
 //      别人笑我忒疯癫，我笑自己命太贱；
 //      不见满街漂亮妹，哪个归得程序员？
 **/
var time,
    wait,
    isLock = 0, //是否已开始
    timer1 = timer2 = null,
    $time = $('#time'),
    $time_desc = $('#time_desc'),
    $start = $('.start'),
    $popover = $('.popover'),
    $popover_ = $('.popover_'),
    $modal = $('.popover,.modal'),
    $dot = $('#dot'),
    $lottery_btn = $('#lottery_btn'),
    dumpBase = {
        isEnd: null
    };

//记忆时间 开始游戏
function start_game() {
    if(dumpBase.isEnd == 2) {
        showToast('准备开始记忆啦~', 2000);
        close_popover();
        $popover_.hide();
        isLock  = sessionStorage.getItem('CARD_ISLOCK');
        if(isLock == 0) {
            isLock = 1;
            sessionStorage.setItem('CARD_ISLOCK', 1);
            setTimeout(function () {
                $('.card').find('.back').addClass('flip');
                countdown(this, time, wait, isLock);
            }, 2500);
        }
    } else {
        showModal(6);
        return;
    }
}

//倒计时 开始游戏
function start_game2() {
    showToast('游戏开始，加油！');
    setTimeout(function() {
        isLock = 2;
        sessionStorage.setItem('CARD_ISLOCK',2);
        countdown(this, time, wait, isLock);
    },500);
}

//卡牌渲染
function init() {
    $('#wrapper').show();

    //卡牌数据，演示用，建议随机展示
    var cardArrs = [
        {
            index: 0,
            logoImgUrl: 'http://satyr.io/80x80?flag=cze'
        },
        {
            index: 5,
            logoImgUrl: 'http://satyr.io/80x80?brand=github'
        },
        {
            index: 1,
            logoImgUrl: 'http://satyr.io/80x80?flag=svk'
        },
        {
            index: 4,
            logoImgUrl: 'http://satyr.io/80x80?brand=apple'
        },
        {
            index: 2,
            logoImgUrl: 'http://satyr.io/80x80?flag=che'
        },
        {
            index: 3,
            logoImgUrl: 'http://satyr.io/80x80?brand=facebook'
        },
        {
            index: 1,
            logoImgUrl: 'http://satyr.io/80x80?flag=svk'
        },
        {
            index: 0,
            logoImgUrl: 'http://satyr.io/80x80?flag=cze'
        },
        {
            index: 5,
            logoImgUrl: 'http://satyr.io/80x80?brand=github'
        },
        {
            index: 2,
            logoImgUrl: 'http://satyr.io/80x80?flag=che'
        },
        {
            index: 4,
            logoImgUrl: 'http://satyr.io/80x80?brand=apple'
        },
        {
            index: 3,
            logoImgUrl: 'http://satyr.io/80x80?brand=facebook'
        }
    ],
    cardLen = cardArrs.length,
    tpl = '',
    cardWidth = 80, //牌宽
    cardHeight = 80, //牌高
    currentDate = new Date(),
    now = getFormatDate(currentDate), //当前日期
    end = getFormatDate('2048-10-24'); //活动结束日期，具体根据接口返回值来

    dumpBase.isEnd = timeContrast(now, end); //日期对比，判断活动是否已结束

    //判断活动是否结束
    if(dumpBase.isEnd == 1) {
        showModal(6);
        $start.removeClass('active');
    } else {
        $start.addClass('active'); //启用开始按钮
    }
    
    time = 10; //记忆时间
    wait = 20; //倒计时时间
    $('#time').text(time);

    //活动规则加载，此处写死内容，具体根据接口返回值来
    $(".m2 .contents").html('<p style="text-align:center;">填写手机号，在记忆时间内看一遍所有卡牌，记忆时间（10秒）结束后开始游戏，游戏时间20秒，每点击一张卡牌后，需要找到相同的另一张卡牌即可配对成功，所有卡牌匹配完成后即可获得抽奖机会。</p>');

    for(var i=0; i<cardLen; i++) {
        tpl += '<div class="card"><div class="face front"></div><div class="face back"></div></div>';
    }
    $("#cards").html(tpl);
    $('.card').each(function(i) {
        $(this).css({ "left": (cardWidth+13)*(i%3), "top": (cardHeight+13)*Math.floor(i/3) });
        $(this).data("pattern", cardArrs[i]['index']); //暂存牌号
        $(this).find(".back").css({"background":"url("+cardArrs[i]['logoImgUrl']+") no-repeat center center","background-size":"contain"}); //把其翻牌后的对应牌面附加上去
    }).click(function() {
        //翻牌功能的实现
        isLock = sessionStorage.getItem('CARD_ISLOCK');
        if(isLock == 2) {
            var $fcard = $(".card-flipped").not('.card-removed');
            if($fcard.length > 1) return; //翻了两张牌后禁止再翻
            if(!$(this).hasClass('card-removed')) {
                $(this).addClass("card-flipped");
                var $fcards = $(".card-flipped").not('.card-removed');
                if($fcards.length == 2) {
                    //若翻动了两张牌，检测一致性
                    setTimeout(function() {
                        var pattern1 = $($fcards[0]).data("pattern"), 
                            pattern2 = $($fcards[1]).data("pattern");
                        if(pattern1 == pattern2) { //一致
                            $($fcards).addClass("card-removed");
                            setTimeout(function() {
                                cardLen = cardLen - 2;
                                if(cardLen == 0) {
                                    gameover(4);
                                }
                            }, 100);
                        } else { //不一致
                            $($fcards).removeClass("card-flipped");
                        }
                    }, 700);
                }
            }
        } else {
            showToast('游戏还未开始！');
        }
    });
    $('#mobile_ipt').val(sessionStorage.getItem('CARD_MOBILE')).removeAttr('disabled'); //启用输入框并填充手机号
    init_status();
}

//初始化状态
function init_status() {
    isLock = 0;
    sessionStorage.setItem('CARD_ISLOCK', 0);
}

//游戏结束
function gameover(a) {
    clearTimeout(timer2);
    $time_desc.text('记忆时间:');
    $time.text(time);
    $('.modal.m3').find('.close_btn').removeAttr('id');
    init_status();
    showModal(a);
    if(dumpBase.isEnd == 1) {
        init();
    }
    dumpBase.isEnd = 1;
}

//我的中奖纪录
function myLotteryList(mobile) {
    //此处请求中奖记录接口 TODO
    showModal(3);
    $('#records').html('<li class="empty_record"><p>还没有中奖哦～</p></li>');
}

//开始抽奖
function lottery() {
    $lottery_btn.removeClass('active');

    //此处请求抽奖接口

    //中奖了 演示而已
    $('#lottery_name').text('一等奖');
    //$dot.show();
    showModal(7); 

    //未中奖
    //$('.modal.m5').find('.modal_tips').hide().eq(1).show();
    //showModal(5); //未中奖

    $lottery_btn.addClass('active');
}

//倒计时 btnID:按钮ID；time:记忆时间；wait:游戏时间；isLock:游戏状态
function countdown(btnID, time, wait, isLock) {
    if(isLock == 1) {
        if(time == 0) {
            $('.card').find('.back').removeClass('flip');
            $time_desc.text('倒计时间:');
            time = wait;
            $time.text(time);
            start_game2();
        } else {
            time--;
            $time.text(time);
            timer1 = setTimeout(function() { 
                countdown(btnID,time,wait,isLock); 
            },1000);
        }
    } else {
        if(wait == 0) {
            $time_desc.text('记忆时间:');
            wait = time;
            $time.text(time);
            $('.modal.m5').find('.modal_tips').hide().eq(0).show();
            $('.modal.m3').find('.close_btn').removeAttr('id');
            showModal(5);
            init();
        } else {
            wait--;
            $time.text(wait);
            timer2 = setTimeout(function() { 
                countdown(btnID,time,wait,isLock); 
            },1000);
        }
    }
}

//关闭弹出层
function close_popover() {
    $popover.hide();
}

//显示某个弹出层
function showModal(i) {
    $modal.hide();
    $popover.show().find('.m'+i).show();
}

$(function() {
    FastClick.attach(document.body); //解决点击300ms延迟

    init(); //卡牌初始化

    //开始游戏
    $start.on('click', function() {
        if($(this).hasClass('active')){
            var tel = $('#mobile_ipt').val(), 
                telReg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/);
            if(tel == '') {
                showToast('请输入手机号码~');
            } else if(tel.length != 11 || telReg == false) {
                showToast('手机号码格式错误~');
            } else {
                sessionStorage.setItem('CARD_MOBILE', tel);
                start_game();
            }
        } else {
            showToast('该活动已结束！', 2000);
            return;
        }
    });

    //按钮点击事件
    $('.modal_btns, .btns_rt, .close_').on('click', function() {
        var theID = $(this).attr('id');
        if(theID == 'receive_btn') {
            window.location.href = 'http://www.hehaibao.com/'; //领奖地址，我们之前是APP的下载地址，需要请自行修改
        }else if(theID == 'lottery_btn') {
            $(this).hasClass('active') ? lottery() : showToast('正在抽奖中，请稍候...',1500); //抽奖
        }else if(theID == 'again_btn' || theID == 'come_again_btn' || theID == 'come_again_btn2'){
            start_game(); //再玩一次
        }else if(theID == 'close_btn2' || theID == 'close_btn4') {
            close_popover(); //知道了
            setTimeout(function(){ $popover_.show(); },300);
        }else if(theID == 'konw_btn' || theID == 'konw_btn2') {
            close_popover(); //知道了
        }else if(theID == 'view_record_btn' || theID == 'view_record_btn2') {
            var isLockd = sessionStorage.getItem('CARD_ISLOCK'), mobile = sessionStorage.getItem('CARD_MOBILE');
            if(isLockd == null) return;
            if(isLockd != 0) {
                showToast('正在游戏中，请稍后再试～',1500);
                return;
            }else {
                if (mobile != null) {
                    $('.default_mobile').text(replaceMobile(mobile, 3, 4));
                }else{
                    showToast('请输入手机号码~');
                    return;
                }
                myLotteryList(mobile);
                showModal(3); //中奖纪录
            }
        }
    });

    //活动规则
    $('.rules').on('click', function() {
        clearTimeout(timer1); clearTimeout(timer2); //游戏中点击活动规则 暂停倒计时
        showModal(2);
    });

    //关闭弹出层
    $('.close_btn').on('click', function() {
        var close_btn_id = $(this).attr('id'), lock_status = sessionStorage.getItem('CARD_ISLOCK');
        close_popover();
        if(lock_status == null) return;
        //关闭活动规则 继续开始
        if(close_btn_id == 'close_btn5' && lock_status != '0') {
            if(lock_status == 1) {
                time = $time.text();
            } else {
                wait = $time.text();
            }
            countdown(this, time, wait, isLock);
        }
        if(lock_status == 0) {
            setTimeout(function() { 
                $popover_.show();
            },300);
        }
    });
});