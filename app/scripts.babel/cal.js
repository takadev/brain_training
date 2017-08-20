import $ from 'jquery';

const q_num = 20;
let level = "";
let q_a = new Array();
let signs = ['+', '-', '×', '÷'];
let param = {'min':0, 'max':0, 'args':0};
let current_q = 0;
let inc_num = 0;
let m_sec = 0;
let sec = 0;
let min = 0;
let timer;

$(function(){ 
	start_timer();
	init();
});

function start_timer() {
    $('.count').html('00:00:00');
    timer = setInterval(function(){
    	countup();
    }, 10);
}

function stop() {
	clearInterval(timer);
}

function countup()
{
	m_sec += 1;
	if (m_sec > 100) {
		m_sec = 0;
		sec += 1;
	}
	if (sec > 59) {
		sec = 0;
		min += 1;
	}

	var m_sec_num = ('0' + m_sec).slice(-2);
	var sec_num = ('0' + sec).slice(-2);
	var min_num = ('0' + min).slice(-2);

	$('.count').html(min_num + ':' +  sec_num + ':' + m_sec_num);
}

function init() {
	   
	level = get_level();
	set_param();

	for (var i = 1; i <= 4; i++)
	{
		$('#ans_' + i).click(function(){
			var e = (window.event)? window.event : arguments.callee.caller.arguments[0];
			var self = e.target || e.srcElement;
			check_ans(Number(self.text));
		});
	}

	for (var i = 0; i < q_num; i++)
	{
		var hash_num = {};
		for (var j = 1; j <= param['args']; j++)
		{
			hash_num['arg' + j] = Math.floor(Math.random() * (param['max'] + 1 - param['min'])) + param['min'] ;
		}

		var hash_sign = {};
		for (var j = 1; j < param['args']; j++)
		{
			var index = Math.floor(Math.random() * (signs.length));
			hash_sign['sign' + j] = signs[index];
		}	

		var expr = "";
		for (var j = 1; j <= param['args']; j++)
		{
			expr += hash_num['arg' + j];
			if (j != param['args'])
			{
				expr += conv_sign(hash_sign['sign' + j]);
			}
		}

		var ans = 0;
		eval("ans = Math.floor(" + expr + ")");

		var hash = {'num':hash_num, 'sign':hash_sign, 'ans':ans};
		q_a.push(hash);
	}
	next();
}

function set_param()
{
	switch(level)
	{
		case '1':
			param['min'] = 3;
			param['max'] = 30;
			param['args'] = 2;
			param['f_min'] = 1;
			param['f_max'] = 20;
			break;
		case '2':
			param['min'] = 5;
			param['max'] = 50;
			param['args'] = 3;
			param['f_min'] = 5;
			param['f_max'] = 30;
			break;
		case '3':
			param['min'] = 10;
			param['max'] = 99;
			param['args'] = 4;
			param['f_min'] = 10;
			param['f_max'] = 99;
			break;
	}
}

function conv_sign(sign) {
	var conv = sign;
	switch(sign)
	{
		case '×':
			conv = "*";
			break;
		case '÷':
			conv = "/";
			break;
	}
	return conv;
}

function get_level()
{
	var scripts = document.getElementsByTagName('script');
    var src = scripts[scripts.length - 1].src;
    var query = src.substring(src.indexOf('?') + 1);
    var parameters = query.split('&');
    var element = parameters[0].split('=');
    return decodeURIComponent(element[1]);
}

function next()
{
	$('.correct').hide();
	$('.incorrect').hide();
	disp_q();
}

function finish()
{
	stop();
	$('#question').hide();
	$('#answer').hide();
	var result = $('#result');
	result.show();
	result.html('<p>正解:' + (q_num - inc_num) +'</p><p>不正解:' + inc_num +'</p>');
}

function disp_q() {
	var len = Object.keys(q_a[current_q].num).length;
	for (var i = 1; i <= len; i++)
	{
		var id = '#arg_lv' + level + '_' + i;
		$(id).text(q_a[current_q].num['arg' + i]);
	}

	len = Object.keys(q_a[current_q].sign).length;
	for (var i = 1; i <= len; i++)
	{
		var id = '#sign_lv' + level + '_' + i;
		$(id).text(q_a[current_q].sign['sign' + i]);
	}

	var ans = q_a[current_q].ans;
	var ans_index = Math.floor(Math.random() * 4);
	var rand_list = [];
	for (var i = 0; i < 4; i++)
	{
		var id = '#ans_' + (i + 1);
		var element = $(id);
		if (ans_index == i)
		{
			element.text(ans);
		}
		else
		{
			var rand = Math.floor(Math.random() * param['f_max']) - param['f_min'];
			if (rand <= 0)
			{
				rand++;
			}
			if ($.inArray(rand, rand_list) > -1)
			{
				rand++;
			}
			var inc_ans = ans + rand;
			if (inc_ans == ans)
			{
				inc_ans++;
			}
			element.text(inc_ans);
			rand_list.push(rand);
		}
	}
}

function check_ans(select) {

	if (select == q_a[current_q].ans)
	{
		$('.correct').show();
	}
	else
	{
		$('.incorrect').show();
		inc_num++;
	}
	setTimeout(function(){
		current_q++;
		if (current_q >= q_num)
		{
			finish();
		}
		else
		{
			next();
		}
	}, 1000);
}

