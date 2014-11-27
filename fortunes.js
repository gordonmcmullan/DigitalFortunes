var FF = {};
FF.answewrcount = 0;
FF.wrong_count = 0;
FF.headtohead = 0;
FF.score = 0;
FF.team_a_score = parseInt($().url().param('a')) || 0;
FF.team_b_score = parseInt($().url().param('b')) || 0;
FF.question_number = parseInt($().url().attr('file'));
FF.tableRows = $('table.answers tr').length - 1;
FF.playing_team = '';
FF.roundFinished = false;

$('#team_A_score').text(FF.team_a_score);
$('#team_B_score').text(FF.team_b_score);



/*=================================================
Handle keypresses
Attach to the keUp event to get the correct keyCode
values in Chrome
---------------------------------------------------
a     : put Team A in play,
b     : put Team B in play,
n     : move to next question,
[1-9] : display answer 1-9,
space : incorrect answer.
=================================================*/
$(document).keyup(function () {

    var n = event.keyCode - 48,
        s,
        a,
        playTeam = function (team) {
            
            var start_team = '#team_' + team + '_playing',
                stop_team = '#team_' + (team === 'a' ? 'b' : 'a') + '_playing';
            FF.playing_team = team;
            $(stop_team).addClass('hidden');
            $(start_team).removeClass('hidden');
        },
    
        awardWinners = function () {
            if (FF.playing_team === 'a') {
                FF.team_a_score += FF.score;
                $('#team_A_score').text(FF.team_a_score);
            } else {
                FF.team_b_score += FF.score;
                $('#team_B_score').text(FF.team_b_score);
            }
            FF.roundFinished = true;
            //$('#totalScore').addClass('hidden');
        };
    
    if (n >= 1 && n <= FF.tableRows) {
        if (FF.playing_team || FF.headtohead < 2) {
            FF.headtohead += 1;
            a = '#a' + n;
            s = '#s' + n;
            if ($(a).hasClass('hidden')) {
                FF.answewrcount += 1;
                $('#ding').trigger('play');
                $(a).removeClass('hidden');
                $(s).removeClass('hidden');
                FF.score += FF.roundFinished ? 0 : parseInt($(s).text());
                $('#totalScore').text(FF.score);
                if (!FF.roundFinished && FF.answewrcount === FF.tableRows) {
                    awardWinners();
                }
                if (!FF.roundFinished && FF.wrong_count === 3) {
                    awardWinners();
                }
            }
        }
    }
    
    if (FF.playing_team && FF.wrong_count < 4 && event.keyCode === 32) {
        FF.wrong_count += 1;
        $('#small_x' + FF.wrong_count).removeClass('hidden');
        $('#uhuh').trigger('play');
        
        if (FF.wrong_count === 3) {
            playTeam(FF.playing_team === 'a' ? 'b' : 'a');
        }
        
        if (FF.wrong_count === 4) {
            playTeam(FF.playing_team === 'a' ? 'b' : 'a');
            $('table#big_x').removeClass('hidden');
            // Gameover so addscore to winning team
            awardWinners();
        }
    }
    
    if (!FF.playing_team && event.keyCode === 65) {
        playTeam('a');
    }
    
    if (!FF.playing_team && event.keyCode === 66) {
        playTeam('b');
        
        // Swap wrong answer tables to other side
        $('table#small_x').removeClass('left');
        $('table#small_x').addClass('right');
        $('table#big_x').removeClass('right');
        $('table#big_x').addClass('left');
        
    }
    
    if (FF.roundFinished && event.keyCode === 13) {
        
        window.console.log("enter Pressed");
        var next_question_number = FF.question_number + 1;
        window.location = next_question_number + ".html?" + "a=" + FF.team_a_score + "&b=" + FF.team_b_score;
    }
});