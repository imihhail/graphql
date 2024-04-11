import { logout } from "./authentication.js"

let content = document.getElementById('content')

export function profile(firstName, lastName, IDcode, country, city, email, xps, grades, auditRatio) {
    let grahps = document.createElement('div')
    grahps.className = 'graphs'

    let logoutText = document.createElement('p')
    logoutText.innerHTML = '<b>Logout</b>'
    logoutText.addEventListener('click', logout)
    content.appendChild(logoutText)

    let profileDiv = document.createElement('div')
    profileDiv.className = 'profileDiv'
    profileDiv.innerHTML = `
    <div id="identificationList">
    <p style="align-self: center";"><b>Identification</b></p>
    <p>Firstname: ${firstName}</p>
    <p>Lastname: ${lastName}</p>
    <p>ID-code: ${IDcode}</p>
    <p>E-mail: ${email}</p>
    <p>Country: ${country}</p>
    <p>City: ${city}</p>    
    </div>`
    
    let AllProjects = document.createElement('div')
    AllProjects.className = "AllProjects"
    AllProjects.innerHTML = "<b>Projects</b>"

    grades.forEach(project => {
        let projectInfo = document.createElement('div')
        projectInfo.className = 'projectInfo'
        projectInfo.innerHTML = `
        <p>${project.object.name.toUpperCase()}<p>
        <p>Grade: ${project.grade.toFixed(1)}</p>
        `
        AllProjects.appendChild(projectInfo)
    })

    profileDiv.appendChild(AllProjects)
    content.appendChild(profileDiv)

    let graphsDiv = document.createElement('div')
    graphsDiv.className = 'graphsDiv'
    let wd = getComputedStyle(profileDiv);
    let profileWidth = parseFloat(wd.width);
    graphsDiv.style.width = (profileWidth / 2) + "px";
    
    graphsDiv.innerHTML = `
    <svg viewBox="-5 -5 120 136" >
        <line class = "graphLineUp" x1 = "11" y1 = "-5" x2 = "11" y2 = "100" stroke = "black" stroke-width = "1" />
        <line class = "graphLineRight" x1 = "11" y1 = "99.5" x2 = "115" y2 = "99.5" stroke = "black" stroke-width = "1" />
        <text class = "customText" x="-3" y="0" fill="white">150 kB</text>
        <text class = "customText" x="-3" y="16.6" fill="white">125 kB</text>
        <text class = "customText" x="-3" y="33.3" fill="white">100 kB</text>
        <text class = "customText" x="-1" y="49.9" fill="white">75 kB</text>
        <text class = "customText" x="-1" y="66.6" fill="white">50 kB</text>
        <text class = "customText" x="-1" y="83.2" fill="white">25 kB</text>
        <text class = "customText" x="1" y="99" fill="white">0 kB</text>
    </svg>
    `
    grahps.appendChild(graphsDiv)

  
    content.appendChild(grahps)
    let totalXP = 0    
    let row = 15
    let svg = document.querySelector('svg');

    for(let i = 0 ; i < xps.length ; i++) {
        let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        let projectName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        newLine.setAttribute('class', 'xpColumn')
        projectName.setAttribute('class', 'projectName');

        projectName.innerHTML = xps[i].path.slice(14)
        projectName.setAttribute('fill', 'white')
        projectName.setAttribute('x', `${row}`);
        projectName.setAttribute('y', `101`);
        svg.appendChild(projectName);

        newLine.setAttribute('x1', `${row}`);
        newLine.setAttribute('y1', `${100 - (xps[i].amount / 1000) * 0.666}`);
        newLine.setAttribute('x2', `${row}`);
        newLine.setAttribute('y2', '99');
        newLine.setAttribute('stroke-width', '5');
        svg.appendChild(newLine);
        row += 6
        totalXP += xps[i].amount / 1000
    }

    let xpCount = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xpCount.setAttribute('class', 'customText');
    xpCount.style.fontSize = "5px"

    xpCount.innerHTML = `Total XP: ${totalXP.toFixed(2)}`
    xpCount.setAttribute('fill', 'white')
    xpCount.setAttribute('x', '40');
    xpCount.setAttribute('y', '0');
    svg.appendChild(xpCount)

    let auditRatioDiv = document.createElement('div')
    auditRatioDiv.className = 'auditRatioDiv'
    auditRatioDiv.style.width = (profileWidth / 2) + "px"

    let done = 50
    let recieved = auditRatio * done

    auditRatioDiv.innerHTML = `
    <svg viewBox="-5 -5 120 136" >
        <line class = "graphLineUp" x1 = "11" y1 = "-5" x2 = "11" y2 = "100" stroke = "black" stroke-width = "1" />
        <line class = "graphLineRight" x1 = "11" y1 = "99.5" x2 = "61" y2 = "99.5" stroke = "black" stroke-width = "1" />
        <line class = "done" x1 = "30" y1 = "99" x2 = "30" y2 = ${done} stroke = "yellow" stroke-width = "10" />
        <line class = "recieved" x1 = "42" y1 = "99" x2 = "42" y2 = ${recieved} stroke = "white" stroke-width = "10" />
        <text class = "ratio" x="30" y="0" fill="white">Audit ratio: ${auditRatio}</text>
        <text class = "customText" x="3" y="0" fill="white">2.0</text>
        <text class = "customText" x="3" y="25" fill="white">1.5</text>
        <text class = "customText" x="3" y="49.9" fill="white">1.0</text>
        <text class = "customText" x="3" y="75" fill="white">0.5</text>
        <text class = "customText" x="5" y="99" fill="white">0</text>
        <text class = "projectName" x="30" y="101" fill="white">Done</text>
        <text class = "projectName" x="42" y="101" fill="white">Recieved</text>
    </svg>
    `
    grahps.appendChild(auditRatioDiv)
}

//background-color: #DCF900;
