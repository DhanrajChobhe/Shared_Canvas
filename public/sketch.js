let socket;

socket = io.connect("http://localhost:3000");

window.addEventListener("load", () => {
  const canvas = document.getElementById("mycan");
  let ctx = canvas.getContext("2d");

  //resizing
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  //variables
  let painting = false;

  function startPosition(e) {
    painting = true;
    let data = {
      x: e.clientX,
      y: e.clientY,
    };
    socket.emit("mousedown", data);
    draw(e);
  }
  function endPosition(e) {
    let data = {
      x: e.clientX,
      y: e.clientY,
    };
    socket.emit("mouseup", data);
    painting = false;
    ctx.beginPath();
  }
  function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 1;
    ctx.lineCap = "round";

    ctx.strokeStyle = "#000000";

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);

    console.log("sending: " + e.clientX + "," + e.clientY);

    let data = {
      x: e.clientX,
      y: e.clientY,
    };
    socket.emit("mouse", data);
  }

  //eventListeners
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", endPosition);
  canvas.addEventListener("mousemove", draw);

  socket.on("mousedown", (data) => {
    painting = true;
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#FF0000";
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
  });
  socket.on("mouse", newDrawing);
  function newDrawing(data) {
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#FF0000";
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
  }
  socket.on("mouseup", (data) => {
    painting = false;
    ctx.beginPath();
  });
});
