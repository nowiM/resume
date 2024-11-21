const fs = require('fs');
const path = require('path');

module.exports = {
    HTML: (list, table, cssFile) => {
        return `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="icon" type="image/x-icon" href="/img/steve_icon.jpg">
                    <link rel="stylesheet" type="text/css" href="/css/${cssFile}">
                    <title>resume</title>
                </head>
                <body>
                    ${list}
                    
                    <div class="dividingLine"></div>

                    ${table}

                    <div class="dividingLine"></div>

                    <div class="disclaimer">
                        <div class="container">
                            <p>
                            The head fronts of the base skin "Steve" used on this website and the head fronts of the artist's custom skin are © Mojang Studios, Microsoft Corporation and its artists. This is not an official Minecraft product, and is not approved or related to Mojang or Microsoft.
                            <br>
                            If you want to earn credibility as a producer of skins appearing on this site or want to delete your work, please contact <a href="mailto:your-email@example.com ">ghkdtprhf5@naver.com</a>.
                            </p>
                        </div>
                    </div>
                </body>
            </html>
        `;
    },
    List: (fileList) => {
        let list = '<ul class="seasons">';
        fileList.forEach(file => {
            const fullPath = path.join('./data', file);
            if (fs.lstatSync(fullPath).isDirectory()) {
                list += `<li><a href="/?id=${encodeURIComponent(file)}" class="season">${file}</a></li>`;
            }
        });
        list += '</ul>';
        return `
            <div class="bottom-nav">
                <div class="container">
                    ${list}
                </div>
            </div>
        `;
    },
    table: (dirPath, files, dataset) => {
        let descriptions = '';
        let cssFile = 'default.css'; // 기본 CSS 파일 설정

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (path.extname(file) === '.json') {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                try {
                    const jsonContent = JSON.parse(fileContent);
                    if (dataset.includes('로나월드 시즌1')) {
                        descriptions += generateTableForSeason1(jsonContent);
                        cssFile = 'ronaWorldSeason1.css';
                    } else if (dataset.includes('로나월드 시즌2')) {
                        descriptions += generateTableForSeason2(jsonContent);
                        cssFile = 'alligatorPlayground.css';
                    } else if (dataset.includes('마카오톡')) {
                        descriptions += generateTableForMacaoTalk(jsonContent);
                        cssFile = 'ronaWorldSeason1.css';
                    } else if (dataset.includes('악어의놀이터2')) {
                        descriptions += generateTableForAlligator(jsonContent);
                        cssFile = 'alligatorPlayground.css';
                    } else {
                        descriptions += 'Unknown dataset';
                    }
                } catch (error) {
                    console.error(`Error parsing JSON in file ${filePath}:`, error);
                    descriptions += 'Error parsing JSON';
                }
            } else {
                descriptions += `<p>Non-JSON file found: ${file}</p>`;
            }
        });

        return {
            html: `
            <div class="tables">
                <div class="container">
                    <div class="crew">
                        ${descriptions}
                    </div>
                </div>
            </div>
            `,
            cssFile: cssFile
        };
    },
};

const generateTableForSeason1 = (jsonContent) => {
    const guildInformation = jsonContent.shift();

    let tableContent = `
        <table>
            <tr>
                <th scope="col" colspan="2">${guildInformation.guildName}</th>
            </tr>
    `;

    jsonContent.forEach(member => {
        tableContent += `
            <tr>
                <td>
                    <img
                        src="${member.image !== 'img' ? member.image : '/img/default.png'}"
                        alt="${member.name}"
                        class="profilePhoto"
                    />
                </td>
                <td>${member.name}</td>
            </tr>
        `;
    });

    tableContent += `
        </table>
    `;

    return tableContent;
}

const generateTableForSeason2 = (jsonContent) => {
    const guildInformation = jsonContent.shift();

    let tableContent = `
        <table>
        <tr>
        <th scope="col" colspan="8">
            <div class="guildImgAndName">
                <span class="guildName">${guildInformation.guildName}</span>
            </div>
        </th>
        </tr>
    `

    for (let i = 0; i < jsonContent.length; i += 2) {
        const member1 = jsonContent[i] || {};
        const member2 = jsonContent[i + 1] || {};

        tableContent += `
            <tr>
                ${getForSeason2Member(member1)}
                ${getForSeason2Member(member2)}
            </tr>
        `;
    }

    tableContent += `
        </table>
    `;

    return tableContent;
}

const getForSeason2Member = (member) => {
    if (!member || Object.keys(member).length === 0) {
        return `
            <td>
                <span class="bjName"></span>
            </td>
            <td></td>
            <td></td>
            <td></td>
        `;
    }

    return `
        <td>
            <img
                src="${member.image !== 'img' ? member.image : '/img/default.png'}"
                alt="${member.name}"
                class="profilePhoto"
            />
            <span class="bjName">${member.name}</span>
        </td>
        <td>${member.rpg}</td>
        <td>${member.primaryJob || 'N/A'}</td>
        <td>${member.secondaryJob || 'N/A'}</td>
    `;
} 

const generateTableForMacaoTalk = (jsonContent) => {
    const guildInformation = jsonContent.shift();

    let tableContent = `
        <table>
            <tr>
                <th scope="col" colspan="2">${guildInformation.guildName}</th>
            </tr>
    `;

    jsonContent.forEach(member => {
        tableContent += `
            <tr>
                <td>
                    <img
                        src="${member.image !== 'img' ? member.image : '/img/default.png'}"
                        alt="${member.name}"
                        class="profilePhoto"
                    />
                </td>
                <td>${member.name}</td>
            </tr>
        `;
    });

    tableContent += `
        </table>
    `;

    return tableContent;
}

const generateTableForAlligator = (jsonContent) => {
    const guildInformation = jsonContent.shift();

    let tableContent = `
        <table>
        <tr>
            <th scope="col" colspan="10">
                <div class="guildImgAndName">
                    <img
                    src="${guildInformation.guildImg}"
                    alt="${guildInformation.guildName}"
                    class="guildImg"
                    />
                    <span class="guildName">${guildInformation.guildName}</span>
                </div>
            </th>
        </tr>
    `;

    for (let i = 0; i < jsonContent.length; i += 2) {
        const member1 = jsonContent[i] || {};
        const member2 = jsonContent[i + 1] || {};

        tableContent += `
            <tr>
                ${getForAlligatorMember(member1)}
                ${getForAlligatorMember(member2)}
            </tr>
        `;
    }

    tableContent += `
        </table>
    `;

    return tableContent;
};

const getForAlligatorMember = (member) => {
    if (!member || Object.keys(member).length === 0) {
        return `
            <td>
                <span class="bjName"></span>
            </td>
            <td>
                <div class="weaponsAndLevel">
                    <span class="weapon"></span>
                    <span class="level"></span>
                </div>
            </td>
            <td>
                <div class="combatAndLevel">
                    <span class="combat"></span>
                    <span class="level"></span>
                </div>
            </td>
            <td></td>
            <td></td>
        `;
    }

    // member.name 값이 존재하고 name의 길이가 5이상이면 shrink를 추가한다.
    const bjFonShrink = member.name && member.name.length >= 5 ? 'shrink' : '';

    return `
        <td>
            <a href="${member.bjBroadcastingStationURL || '#'}" class="bjBroadcastingStation" target="_blank">
                <img
                    src="${member.image !== 'img' ? member.image : '/img/default.png'}"
                    alt="${member.name}"
                    class="profilePhoto"
                />
                <span class="bjName ${bjFonShrink}">${member.name}</span>
            </a>
        </td>
        <td>
            <div class="weaponsAndLevel">
                <span class="weapon">무기강화</span>
                <span class="level">Lv${member.weaponLevel || 'N/A'}</span>
            </div>
        </td>
        <td>
            <div class="combatAndLevel">
                <span class="combat">전투레벨</span>
                <span class="level">Lv${member.combatLevel || 'N/A'}</span>
            </div>
        </td>
        <td>${member.primaryJob || 'N/A'}</td>
        <td>${member.secondaryJob || 'N/A'}</td>
    `;
};

