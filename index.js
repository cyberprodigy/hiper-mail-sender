const moment = require("moment");
const RECIPIENT = "kundeservice@hiper.dk";
//const RECIPIENT = "jekabs.karklins@gmail.com";
const ONE_HOUR_IN_MS = 1000 * 60 * 60;

const send = require("gmail-send")({
  user: "jekabs.karklins@gmail.com",
  pass: process.env.ppw,
  to: RECIPIENT,
  subject: "Technician visit cancellation",
});

function formatMoment(momentObj) {
  return momentObj.format("dddd, MMMM DD");
}
function getBody() {
  const weekStart = moment(1629315283000).add(5, "d");
  const weekEnd = moment(1629315283000).add(11, "d");

  return `
    Dear, customer support,
    
    I hereby inform that I will not be able to secure the access on my apartment
    on Strandboulevarden 97, st. tv, 2100 for the technician from ${formatMoment(
      weekStart
    )} til ${formatMoment(weekEnd)}, ${moment().format("YYYY")}. 
    
    If you have booked the technician in those dates, please make sure the visit is cancelled.
    
    If there is no planned visit, simply discard this message.
    
    Regards`;
}

function log(msg) {
  const time = moment().format("DD.MMM, HH:mm");
  console.log(`[${time}] ${msg}`);
}
function sendEmail() {
  log("Sending email");
  send(
    {
      text: getBody(),
    },
    (error, result, fullResult) => {
      if (error) {
        log(error);
      }
      if (result) {
        log(result);
      }
      if (fullResult) {
        log(JSON.stringify(fullResult));
      }
    }
  );
}

function checkAndExecuteIfTime() {
  log("Periodic check");
  if (moment().isoWeekday() === 3 && moment().hour() === "04") {
    sendEmail();
  } else {
    log(
      `Email NOT sent. Day: ${moment().isoWeekday()}; Hour:${moment().hour()}`
    );
  }
}
setInterval(() => {
  checkAndExecuteIfTime();
}, ONE_HOUR_IN_MS);

checkAndExecuteIfTime();
