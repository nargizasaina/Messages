"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const root = document.getElementById('root');
const form = document.getElementById('form');
const input = document.querySelector('input[name="author"]');
const textarea = document.querySelector('textarea[name="textarea"]');
const url = "http://146.185.154.90:8000/messages";
let lastDate;
const handler = (obj) => {
    obj.forEach((msg) => __awaiter(void 0, void 0, void 0, function* () {
        const element = document.createElement('div');
        if (root.lastElementChild) {
            element.id = String(Number(root.lastElementChild.id) + 1);
        }
        else {
            element.id = "1";
        }
        element.className = "message-div";
        element.innerHTML = `
            <p>Message # ${element.id}</p>
            <p><b>Message: </b>${msg["message"]}</p>
            <p><b>Author: </b>${msg["author"]}</p>
            <p><b>Date and time: </b>${msg["datetime"]}</p>`;
        root.append(element);
    }));
};
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch(url);
    const result = yield data.json();
    lastDate = result[result.length - 1]["datetime"];
    handler(result);
});
run();
const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const datetimeData = yield fetch(url + '?datetime=' + lastDate);
    const datetimeResult = yield datetimeData.json();
    console.log(lastDate);
    if (datetimeResult.length > 0) {
        lastDate = datetimeResult[datetimeResult.length - 1]["datetime"];
        handler(datetimeResult);
    }
}), 3000);
form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('spinner').classList.add('fa-spinner', 'fa-spin');
    setTimeout(() => {
        document.getElementById('spinner').classList.remove('fa-spinner', 'fa-spin');
    }, 1200);
    const body = new URLSearchParams();
    const author = input.value;
    const message = textarea.value;
    body.append('author', author);
    body.append('message', message);
    fetch('http://146.185.154.90:8000/messages', { method: 'POST', body });
    input.value = "";
    textarea.value = "";
});
