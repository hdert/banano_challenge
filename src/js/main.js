// Import just what we need

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

function formHandler() {
  publicKey = getAccountDetails();

  document.getElementById("infoModalHeaderH5").innerHTML = publicKey;
  document.getElementById("infoModalBody").innerHTML = "<p>Hello World!</p>";
  new Modal(document.getElementById("infoModal")).show();
}

document.getElementById("submitButton").onclick = function () {
  formHandler();
};

function getAccountDetails() {
  account = bananojs.getBananoAccount(document.getElementById("textAreaInput"));
  console.log(account);
  console.log(bananojs.getAccountBalanceRaw(account));
  return account;
}
