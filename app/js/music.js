$(document).ready(function() {
    var viewWidth = $(window).width();
    var viewHeight = $(window).height();
    var deviceWidth = 640;
    var id = 0;
    var index = 0;

    var touch = {
        touchstart: 'touchstart',
        touchmove: 'touchmove',
        touchend: 'touchend'
    }
    var Dom = {
        main: $('#main'),
        listUl: $('#list-content-ul'),
        listTitle: $('#list-title'),
        listContent: $('#list-content'),
        musicLyric: $('#music-lyric'),
        listAudio: $('#list-audio'),
        lyricTitle: $('#lyric-title'),
        listAudioImg: $('#list-audio-logo'),
        listAudioText: $('#list-audio-text'),
        listAudioBtn: $('#list-audio-btn'),
        lyricName: $('#lyric-name'),
        audio: $('#audio').get(0),
        audioCurtime: $('#audio-curtime'),
        audioBar: $('#audio-bar'),
        curtimeNum: $('#curtime-num'),
        totaltimeNum: $('#totaltime-num'),
        playBtn: $('#play-btn'),
        prevBtn: $('#prev-btn'),
        nextBtn: $('#next-btn'),
        lyricContent: $('#lyric-content'),
        lyricContentList: $('#lyric-content-list'),
        lyricMessage: $('#lyric-message'),
        lyricMessageList: $('#lyric-message-list'),
        lyricMessageBtn: $('#lyric-message-btn'),
        lyricMessageText: $('#lyric-message-text'),
        lyricAudio: $('#lyric-audio'),
        lyricBtnList: $('#lyric-btn-list'),
        loading: $('#loading')
    };


    function loadingAni() {
        var num = 0;
        var arr = ['bg1.jpg', 'bg2.jpg', 'details_pause.png', 'details_play.png', 'details_next.png', 'details_prev.png', 'logo.jpg'];
        $.each(arr, function(index, img) {
            var objImg = new Image();
            objImg.onload = function() {
                num++;
                if (num === arr.length) {
                    Dom.loading.animate({
                        opacity: 0
                    }, 1000, function() {
                        $(this).remove();
                    });
                }
            };
            objImg.onerror = function() {
                Dom.loading.animate({
                    opacity: 0
                }, 1000, function() {
                    $(this).remove();
                });
            };
            objImg.src = './img/' + img;

        });
    }

    var util = { // 工具函数
        device: function() {
            if (viewWidth > deviceWidth) { // pc移动兼容
                Dom.main.css('width', '640px');
            }
            var isMobile = /mobile/i.test(navigator.userAgent);

            if (!isMobile) {

                touch.touchstart = 'mousedown';
                touch.touchmove = 'mousemove';
                touch.touchend = 'mouseup';
            }

            $(window).resize(function() {
                viewWidth = $(window).width();
                viewHeight = $(window).height();
                musicLyric.slideDown();
            });
        },
        getTouch: function(ev) {
            var touch = ev.originalEvent.changedTouches ? ev.originalEvent.changedTouches[0] : ev;
            return touch;
        },
        formatTime: function(time) { // 格式时间
            time = parseInt(time);
            var minutes = Math.floor(time % 3600 / 60);
            var seconds = Math.floor(time % 60);
            return util.addZero(minutes) + ':' + util.addZero(seconds);
        },
        addZero: function(num) { // 补零
            if (num < 10) {
                return '0' + num;
            }
            return num;
        },
        formatLyric: function(lyric) {
            var reg = /\[[^[]+/g;
            var arr = lyric.match(reg);


            $.each(arr, function(index, value) {
                arr[index] = [util.convertSeconds(value.substring(0, 10)), value.substring(10).trim()];
            });



            var filerArr = $.grep(arr, function(value) {
                return value[1].length > 0;
            });


            return filerArr;

        },
        convertSeconds: function(time) { // 歌词时间字符串转成秒
            time = time.substring(1, time.length - 1);

            var arr = time.split(':');

            return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
        }
    };





    var app = (function() { // 播放器app

        function init() { // 整个播放器的初始化
            loadingAni();
            util.device();
            musicList.init();
            musicLyric.init();
            musicAudio.init();
        }
        return { // 对外提供接口
            init: init
        };
    })();

    var musicList = (function() { // 音乐列表模块

        var contact = 'https://github.com/deepred5';
        var api = './api/musicList.php';
        var downY = 0;
        var prevY = 0;
        var downT = 0;
        var parentH = Dom.listContent.height();
        var childH = Dom.listUl.height();
        var onoff1 = true;
        var onoff2 = true;
        var isMove = true;
        var timer = null;
        var speed = 0;

        function init() { // 单个模块初始化
            data();
            bind();
            moveScroll();
        }


        function data() { // ajax后台请求音乐列表数据
            $.ajax({
                    url: api,
                    type: 'GET',
                    dataType: 'json'
                })
                .done(function(data) {

                    $.each(data, function(index, obj) {
                        var $li = '<li data-id="' + obj.id + '"><h3 class="title">' + obj.musicName + '</h3><p class="singer">' + obj.name + '</p></li>';
                        Dom.listUl.append($li);
                    });
                    childH = Dom.listUl.height();
                })
                .fail(function(err) {
                    console.log('error');
                });
        }

        function bind() { // 绑定事件

            Dom.listTitle.on(touch.touchstart, function() {
                // window.location = contact;
            });

            Dom.listUl.on(touch.touchend, 'li', function() {

                if (isMove) {
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                    id = $(this).attr('data-id');
                    $(Dom.audio).off('ended');
                    musicAudio.loadMusic(id);
                    index = $(this).index();
                }
            });

            Dom.listAudio.on(touch.touchstart, function() {
                if (id) {
                    musicLyric.slideUp();
                }
            });


        }



        function moveScroll() { // 模拟滑屏



            $(document).on(touch.touchmove, function(ev) { // 阻止某些移动端手机的默认行为
                ev.preventDefault();
            });



            Dom.listUl.on(touch.touchstart, function(ev) {

                if (childH < parentH) { // 歌曲列表较少时不需滑屏
                    return;
                }

                onoff1 = true;
                onoff2 = true;
                isMove = true;

                // ev.originalEvent jq事件对象转成原生事件对象
                // 移动端事件对象是changedTouches[0]
                ev = util.getTouch(ev);

                var This = this;
                downY = ev.pageY;
                prevY = ev.pageY;
                downT = $(this).position().top;

                $(document).on(touch.touchmove + '.move', function(ev) {
                    ev = util.getTouch(ev);
                    var top = $(This).position().top;
                    isMove = false;



                    speed = ev.pageY - prevY; // 最后两次move的差值
                    prevY = ev.pageY;



                    if (top >= 0) { // 头部滑动
                        if (onoff1) {
                            onoff1 = false;
                            downY = ev.pageY
                        }
                        $(This).css('transform', 'translate3d(0, ' + (ev.pageY - downY) / 3 + 'px, 0)');


                    } else if (top <= parentH - childH) { // 尾部滑动
                        if (onoff2) {
                            onoff2 = false;
                            downY = ev.pageY
                        }
                        $(This).css('transform', 'translate3d(0, ' + ((ev.pageY - downY) / 3 + (parentH - childH)) + 'px, 0)');
                        

                    } else {
                        $(This).css('transform', 'translate3d(0, ' + (ev.pageY - downY + downT) + 'px, 0)');
                    }


                });



                $(document).on(touch.touchend + '.move', function(ev) {

                    // 防止多次绑定事件 技巧：事件命名空间
                    $(this).off('.move');



                    if (!isMove) {
                        clearInterval(timer);

                        timer = setInterval(function() { // 缓冲
                            var top = $(This).position().top;
                            if (Math.abs(speed) <= 1 || top > 50 || top < (parentH - childH - 50)) {
                                clearInterval(timer);
                                if (top >= 0) { // 头部拉回
                                    $(This).css('transition', '.2s');
                                    $(This).css('transform', 'translate3d(0, 0, 0)');
                                } else if (top <= parentH - childH) { // 尾部拉回
                                    $(This).css('transition', '.2s');
                                    $(This).css('transform', 'translate3d(0, ' + (parentH - childH) + 'px, 0)');
                                }
                            } else {

                                speed *= 0.9;
                                $(This).css('transform', 'translate3d(0, ' + (speed + top) + 'px, 0)');
                            }
                        }, 13);
                    }

                });

                return false;
            });

            Dom.listUl.on('transitonend webkitTransitionEnd', function() {
                $(this).css('transition', '');
            });
        }

        function show(name, musicName, img) {
            Dom.listAudioImg.attr('src', 'img/' + img);
            Dom.listAudioText.find('h3').html(name);
            Dom.listAudioText.find('p').html(musicName);
            Dom.listAudioBtn.show();
        }

        return {
            init: init,
            show: show
        };
    })();

    var musicLyric = (function() { // 歌词模块

        var $lis = null;
        var arr = [];
        var offsetTime = 0.9;
        var lyricHeight = 0;
        var downX = 0;
        var range = 20;
        var timer = null;

        function init() {
            Dom.musicLyric.css('transform', 'translate3d(0, ' + viewHeight + 'px, 0)');
            Dom.lyricMessage.css('transform', 'translate3d(' + (viewWidth) + 'px, 0, 0)');
            bind();
        }

        function slideUp() { // 向上展开
            Dom.musicLyric.css('transition', '.5s');
            Dom.musicLyric.css('transform', 'translate3d(0, 0, 0)');
        }

        function slideDown() { // 向下收缩

            Dom.musicLyric.css('transform', 'translate3d(0, ' + viewHeight + 'px, 0)');
            Dom.musicLyric.one('transitonend webkitTransitionEnd', function() {
                Dom.lyricContent.add(Dom.lyricAudio).css('transform', 'translate3d(0, 0, 0)');
                Dom.lyricMessage.css('transform', 'translate3d(' + (viewWidth) + 'px, 0, 0)');
                Dom.lyricBtnList.find('li').eq(0).addClass('active').siblings().removeClass('active');
            });
        }

        function bind() {
            Dom.lyricTitle.on(touch.touchstart, function() {
                slideDown();
            });

            Dom.musicLyric.on(touch.touchstart, function(ev) {
                ev = util.getTouch(ev);
                downX = ev.pageX;

                $(document).on(touch.touchend + '.move', function(ev) {
                    $(this).off('.move');
                    ev = util.getTouch(ev);
                    if (ev.pageX - downX < -range) { // 左滑屏
                        Dom.lyricContent.add(Dom.lyricAudio).css('transform', 'translate3d(' + (-viewWidth) + 'px, 0, 0)');
                        Dom.lyricMessage.css('transform', 'translate3d(0, 0, 0)');
                        Dom.lyricBtnList.find('li').eq(1).addClass('active').siblings().removeClass('active');
                        loadMessage();
                        clearInterval(timer);
                        timer = setInterval(scrollMessage, 2000);
                    } else if (ev.pageX - downX > range) { // 右滑屏
                        Dom.lyricContent.add(Dom.lyricAudio).css('transform', 'translate3d(0, 0, 0)');
                        Dom.lyricMessage.css('transform', 'translate3d(' + (viewWidth) + 'px, 0, 0)');
                        Dom.lyricBtnList.find('li').eq(0).addClass('active').siblings().removeClass('active');
                        clearInterval(timer);
                    }
                });
            });

            Dom.lyricMessageBtn.on(touch.touchstart, function() {
                addMessage();
            });

        }

        function show(name, musicName, lyric) {
            Dom.lyricName.html(musicName + '<span>' + name + '</span>');
            arr = util.formatLyric(lyric);
            /*arr.forEach(function(val) {
                console.log(val)
            });*/

            Dom.lyricContentList.empty();

            $.each(arr, function(index, val) {
                var $li = $('<li>' + val[1] + '</li>');
                Dom.lyricContentList.append($li);
            });

            $lis = Dom.lyricContentList.find('li');
            lyricHeight = $lis.eq(0).outerHeight(true);

            $lis.first().addClass('active');
        }

        function scrollLyric(currentTime) { // 滚动歌词
            currentTime += offsetTime;
            for (var i = 0; i < arr.length; i++) {
                if (i != arr.length - 1 && currentTime > arr[i][0] && currentTime < arr[i + 1][0]) {
                    $lis.eq(i).addClass('active').siblings().removeClass('active');
                    if (i > 3) {
                        Dom.lyricContentList.css('transform', 'translate3d(0, ' + (-lyricHeight * (i - 3)) + 'px, 0)');
                    } else {
                        Dom.lyricContentList.css('transform', 'translate3d(0, 0, 0)');
                    }
                    break;

                } else if (i === arr.length - 1 && currentTime > arr[i][0]) {
                    $lis.eq(i).addClass('active').siblings().removeClass('active');
                    Dom.lyricContentList.css('transform', 'translate3d(0, ' + (-lyricHeight * (i - 3)) + 'px, 0)');

                }
            }
        }

        function loadMessage() { // 加载留言
            Dom.lyricMessageList.empty();
            $.ajax({
                    url: './api/loadMessage.php',
                    type: 'GET',
                    dataType: 'json',
                    data: { mid: id }
                })
                .done(function(data) {
                    // console.log(data);

                    $.each(data, function(index, obj) {
                        var $li = $('<li>' + obj.text + '</li>');
                        Dom.lyricMessageList.prepend($li);
                    });
                })
                .fail(function(err) {
                    console.log('加载留言失败');
                })
        }

        function addMessage() { // 添加数据
            var message = Dom.lyricMessageText.val().trim();
            Dom.lyricMessageText.val('');
            $.ajax({
                    url: './api/addMessage.php',
                    type: 'POST',
                    data: { mid: id, text: message },
                    dataType: 'json'
                })
                .done(function(data) {
                    if (data.code) {
                        var $li = $('<li>' + data.message + '</li>');
                        Dom.lyricMessageList.prepend($li);
                    }
                })
                .fail(function(err) {
                    console.log('添加留言失败');
                });
        }

        function scrollMessage() { // 滚动留言
            var $last = Dom.lyricMessageList.find('li').last();
            Dom.lyricMessageList.prepend($last);
            $last.css('opacity', 0);
            setTimeout(function() {
                $last.css('opacity', 1);
            }, 20);
        }
        return {
            init: init,
            slideUp: slideUp,
            slideDown: slideDown,
            show: show,
            scrollLyric: scrollLyric
        };

    })();

    var musicAudio = (function() { // 音乐播放暂停模块

        var onoff = true;
        var timer = null;
        var scale = 0;
        var disX = 0;
        var parentW = Dom.audioBar.parent().width();

        function init() {
            bind();
        }

        function bind() {
            Dom.listAudioBtn.add(Dom.playBtn).on(touch.touchstart, function() {
                if (onoff) {
                    pause();
                } else {
                    play();
                }
                return false;
            });

            Dom.audioBar.on(touch.touchstart, function(ev) {
                ev = util.getTouch(ev);

                clearInterval(timer);

                var This = this;

                disX = ev.pageX - $(this).position().left;


                $(document).on(touch.touchmove + '.move', function(ev) {
                    ev = util.getTouch(ev);
                    var l = ev.pageX - disX


                    if (l <= 0) {
                        l = 0;
                    } else if (l >= parentW) {
                        l = parentW;
                    }

                    $(This).css('left', l + 'px');

                    scale = l / parentW;

                    Dom.audioCurtime.css('width', scale * 100 + '%');
                });

                $(document).on(touch.touchend + '.move', function(ev) {
                    $(this).off('.move');
                    Dom.audio.currentTime = scale * Dom.audio.duration;


                    playing();
                    clearInterval(timer);
                    timer = setInterval(playing, 1000);
                });

                return false;
            });

            Dom.prevBtn.on(touch.touchstart, function() {
                $(Dom.audio).off('ended');
                prev();
            });
            Dom.nextBtn.on(touch.touchstart, function() {
                $(Dom.audio).off('ended');
                next();
            });
        }

        function loadMusic(id) { // 加载音乐
            $.ajax({
                    url: './api/musicAudio.php',
                    type: 'GET',
                    dataType: 'json',
                    data: { id: id },
                    async: false // 部分手机异步操作无法自动播放音乐
                })
                .done(function(data) {
                    show(data);
                })
                .fail(function(err) {
                    console.log('加载音乐失败');
                })
        }

        function show(data) {
            var audio = data.audio;
            var id = data.id;
            var img = data.img;
            var lyric = data.lyric;
            var musicName = data.musicName;
            var name = data.name;

            musicList.show(name, musicName, img);
            musicLyric.show(name, musicName, lyric);

            Dom.lyricContentList.css('transform', 'translate3d(0, 0, 0)');

            Dom.audio.src = 'music/' + audio;

            play();

            $(Dom.audio).one('canplaythrough', function() {

                Dom.totaltimeNum.html(util.formatTime(Dom.audio.duration));
            });

            $(Dom.audio).one('ended', function() {
                next();
            });

        }

        function play() { // 播放音乐
            Dom.listAudioImg.addClass('move');
            Dom.listAudioBtn.css('backgroundImage', 'url(img/list_audioPause.png)');
            Dom.playBtn.css('backgroundImage', 'url(img/details_pause.png)');
            Dom.audio.play();
            onoff = true;
            playing();
            clearInterval(timer);
            timer = setInterval(playing, 1000);

        }

        function pause() { // 暂停音乐
            Dom.listAudioImg.removeClass('move');
            Dom.listAudioBtn.css('backgroundImage', 'url(img/list_audioPlay.png)');
            Dom.playBtn.css('backgroundImage', 'url(img/details_play.png)');
            Dom.audio.pause();
            onoff = false;
            clearInterval(timer);
        }

        function playing() { // 播放进行中
            Dom.curtimeNum.html(util.formatTime(Dom.audio.currentTime));
            scale = Dom.audio.currentTime / Dom.audio.duration;
            Dom.audioCurtime.css('width', scale * 100 + '%');
            Dom.audioBar.css('left', scale * 100 + '%');
            musicLyric.scrollLyric(Dom.audio.currentTime);

        }



        function next() { // 下一首
            var $li = Dom.listUl.find('li')
            index = index === $li.length - 1 ? 0 : index + 1;
            $li.eq(index).addClass('active').siblings().removeClass('active');
            id = $li.eq(index).attr('data-id');
            loadMusic(id);


        }

        function prev() { // 上一首
            var $li = Dom.listUl.find('li')
            index = index === 0 ? $li.length - 1 : index - 1;
            $li.eq(index).addClass('active').siblings().removeClass('active');
            id = $li.eq(index).attr('data-id');
            loadMusic(id);

        }


        return {
            init: init,
            loadMusic: loadMusic,
            next: next,
            prev: prev
        };

    })();

    app.init();
});
