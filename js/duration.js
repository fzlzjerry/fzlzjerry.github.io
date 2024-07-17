function createtime() {
  const grt = new Date("07/15/2024 16:36:48"); // 建站时间
  const now = new Date();

  const timeDifference = now - grt;

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  const hnum = hours < 10 ? "0" + hours : hours;
  const mnum = minutes < 10 ? "0" + minutes : minutes;
  const snum = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("timeDate").innerHTML = "本站已安全运行 " + days + " 天 ";
  document.getElementById("times").innerHTML = hnum + " 小时 " + mnum + " 分 " + snum + " 秒";
}

setInterval(createtime, 250);
