<template>
<div class="fw">
  <div id="wrapper">
    <div id="banner" class="fw pr">
      <p class="tc rule_box"><a @click="showModal(2)" class="rules">活动规则 >> </a></p>
    </div>

    <div id="btns" class="tc">
      <a class="fl btn btns_lf">
        <span id="time_desc">{{ timeDesc }}</span>
        <span id="time" class="fr tc">{{ time }}</span>
      </a>
      <a @click="myLotteryList" class="btn btns_rt fr pr">
        <span>查看中奖纪录</span>
        <span id="dot" v-if="showDot"></span>
      </a>
    </div>

    <div id="card_box" class="pr">
      <div id="cards">
          <div v-for="(card, $index) in cardArrs" :key="$index" class="card" :class="{ 'card-flipped': cardFlip }" ref='cards' :style="{ left: parseInt(cardWidth+13) * ($index%3) + 'px', top: parseInt(cardHeight+13) * Math.floor($index/3) + 'px' }" @click="clickCard(card['index'], $index)">
            <div class="face front"></div>
            <div class="face back" :class="{ 'flip': cardFlip }" :style="{ backgroundImage: `url(${card['logoImgUrl']})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundSize: 'contain' }"></div>
          </div>
      </div>

      <!--游戏玩法说明-->
      <div class="popover_ fw" v-if="isLock==0">
        <div class="modal_">
          <p class="tc rule_title">游戏玩法说明</p>
          <div id="rule_desc">
            <p>1. 在规定时间内，记忆牌面内容及位置；</p>
            <p>2. 游戏中，点击任意两张牌，若相同则可翻开，规定时间内全部配对成功即过关；</p>
            <p>3. 顺利过关可以获得一次抽奖机会。</p>
          </div>
          <div id="mobile_box" class="tc">
            <input type="tel" name="mobile" v-model="mobile" maxlength="11" class="tc" placeholder="请输入手机号码" id="mobile_ipt"/>
          </div>
          <p class="tc">
            <a class="start" :class="{ active: mobile }" @click="startGame"></a>
          </p>
        </div>
      </div>
    </div>
  </div>

  <!--popover-->
  <div class="popover fw pf" :class="[showModalIndex==null ? 'dn' : '']">

    <!--活动规则-->
    <div class="modal m2" v-if="showModalIndex==2">
      <div class="head"></div>
      <div class="contents"><p class="tc c-white">{{ ruleContent }}</p></div>
      <a class="close_btn" @click="closeModal"></a>
    </div>

    <!---中奖纪录-->
    <div class="modal m3" v-if="showModalIndex==3">
      <div class="head"></div>
      <div class="info tc">
        <p>请用手机号码<span class="default_mobile">{{ replaceMobile(mobile, 3, 4) }}</span></p>
        <p>快捷登录“APP”领取奖品</p>
      </div>
      <div class="contents tc">
        <ul id="records">
            <li v-if="myLottery.length" v-for="(record, $index) in myLottery" :key="$index">{{ record }}</li>
            <li v-if="!myLottery.length">暂无中奖记录</li>
        </ul>
        <p><a class="modal_btns br20" v-if="mobile" @click="receive" id="receive_btn">去领奖</a></p>
      </div>
      <a class="close_btn" @click="closeModal"></a>
    </div>

    <!---恭喜过关-->
    <div class="modal m4" v-if="showModalIndex==4">
      <div class="head"></div>
      <div class="contents tc">
        <p class="modal_tips">恭喜您，获得了一次抽奖机会</p>
        <p><a class="modal_btns active" id="lottery_btn" @click="lottery">赶快去抽奖</a></p>
      </div>
    </div>

    <!---谢谢参与-->
    <div class="modal m5" v-if="showModalIndex==5">
      <div class="head"></div>
      <div class="contents tc">
        <p class="modal_tips" v-if="!showTip">手速不够快，再来一次！</p>
        <p class="modal_tips" v-if="showTip">太遗憾了，奖品与你擦肩而过</p>
        <p class="fw oh">
          <a class="modal_btns fl ls8" @click="closeModal">关闭</a>
          <a class="modal_btns fr" @click="playAgain">再玩一次</a>
        </p>
      </div>
    </div>

    <!---活动已结束-->
    <div class="modal m6" v-if="showModalIndex==6">
      <div class="head"></div>
      <div class="contents tc">
        <p class="modal_tips">真遗憾，本次活动已经结束啦，下回趁早哦！</p>
        <p><a class="modal_btns br20" @click="closeModal">知道了</a></p>
      </div>
      <a class="close_btn" @click="closeModal"></a>
    </div>

    <!---恭喜中奖-->
    <div class="modal m7" v-if="showModalIndex==7">
      <div class="head"></div>
      <div class="contents">
        <p class="modal_tips tc">恭喜您获得了：<span id="lottery_name">{{ lotteryName }}</span>哦～</p>
        <p class="fw oh">
          <a class="modal_btns fl" @click="myLotteryList">查看奖品</a>
          <a class="modal_btns fr" @click="playAgain">再玩一次</a>
        </p>
      </div>
      <a class="close_btn" @click="closeModal"></a>
    </div>

  </div>

</div>
</template>

<style lang="css">
  @import '../assets/css/style';
</style>

<script>
  // 显示提示框
  var toastTimer = null;
  function showToast(message, t) {
      var alert = document.getElementById('toast');
      if(alert == null) {
          alert = document.createElement("div");
          alert.id = 'toast';
          alert.className = 'fd';
          alert.innerText = message;
      } else {
          alert.style.opacity = .9;
      }
      document.body.appendChild(alert);
      t = t ? t : 1000;
      toastTimer = setTimeout(function() {
        hideToast();
      }, t);
  }

  // 隐藏提示框
  function hideToast() {
      var alert = document.getElementById('toast');
      if(alert != null) {
          document.body.removeChild(alert);
          clearTimeout(toastTimer);
      }
  }

  // 查找是否包含某classname
  var hasClass = (function(){
      var div = document.createElement("div") ;
      if( "classList" in div && typeof div.classList.contains === "function" ) {
          return function(elem, className){
              return elem.classList.contains(className) ;
          } ;
      } else {
          return function(elem, className){
              var classes = elem.className.split(/\s+/) ;
              for(var i= 0 ; i < classes.length ; i ++) {
                  if( classes[i] === className ) {
                      return true ;
                  }
              }
              return false ;
          } ;
      }
  })() ;

  const [ TM1, TM2 ] = [ 10, 20]; // 记忆时间和倒计时时间
  export default {
	  	data() {
	        return {
            time: TM1, // 倒计时时间
            timeDesc: '', // 区分是记忆时间还是倒计时
            timer: null, // 计时器
            showDot: false, // 是否显示圆点通知
            showTip: false, // 区别显示modal5里的提示文案
            mobile: '', // 手机号
            showModalIndex: null, // 当前显示的遮罩
            isLock: 0, // 游戏状态
            isEnd: 2, // 是否活动结束
            myLottery: [], // 我的中奖记录数组
            lotteryName: '', // 当前中奖的名称
            cardArrs: [], // 卡牌列表
            cardWidth: 80, // 卡牌宽度
            cardHeight: 80, // 卡牌高度
            cardFlip: '', // 卡牌翻转的样式
            cardSelectedArr: [], // 临时存放当前点击的卡牌信息
            cardSelectedNum: 0, // 存放已点卡牌的数量
            ruleContent: '' // 活动规则
	        }
      },
      mounted() {
	        this.init(); // 初始化 
	    },
	    methods: {
	        async init() {
              let self = this;

              const imgBasePath = 'http://satyr.io/80x80';

              // 根据活动 开始时间-结束时间 对比是否结束
              const currentTime = new Date();
              const [ now, end ] = [ self.getFormatDate(currentTime), self.getFormatDate('2048-10-24') ]; // 当前日期, 活动结束日期
              self.isEnd = self.timeContrast(now, end); // 日期对比，判断活动是否已结束

              // 时间文案
              self.time = TM1;
              self.timeDesc = '记忆时间:';

              // 加载活动规则
              self.ruleContent = '填写手机号，在记忆时间内看一遍所有卡牌，记忆时间（10秒）结束后开始游戏，游戏时间20秒，每点击一张卡牌后，需要找到相同的另一张卡牌即可配对成功，所有卡牌匹配完成后即可获得抽奖机会。';

              // 判断活动是否结束
              if(self.isEnd === 1) {
                  self.showModal(6);
                  return;
              }

              // 重置中奖的名称
              self.lotteryName = '';

              // 重置卡牌选中的数量
              self.cardSelectedNum = 0;

              // 重置所有卡牌至背面
              self.cardFlip = '';

              // 加载卡牌列表（伪造数据）
              self.cardArrs = [
                  {
                      index: 0,
                      logoImgUrl: imgBasePath+'?flag=cze'
                  },
                  {
                      index: 5,
                      logoImgUrl: imgBasePath+'?brand=github'
                  },
                  {
                      index: 1,
                      logoImgUrl: imgBasePath+'?flag=svk'
                  },
                  {
                      index: 4,
                      logoImgUrl: imgBasePath+'?brand=apple'
                  },
                  {
                      index: 2,
                      logoImgUrl: imgBasePath+'?flag=che'
                  },
                  {
                      index: 3,
                      logoImgUrl: imgBasePath+'?brand=facebook'
                  },
                  {
                      index: 1,
                      logoImgUrl: imgBasePath+'?flag=svk'
                  },
                  {
                      index: 0,
                      logoImgUrl: imgBasePath+'?flag=cze'
                  },
                  {
                      index: 5,
                      logoImgUrl: imgBasePath+'?brand=github'
                  },
                  {
                      index: 2,
                      logoImgUrl: imgBasePath+'?flag=che'
                  },
                  {
                      index: 4,
                      logoImgUrl: imgBasePath+'?brand=apple'
                  },
                  {
                      index: 3,
                      logoImgUrl: imgBasePath+'?brand=facebook'
                  }
              ];

              // 重置JS添加的卡牌classname 待优化
              if(this.$refs.cards) {
                  self.cardArrs.forEach(function(res, index) {
                      self.$refs.cards[index].className = 'card';
                  });
              }

              // 从缓存取手机号
              self.mobile = sessionStorage.getItem('CARD_MOBILE') || '';

              // 初始化游戏状态
              self.initStatus(0);
          },
          initStatus(status) {
              // 初始化游戏状态 0：未开始，1：记忆时间；2：倒计时时间
              this.isLock = status || 0;
              sessionStorage.setItem('CARD_ISLOCK', status || 0);
          },
          startGame() {
              // 记忆时间
              let self = this;
              if(self.isEnd === 1) {
                  // 活动已结束，提示
                  showToast('活动已结束！谢谢参与。');
                  return;
              }
              let telReg = !!self.mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/);
              if(!self.mobile) {
                  showToast('请输入手机号码~');
              } else if(self.mobile.length != 11 || telReg == false) {
                  showToast('手机号码格式错误~');
              } else {
                  sessionStorage.setItem('CARD_MOBILE', self.mobile);

                  showToast('准备开始记忆啦~', 2000);
                  self.isLock  = sessionStorage.getItem('CARD_ISLOCK');
                  if(self.isLock == 0) {
                      self.initStatus(1); // 更改状态
                      setTimeout(function() {
                          self.cardFlip = 'card-flipped'; // 翻开牌子
                          self.countdown(); // 开始倒计时
                      }, 2500);
                  }
              }
          },
          startPlaying() {
              // 倒计时 开始游戏
              let self = this;
              showToast('游戏开始，加油！');
              setTimeout(function() {
                  self.initStatus(2); // 更改状态
                  self.countdown();
              }, 500);
          },
          clickCard(val, index) {
              // 点击卡牌 待优化
              this.isLock = sessionStorage.getItem('CARD_ISLOCK');
              if(this.isLock == 2) {
                  // 游戏中
                  var $fcards = this.$refs.cards;
                  var $fcard = $fcards[index];

                  // 防止重复点击已点开的卡牌
                  if(hasClass($fcard, "card-flipped")) {
                      return;
                  }

                  // 记录点击的卡牌信息
                  this.cardSelectedArr.push({ key: index, value: val });

                  // 给卡牌添加classname
                  $fcards.className = 'card';
                  $fcard.className = 'card card-flipped';

                  // 若翻动了两张牌，检测一致性
                  if(this.cardSelectedArr.length == 2) {
                      let self = this;
                      setTimeout(function() {
                          if(self.cardSelectedArr[0].value != self.cardSelectedArr[1].value) {
                              // 两张卡牌不一致，重置
                              self.cardSelectedArr.forEach(function(res) {
                                  $fcards[res.key].className = 'card';
                              });
                          } else {
                              self.cardSelectedNum += 2; // 记录成功的卡牌数量

                              if(self.cardSelectedNum == self.cardArrs.length) {
                                  // 判断已点开卡牌数量和总数量是否相等
                                  self.gameover();
                              }
                          }
                          self.cardSelectedArr = []; // 清空数组，为了保证数组里最多存在2条数据
                      }, 400);
                  }
              } else {
                  showToast('游戏还未开始！');
              }
          },
          gameover() {
              // 游戏结束
              clearTimeout(this.timer);
              this.showTip = true;
              this.showModal(4);
              this.init();
          },
          lottery() {
              // 抽奖
              // 此处请求抽奖接口
              const status = 1; // 假设1为中奖状态
              if(status === 1) {
                  // 中奖了 演示而已
                  const lotteryArr = ['特等奖', '一等奖', '二等奖', '三等奖', '安慰奖'];
                  let randomV = Math.floor(Math.random()*(lotteryArr.length+1));
                  this.lotteryName = lotteryArr[randomV]; // 暂存奖品名称
                  this.myLottery.push(this.lotteryName);
                  this.showDot = true; // 只有中奖才会显示未读圆点
                  this.showModal(7);
              } else {
                  // 未中奖
                  this.showTip = false;
                  this.showModal(5); // 未中奖
              }
          },
          myLotteryList() {
              // 我的中奖纪录
              if(this.mobile) {
                  this.showModal(3);
                  // 此处请求中奖记录接口 TODO
                  this.showDot = false; // 将未读圆点标记为已读
              } else {
                  showToast('请输入手机号码');
              }
          },
          playAgain() {
              // 再玩一次
              this.closeModal();
              this.init();
              this.startGame();
          },
          receive() {
              // 去领奖 TODO
              showToast('这里的逻辑自己看着写吧');
          },
          showModal(index) {
              // 显示遮罩层
              clearTimeout(this.timer); // 游戏中点击活动规则 暂停倒计时
              this.showModalIndex = index;
          },
          closeModal() {
              // 关闭遮罩层
              const lock_status = sessionStorage.getItem('CARD_ISLOCK');
              this.showModalIndex = null;

              if(lock_status == null) return;
              if(lock_status != 0) {
                  this.countdown(); // 关闭活动规则 继续开始计时器
              }
          },
          countdown() {
              // 倒计时
              let self = this;
              if(self.time == 0) {
                if(self.isLock == 1) {
                    self.cardFlip = '';
                    self.timeDesc = '倒计时间:';
                    self.time = TM2;
                    self.startPlaying();
                } else {
                    self.timeDesc = '记忆时间:';
                    self.time = TM1;
                    self.showTip = false;
                    self.showModal(5);
                    self.init();
                }
              } else {
                  self.time--;
                  self.timer = setTimeout(function() {
                      self.countdown();
                  }, 1000);
              }
          },
          getFormatDate(d) {
              // 格式化日期 Y-m-d
              d = new Date(d);
              var year = d.getFullYear(), month = d.getMonth() + 1, strDate = d.getDate();
              if (month >= 1 && month <= 9) {
                month = "0" + month;
              }
              if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
              }
              return year + '-' + month + '-' + strDate;
          },
          timeContrast(startTime, endTime) {
              // 时间对比
              var startdate = new Date(Date.parse(startTime.replace(/-/g,"/"))), enddate = new Date(Date.parse(endTime.replace(/-/g,"/")));
              return enddate > startdate ? 2 : 1;
          },
          replaceMobile(mobile, frontLen, endLen) {
              // 手机号中间4位星号代替
              var symbol = '', mobileLen = mobile.length, len = mobileLen - frontLen - endLen;
              for(var i = 0; i < len; i++) {  
                symbol += '*'; 
              }
              return mobile.substr(0, frontLen) + symbol + mobile.substr(mobileLen - endLen);
          }
      }
	}
</script>
