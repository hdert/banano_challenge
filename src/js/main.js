// Import just what we need
"use strict";

import Modal from "bootstrap/js/dist/modal";
import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
var relativeTime = require("dayjs/plugin/relativeTime");
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);

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
  let account = document.getElementById("addressInput").value;
  let accountBalance = await bananojs.getAccountBalanceAndPendingRaw(account);
  let balance = accountBalance.balance;
  let pending = accountBalance.pending;
  let bananoParts = bananojs.getBananoPartsFromRaw(balance);
  let [banano, raw] = [bananoParts.banano, bananoParts.raw];
  let bananoPending = bananojs.getBananoPartsFromRaw(pending).banano;
  let history = await bananojs.getAccountHistory(account, 100);
  return [account, banano, raw, bananoPending, history];
}

function getTime() {
  let birthdayEnd = dayjs.utc(dayjs.utc().year() + "-04-02T00:00:00-1200");
  let birthdayStart = dayjs.utc(dayjs.utc().year() + "-04-01T00:00:00+1400");
  let message = "placeholder text";
  if (dayjs.utc() > birthdayEnd.utc()) {
    birthdayStart = birthdayStart.utc().year(birthdayStart.utc().year() + 1);
  }
  if (dayjs.utc() > birthdayEnd.utc() || dayjs.utc() < birthdayStart.utc()) {
    let days_to_birthday = birthdayStart.utc().diff(dayjs.utc(), "day");
    let message_inner = "Something's gone wrong";
    if (!days_to_birthday) {
      message_inner = "in ";
    } else {
      message_inner =
        "in " + birthdayStart.utc().diff(dayjs.utc(), "day") + " days, ";
    }
    message =
      "Banano's birthday starts " +
      message_inner +
      (birthdayStart.utc().diff(dayjs.utc(), "hour") % 24) +
      " hours, " +
      (birthdayStart.utc().diff(dayjs.utc(), "minute") % 60) +
      " minutes, and " +
      (birthdayStart.utc().diff(dayjs.utc(), "second") % 60) +
      " seconds!";
  } else {
    message =
      "It's Banano's birthday! It ends in " +
      birthdayEnd.utc().diff(dayjs.utc(), "hour") +
      " hours, " +
      (birthdayEnd.utc().diff(dayjs.utc(), "minute") % 60) +
      " minutes, and " +
      (birthdayEnd.utc().diff(dayjs.utc(), "second") % 60) +
      " seconds!";
  }
  document.getElementById("bananoBirthday").innerHTML =
    "<p>" + message + "</p>";
}

function generateSeed() {
  let uint8 = new Uint8Array(32);
  let hex_string = "";
  window.crypto.getRandomValues(uint8);
  for (let i = 0; i < uint8.length; i++) {
    let hex = uint8[i].toString(16);
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    hex_string += hex;
  }
  return hex_string;
}

async function displaySeedAndAccounts() {
  let seed = generateSeed();
  let accounts = await getAccounts(seed);
  let message =
    "<table class='table table-responsive table-dark mb-0 rounded text-break'><tbody>";
  message += "<thead><tr><th scope='col'>#</th><th>Account</th></tr></thead>";
  accounts.forEach(function (item, index) {
    message +=
      "<tr><th scope='row'>" + (index + 1) + "</td><td>" + item + "</td></tr>";
  });
  message += "</tbody></table>";
  document.getElementById("infoModalHeaderH5").innerHTML = "Seed: " + seed;
  document.getElementById("infoModalBody").innerHTML = message;

  new Modal(document.getElementById("infoModal")).show();
}

async function getAccounts(seed) {
  let accounts = [];
  for (let i = 0; i < 5; i++) {
    accounts.push(await bananojs.getBananoAccountFromSeed(seed, i));
  }
  return accounts;
}

async function checkGuess(mobile) {
  let textBox = document.getElementById("priceGuess");

  let dateGuess = document.getElementById(
    "dateInput" + (mobile ? "Small" : "")
  ).value;
  if (!dateGuess) {
    textBox.innerHTML = "Please enter a date";
    return;
  }
  dateGuess = dayjs(dateGuess);
  dateGuess = dateGuess.add(1, "d");
  if (dateGuess.isSameOrAfter(dayjs())) {
    textBox.innerHTML = "Please enter a date that is in the past";
    return;
  }

  let priceGuess = document.getElementById(
    "priceGuessInput" + (mobile ? "Small" : "")
  ).value;
  if (priceGuess <= 0) {
    textBox.innerHTML = "Please enter a guess higher than zero";
    return;
  }
  priceGuess = Math.round(priceGuess * Math.pow(10, 5)) / Math.pow(10, 5);

  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/banano/history?date=" +
      dateGuess.format("DD-MM-YYYY") +
      "&localization=false"
  );
  let data = await response.json();
  if (!data.market_data) {
    textBox.innerHTML =
      "Error: No Data: Date too old, please enter a newer date";
    return;
  }
  let price =
    Math.round(data.market_data.current_price.usd * 100 * Math.pow(10, 5)) /
    Math.pow(10, 5);

  if (priceGuess > price) {
    textBox.innerHTML =
      "Your guess of ¢" +
      priceGuess +
      " was ¢" +
      Math.round((priceGuess - price) * Math.pow(10, 5)) / Math.pow(10, 5) +
      " higher than the actual price of ¢" +
      price;
  } else if (priceGuess < price) {
    textBox.innerHTML =
      "Your guess of ¢" +
      priceGuess +
      " was ¢" +
      Math.round((price - priceGuess) * Math.pow(10, 5)) / Math.pow(10, 5) +
      " lower than the actual price of ¢" +
      price;
  } else if (priceGuess == price) {
    textBox.innerHTML = "Your guess of $" + priceGuess + " was correct!";
  } else {
    textBox.innerHTML = "Your guess was invalid";
  }
}

document.getElementById("guessSubmitButton").onclick = function () {
  checkGuess(false);
};
document.getElementById("guessSubmitButtonSmall").onclick = function () {
  checkGuess(true);
};

setInterval(getTime, 1000);
document
  .getElementById("bananoSeedAndAccounts")
  .addEventListener("click", displaySeedAndAccounts);
