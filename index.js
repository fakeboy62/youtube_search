require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./database/connection');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser'); 
const Youtube = require('youtube-node');
const youtube = new Youtube();

app.set('views', path.join(__dirname, './views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'stylesheets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(session({               // 세션 설정
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {            // 메인페이지 렌더링
    res.render('lobby', {
        sess: req.session.user_id
    });
});

app.post('/make', (req, res) => {               // 회원가입 미들웨어
    sequelize.models.user.create({
        user_id: req.body.user_id,
        user_pw: req.body.user_pw,
    })
    .then((result) => {
        console.log(result);
        res.redirect('/');
    })
    .catch((err) => {
        console.error('회원가입에 실패하였습니다.', err);
        res.json({ success: 1 });
    })
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/login', (req, res) => {              // 로그인 미들웨어
    sequelize.models.user.find({
        where:{
            user_id: req.body.user_id,
            user_pw: req.body.user_pw
        },
        attributes:['user_id','user_pw']
    })
    .then((result) => {
        if (result.dataValues.user_id || req.body.user_id) {            // 아이디가 맞는지 확인
            if (result.dataValues.user_id || req.body.user_pw) {
                req.session.user_id = req.body.user_id;
                res.redirect('/');
            }
        } else {
            res.redirect('/failed');
        }
    })
    .catch((err) => {
        console.error(err);
    })
});

app.get('/logins', (req, res) => {
    res.render('login');
})

app.get('/failed', (req, res) => {
    res.render('failed.ejs');
})

app.get('/logout', (req, res) => {          // 로그아웃 미들웨어
    req.session.destroy();
    res.redirect('/');
    console.log('로그아웃 되었습니다.');
})

app.get('/youtube_search', (req, res) => {              // 유튜브 검색 미들웨어
    const word = req.query.word;
    const limit = 10;
    
    youtube.setKey(process.env.api_key);

    youtube.addParam('order', 'rating');
    youtube.addParam('type', 'video');
    youtube.addParam('videoLicense', 'creativeCommon');

        youtube.search(word, limit, ((err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            const title = [];
            const url = [];
            const img = [];
            
            for (let i = 0; i < result.items.length; i++) {             
                let urls = "https://www.youtube.com/watch?v=" + result.items[i].id.videoId;
                let imgs = "https://i.ytimg.com/vi/" + result.items[i].id.videoId + "/mqdefault.jpg";
                title.push(result.items[i].snippet.title);
                img.push(imgs);
                url.push(urls);
            }
            res.render('index', {
                title : title,
                url : url,
                word : word,
                img : img
            })
        }))
});


app.listen(3000, (req, res) => {        // 서버 실행
    console.log('Server is ON');
})