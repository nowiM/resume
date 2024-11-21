const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const template = require('./lib/template.js');

const app = http.createServer((request, response) => {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        fs.readdir('./data', (error, filelist) => {
            if (error) {
                response.writeHead(500);
                response.end('Internal Server Error');
                return;
            }

            // Sort the directories to get the last one
            filelist.sort();
            const lastDir = filelist[filelist.length - 1];

            // If queryData.id is undefined, set it to the last directory
            if (!queryData.id) {
                queryData.id = lastDir;
            }

            const list = template.List(filelist);
            const dirPath = path.join('./data', queryData.id);

            fs.readdir(dirPath, (error, files) => {
                if (error) {
                    console.error('Error reading directory:', error);
                    response.writeHead(500);
                    response.end('Internal Server Error');
                    return;
                }
                
                // template.table이 HTML과 함께 CSS 파일 이름을 반환하도록 수정
                const tableResult = template.table(dirPath, files, queryData.id);
                const html = template.HTML(list, tableResult.html, tableResult.cssFile);

                response.writeHead(200);
                response.end(html);
            });
        });
    } 
    // CSS file handler
    // 동적 CSS 파일 처리
    else if (pathname.startsWith('/css/')) {
        const cssPath = path.join(__dirname, pathname);
        fs.readFile(cssPath, 'utf8', (error, data) => {
            if (error) {
                response.writeHead(404);
                response.end('Not found');
                return;
            }
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.end(data);
        });
    }
    // Image file handler
    else if (pathname.startsWith('/img/')) {
        const imgPath = path.join(__dirname, pathname);
        fs.readFile(imgPath, (error, data) => {
            if (error) {
                response.writeHead(404);
                response.end('Not found');
                return;
            }
            let extname = path.extname(imgPath).toLowerCase();
            let contentType = 'image/jpeg';
            if (extname === '.png') contentType = 'image/png';
            if (extname === '.jpg' || extname === '.jpeg') contentType = 'image/jpeg';
            if (extname === '.webp') contentType = 'image/webp';

            response.writeHead(200, { 'Content-Type': contentType });
            response.end(data);
        });
    }
    // Font file handler
    else if (pathname.startsWith('/font/')) {
        const fontPath = `.${pathname}`;
        fs.readFile(fontPath, (error, data) => {
            if (error) {
                response.writeHead(404);
                response.end('Not found');
                return;
            }
            let contentType;
            if (fontPath.endsWith('.woff2')) {
                contentType = 'font/woff2';
            } else if (fontPath.endsWith('.woff')) {
                contentType = 'font/woff';
            } else if (fontPath.endsWith('.ttf')) {
                contentType = 'font/ttf';
            } else if (fontPath.endsWith('.eot')) {
                contentType = 'application/vnd.ms-fontobject';
            } else {
                contentType = 'application/octet-stream';
            }
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(data);
        });
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
