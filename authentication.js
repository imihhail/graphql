import { profile } from "./profilepage.js";

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const jwt = await SignIn(username, password);
    makeQuery(jwt);
})


export async function SignIn(username, password) {
    const url = 'https://01.kood.tech/api/auth/signin';
    const credentials = btoa(`${username}:${password}`)
  
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        })
  
        if (!response.ok) {
            alert("invalid credentials")
            throw new Error('Invalid credentials');
        }
  
        const data = await response.json()
        document.getElementById('content').innerHTML = ''
        localStorage.setItem('jwt', data)     
        return data

    } catch (error) {
        console.error('Error:', error)
    }
}

async function makeQuery(jwt) {
    const query = `{
        user {
          auditRatio  
          attrs
          xps(where: {originEventId: {_eq: "148"}}) {
            amount
            path
          }
        }
        result (where: {type: {_eq: "user_audit"}}) {
            grade
            object {
              name
            }
          }
      }`;

    const url = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        mode: 'cors', 
        body: JSON.stringify({ query })
    })

    if (!response.ok) {
        throw new Error('Query failed')
    }
    const data = await response.json()
    let user = data.data.user[0]

    // Audit ratio
    let auditRatio = user.auditRatio.toFixed(1)

    // User grades and project name
    let grades = data.data.result

    // User identification 
    let country = user.attrs.country
    let firstName = user.attrs.firstName
    let lastName = user.attrs.lastName
    let IDcode = user.attrs.personalIdentificationCode
    let email = user.attrs.email
    let city = user.attrs.addressCity

    profile(firstName, lastName, IDcode, country, city, email, user.xps, grades, auditRatio)
}

export function logout() {
    localStorage.removeItem('jwt')
    location.reload()
}

window.onload = async function() {
    const jwtCheck = localStorage.getItem('jwt')

    if (jwtCheck) {
        document.getElementById('content').innerHTML = ''
        makeQuery(jwtCheck)
    }
};