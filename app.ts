
const root = document.getElementById('root')!;
const form = document.getElementById('form')!;
const input: HTMLInputElement = document.querySelector('input[name="author"]')!;
const textarea: HTMLInputElement = document.querySelector('textarea[name="textarea"]')!;

const url = "http://146.185.154.90:8000/messages";
let lastDate: string;

type Info = {
    message: string;
    author: string;
    datetime: string;
    _id: string
};

const handler = (obj: [Info]) => {
    obj.forEach(async (msg: Info) => {
        const element = document.createElement('div');
        if (root.lastElementChild) {
            element.id = String(Number(root.lastElementChild.id) + 1);
        } else {
            element.id = "1";
        }

        element.className = "message-div";
        element.innerHTML = `
            <p>Message # ${element.id}</p>
            <p><b>Message: </b>${msg["message"]}</p>
            <p><b>Author: </b>${msg["author"]}</p>
            <p><b>Date and time: </b>${msg["datetime"]}</p>`;
        root.append(element);
    });
};

const run = async () => {
    const data = await fetch(url);
    const result = await data.json();
    lastDate = result[result.length - 1]["datetime"];
    handler(result);
};

run().catch(e => console.error(e));

const interval = setInterval(async () => {
    const datetimeData = await fetch(url + '?datetime=' + lastDate);
    const datetimeResult = await datetimeData.json();
    console.log(lastDate);
    if (datetimeResult.length > 0) {
        lastDate = datetimeResult[datetimeResult.length - 1]["datetime"];
        handler(datetimeResult);
    }
}, 3000);

form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('spinner')!.classList.add('fa-spinner', 'fa-spin');

    setTimeout(() => {
        document.getElementById('spinner')!.classList.remove('fa-spinner', 'fa-spin');
    }, 1200);

    const body = new URLSearchParams();
    const author = input.value;
    const message = textarea.value;
    body.append('author', author);
    body.append('message', message);

    fetch('http://146.185.154.90:8000/messages', { method: 'POST', body }).catch(e => console.error(e));
    
    input.value = "";
    textarea.value = "";
});

