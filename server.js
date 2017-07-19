//모듈 로드!!
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');


const port = process.env.PORT || 3000;  //환경 변수 포트번호 존재 시 환경 변수 값으로 포트 설정
                                        //or 없을 시 디폴트 값이 3000으로  set
var app = express();

hbs.registerPartials(__dirname + '/views/partials'); ///views/partials 디렉토리 등록
app.set('view engine', 'hbs');  //템플릿 엔진 종류를 서버가 읽을 수 있도록 정의

//로그 파일 정보를 앱 오브젝트 인스턴스에 바인딩. 앱 요청 시마다 실행
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);

    //해당 파일에 내용을 이어 씀
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next(); //현재의 미들웨어 함수가 요청-응답 주기를 종료하지 않는 경우 시 호출하여 그 다음 미들웨어 함수에 제어를 전달.
            //그렇지 않으면 해당 요청은 정지된 채로 방치됨.
});


// punlic 디렉토리를 정적 파일로 사용
app.use(express.static(__dirname + '/public'));

//현재 년도를 반환하는 헬퍼 함수 등록
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});


//헬퍼 등록, text를 인자로 받아 전체 대문자로 반환
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

//사용자  request에 의해 응답하는 부분. 렌더링 시 main.hbs를 호출한 뒤 인자로 pageTitle 및 Message를 넘김.
app.get('/', (req, res) => {
    res.render('main.hbs', {
        pageTitle: 'Node.js Page',
        Message: '127.0.0.1:3000/nodejs'
    })
});

app.get('/nodejs', (req, res) => {
    res.render('main.hbs', {
        pageTitle: 'Node.js Page',
        Message: '127.0.0.1:3000/nodejs'
    })
});

app.get('/boot', (req, res) => {
    res.render('main.hbs', {
        pageTitle: 'SpringBoot Page',
        Message: '127.0.0.1:3000/boot'
    });
});

app.get('/javascript', (req, res) => {
    res.render('main.hbs', {
        pageTitle : 'JavaScript Page',
        Message: '127.0.0.1:3000/javascript'
    });
});

//bad - send back json with errorMessage
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.listen(port, () => {
    console.log(`Sever is up on port ${port}`);

});
