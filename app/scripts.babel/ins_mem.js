import $ from 'jquery';

const q_num = 20;
let q_a = new Array();
let current_q = 0;
let inc_num = 0;
let len_num = 4;
let answer = '';

$(function(){
	init();

	var from = $('.form-control');
	from.focus();
	from.keypress(function(e) {
		if (e.which == 13) {
			var text = $.trim(from.val());
			if (!text) {
				return false;
			}
			check_ans(text);
			setTimeout(function(){
				from.val('');
			}, 800);
		}
	});
});


function init() {
	$('#number').hide();
	setTimeout(function(){
		next();
	}, 1000);
}

function next()
{
	$('#number').hide();
	$('.correct').hide();
	$('.incorrect-ins').hide();
	answer = ''
	for (var i = 0; i < len_num; i++)
	{
		answer += String(Math.floor(Math.random() * (9 + 1 )));
	}
	setTimeout(function(){
		disp_q();
	}, 1500);
}

function finish()
{
	$('#question').hide();
	$('#answer').hide();
	var result = $('#result');
	result.show();
	result.html('<p>正解:' + (q_num - inc_num) +'</p><p>不正解:' + inc_num +'</p>');
}

function disp_q() {
	$('#number').text(answer)
	$('#number').show();
	setTimeout(function(){
		$('#number').hide();
	}, 200);
}

function check_ans(select) {

	if (select == answer)
	{
		$('.correct').show();
		len_num++;
	}
	else
	{
		$('.incorrect-ins').show();
		inc_num++;
		len_num--;
	}

	$('#number').show();
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

