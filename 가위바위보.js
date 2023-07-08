// 상단 제목
const title = document.querySelector('div > span')
// 화면 이미지
const [meImg, comImg] = document.querySelectorAll('img');
// 하단 버튼들
const bottons= document.querySelectorAll('input[type=button]');
// 화면 점수
const meScoreSpan= document.querySelector('section > div:nth-child(3) > span');
const comScoreSpan= document.querySelector('section > div:nth-child(3) > span:last-child');

/* 이미지 */
const rpsGameList = {
    0 : "./images/scissors.png",
    1 : "./images/rock.png",
    2 : "./images/paper.png"
};

/* score */
const scoreList = {
    '가위' : 0,
    '바위' : 1,
    '보' : -1,
};

let meScore;
let comScore;

/* 컴퓨터 선택 */
function comPick(){
    // 0 ~ 2 랜덤 값 생성
    let key = Math.floor(Math.random() * 3);
    // 주소에 넣어 준다
    comImg.src = rpsGameList[key];
    // 컴퓨터 점수에 넣어 준다
    // key = 0 = 가위 / key = 1 = 바위 / key = 2 = 보
    switch (key) {
        case 0 :
            comScore = scoreList['가위'];
             break;
        case 1 :
            comScore = scoreList['바위'];
            break;
        case 2 :
            comScore = scoreList['보'];
            break;
    }
}

/* 내 선택 */
function mePick(){
    // 점수 검사
    // 가위 바위 보 버튼들 순회
    [...bottons].forEach( btn => {
        // 클릭한 버튼에 따라 이미지, 점수 부여
        btn.onclick = throttle(e => {
            if (setting === -1) return;
            switch (e.target.name) {
                case '가위' :
                    meImg.src = rpsGameList[0]
                    meScore = scoreList['가위']
                    break;
                case '바위' :
                    meImg.src = rpsGameList[1]
                    meScore = scoreList['바위']
                    break;
                case '보' :
                    meImg.src = rpsGameList[2]
                    meScore = scoreList['보']
                    break;
            }
            win_check();
            start();
            game_over_check();
        }, 200)
    });
}

// 승패 확인
function win_check(){
    let setMeScore = (+meScoreSpan.textContent) + 1;
    let setComScore = (+comScoreSpan.textContent) + 1;
    // 컴퓨터 픽 멈춤
    stop_comPick();
    // 가위 0 / 보 -1
    if(meScore > comScore && meScore === 0){
        title.textContent = '야호 이겼어요~!'
        meScoreSpan.textContent = setMeScore;
    }
    // 가위 0 / 바위 1
    else if(meScore < comScore && meScore === 0){
        title.textContent = '앗 졌어요ㅜㅜ'
        comScoreSpan.textContent = setComScore;
    }
    // 바위 1 / 가위 0
    else if(meScore > comScore && comScore === 0){
        title.textContent = '유후 이겼어요~!'
        meScoreSpan.textContent = setMeScore;
    }
    // 바위 1 / 보 -1
    else if(meScore > comScore && meScore === 1){
        title.textContent = '으잉 졌어요ㅜ'
        comScoreSpan.textContent = setComScore;
    }
    // 보 -1 / 바위 1
    else if(meScore < comScore && meScore === -1 && comScore === 1){
        title.textContent = '오예 이겼어요!'
        meScoreSpan.textContent = setMeScore;
    }
    // 보 -1 / 가위 0
    else if(meScore < comScore && comScore === 0){
        title.textContent = '아.. 졌어요'
        comScoreSpan.textContent = setComScore;
    }
    // 동점이다
    else {
        title.textContent = '비겼네요 다시!'
    }
}

// 5점까지 나면 완승
function game_over_check() {
    if((+meScoreSpan.textContent) === 5){
        title.textContent = '잘했어요! Me의 완승!';
        [...bottons].forEach( btn => btn.onclick = null);
    }
    else if((+comScoreSpan.textContent) === 5){
        title.textContent = '다시 도전 해보세요ㅠ Com의 완승!';
        [...bottons].forEach( btn => btn.onclick = null);
    }
}

// 컴퓨터 선택 멈춤
function stop_comPick(){
    clearInterval(setting);
    setting = -1;
}

// 점수 매기고 계속 시작
function start(){
    setTimeout(() => {
        if( setting > 0){
            return;
        }
        //음수 값이 아니면? 실행
        setting = setInterval(comPick, 110);
    }, 800);
}

// 리셋버튼 클릭시
function reset(){
    const resetBtn = document.querySelector('input[type=reset]')
    resetBtn.onclick = () => {
        if(!confirm('다시 시작 해볼래요?')){
           return;
        }
        // 모든 점수 초기화
        meScoreSpan.textContent = comScoreSpan.textContent = 0;
        // title 초기화
        title.textContent = '가위 바위 보! Com을 이기세요!';
        // 이미지 초기화
        meImg.src = rpsGameList[1];
        // 게임 다시 시작
        mePick();
    }
}

function throttle(callback, delay){
    let timerID; //타이머 ID
    return (...args) => {
        if(timerID) return;
        timerID = setTimeout(() => {
            callback(...args);
            timerID = null;
        }, delay);
    };
};


/*  지속적으로 실행 되어야하는 곳  */

// com 랜덤 이미지 순회
let setting = setInterval(comPick, 110);
// 게임 내 선택
mePick();
//리셋 초기화 함수
reset();



/* 1. 발생한문제 - 해결 */
// setting = setInterval(comPick, 110);이 지속적으로 발생한다
// 클릭할 때마다 빠르게 실행됨 -> 컴퓨터 선택 멈춤 함수 따로 빼네어
// setInterval 종료 후 변수 setting 에 음수값 넣음
// 차후 버튼을 클릭하고 게임을 진행해 음수값일 때만 setInterval 을
// 설정하도록 조건 넣음

/* 2. 버튼 중복 클릭 방지 */
// 버튼이 중복 클릭됨으로 인해 의도대로 진행 안될 가능성이 있다.
// 계속 이긴다거나...진다거나...
