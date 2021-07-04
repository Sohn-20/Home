require('dotenv').config();
const express = require('express');
const http = require('http'); // node에서 기본적으로 제공하는 모듈(노 설치)
const path = require('path'); // 이하 동문 -> node에서 깔면 에러
const fs = require('fs');

// 앱 초기화
const app = express();  // express 앱 호출을 app 상수에 대입
const port = process.env.SERVER_PORT || 3000; // .env에 존재하면 그 값이 들어가지만 만약 .env에 포트 값이 없으면 || 뒤에 값을 줌
const webServer = http.createServer(app); // http 서버가 생성

// 정적 폴더
app.use(express.static(path.join(__dirname, "../dist"))); // 빌드한 결과가 dist에 있으므로 dirname 내파일이 있는 경로

// Vue SSR
const { createBundleRenderer } = require('vue-server-renderer');
const template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf-8');
const serverBundle = require(path.join(__dirname, '../dist/vue-ssr-server-bundle.json'));
const clientManifest = require(path.join(__dirname, '../dist/vue-ssr-client-manifest.json'));

const renderer = createBundleRenderer(serverBundle, {
	runInNewContext : false,
	template,
	clientManifest,
});

app.get('*', (req, res) => {
	const ctx = {
		url : req.url,
		title : 'Vue SSR App',
		metas : `<!-- inject more metas -->`,
	};

	const stream = renderer.renderToStream(ctx);

	stream.on('end', ()=> {
		console.log('스트림 렌더 종료');
	}).pipe(res);
});

// 서버 응답
webServer.listen(port, () => {
  console.log(`http://localhost:${port}`)
});