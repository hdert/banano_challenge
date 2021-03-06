// Import just what we need
"use strict";

import Modal from "bootstrap/js/dist/modal";

import "bootstrap/js/dist/alert";
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
  let [account, banano, raw, pending, history] = await getAccountDetails();
  document.getElementById("infoModalHeaderH5").innerHTML = account;
  document.getElementById("infoModalBody").innerHTML =
    "<p>" +
    banano +
    " ban</p>\n" +
    "<small>+" +
    raw +
    " raw</small>\n" +
    "<p>" +
    pending +
    " ban pending</p>" +
    historyGenerator(history);

  new Modal(document.getElementById("infoModal")).show();
}

function historyGenerator(history) {
  let string = "";
  for (const [_, transaction] of Object.entries(history.history)) {
    string +=
      "<div class='card mb-2 bg-dark " +
      (transaction.type == "send" ? "sent" : "received") +
      "'><div class='card-body text-truncate'>" +
      (transaction.type == "send" ? "Sent " : "Received ") +
      bananojs.getBananoPartsFromRaw(transaction.amount).banano +
      " ban " +
      (transaction.type == "send" ? "to" : "from") +
      ": " +
      transaction.account +
      "</div></div>\n";
  }
  return string;
}

document.getElementById("submitButton").onclick = function () {
  formHandler();
};

async function getAccountDetails() {
  let account = document.getElementById("textAreaInput").value;
  let accountBalance = await bananojs.getAccountBalanceAndPendingRaw(account);
  let balance = accountBalance.balance;
  let pending = accountBalance.pending;
  let bananoParts = bananojs.getBananoPartsFromRaw(balance);
  let [banano, raw] = [bananoParts.banano, bananoParts.raw];
  let bananoPending = bananojs.getBananoPartsFromRaw(pending).banano;
  let history = await bananojs.getAccountHistory(account, 100);
  return [account, banano, raw, bananoPending, history];
}
