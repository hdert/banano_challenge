// Import just what we need
"use strict";

import Modal from "bootstrap/js/dist/modal";

// import "bootstrap/js/dist/alert";
import "bootstrap/js/dist/button";
// import "bootstrap/js/dist/carousel";
// import "bootstrap/js/dist/collapse";
// import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/modal";
// import "bootstrap/js/dist/popover";
// import 'bootstrap/js/dist/scrollspy';
// import 'bootstrap/js/dist/tab';
// import 'bootstrap/js/dist/toast';
// import 'bootstrap/js/dist/tooltip';

const bananojs = require("@bananocoin/bananojs");
bananojs.setBananodeApiUrl("https://kaliumapi.appditto.com/api");

async function formHandler() {
  let [account, balance] = await getAccountDetails();
  document.getElementById("infoModalHeaderH5").innerHTML = account;
  document.getElementById("infoModalBody").innerHTML = "<p>" + balance + "</p>";
  new Modal(document.getElementById("infoModal")).show();
}

document.getElementById("submitButton").onclick = function () {
  formHandler();
};

async function getAccountDetails() {
  let account = document.getElementById("textAreaInput").value;
  let balance =
    Math.round(
      (await bananojs.getAccountBalanceRaw(account)) /
        1000000000000000000000000000
    ) / 100;
  return [account, balance];
}
