const allTweets = []
const regex = /#psychosecurity/gi
const nexlineRegex = /\\n/gi
const httpRegex = /https?:\/\/[^\s]+/gi
const urlParams = new URLSearchParams(window.location.search);
const bgcolor = urlParams.get('bg') || 'black'

const body = document.querySelector('body');
const overlay = document.querySelector('#overlay');

body.style.backgroundColor = bgcolor

/**
 * 
 */
async function refresh() {
  const app = document.getElementById('app');

  const response = await fetch("https://workflow.hypercrowd.org/webhook/919cba39-a115-4c20-8dab-395c6267247b", {
    "referrer": "",
    "referrerPolicy": "no-referrer",
    "body": null,
    "method": "GET"
  });

  const tweets = await response.json();

  for (const tweet of tweets)  {
    const exists = allTweets.find(oldTweet => tweet.url === oldTweet.url)

    if (!exists) {
      allTweets.push(tweet)  
    }
  }

  let tweetListHtml = ``
  let i = 100

  for (const tweet of allTweets) {
    tweetListHtml += `<div class="tweet opacity-${i}">
      <div class="title">
        <span class="photo floatLeft">
          <img src="${tweet.photo}" width="25" height="25">
        </span>
        <span class="user">
          ${tweet.title}
        </span>
      </div>
      <div class="text">
        ${tweet.description
          .replace(regex, '')
          .replace(nexlineRegex, '<br />')
          .replace(httpRegex, '')
        }
      </div>
    </div>`

    i -= 20;

    if (i < 0) {
      break;
    }
  }

  app.innerHTML = `<div id="tweets">
    ${tweetListHtml}
  </<div id="tweets">`
}

/**
 * 
 */
const loader = setInterval(async function () {
  if (document.readyState !== 'complete') {
    return;
  }

  clearInterval(loader);

  await refresh();
}, 300);

/**
 * 
 */
window.setInterval(async function () {
  await refresh();
}, 60000);

