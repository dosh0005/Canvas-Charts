var chartx = {
    data: null
    , canvas: null
    , ctx: null
    , valueMin: null
    , valueMax: null
    , myTotal : 0
    , lbl : null
    , init: function () {
        chartx.addBtnEvent();
        chartx.lbl = document.getElementById("lbl");
        chartx.canvas = document.getElementById("canvas2d");
        chartx.ctx = chartx.canvas.getContext("2d");
        chartx.getData();
    }
    , getData: function () {
        fetch("browsers.json").then(function (response) {
            return response.json();
        }).then(function (jsonResponse) {
            chartx.lbl.innerHTML = jsonResponse.label;
            chartx.findValue(jsonResponse.segments);
            chartx.data = jsonResponse.segments;
            chartx.drawChartPie();
        });
    }
    , findValue: function (s) {
        var tdata = [];
       for (var i = 0; i < s.length; i++) {
            tdata.push(s[i].value);
           chartx.myTotal += s[i].value;
        }
        chartx.valueMax = Math.max(...tdata);
        chartx.valueMin = Math.min(...tdata);
    }
    , drawChartPie: function () {
        
        //clear the canvas
        chartx.ctx.clearRect(0, 0, chartx.canvas.width, chartx.canvas.height);
        var cx = chartx.canvas.width / 2;
        var cy = chartx.canvas.height / 2;
        var currentAngle = 0;
        for (var i = 0; i < chartx.data.length; i++) {
            var radius = 100;
            if (chartx.data[i].value == chartx.valueMax) {
                radius = 120;
            }
            if (chartx.data[i].value == chartx.valueMin) {
                radius = 80;
            }
            var pct = chartx.data[i].value / chartx.myTotal;
            var endAngle = currentAngle + (pct * (Math.PI * 2));
            chartx.ctx.moveTo(cx, cy);
            chartx.ctx.beginPath();
            chartx.ctx.fillStyle = chartx.data[i].color;
            //            console.log(cx + " " + cy);
            chartx.ctx.arc(cx, cy, radius, currentAngle, endAngle, false);
            chartx.ctx.lineTo(cx, cy);
            chartx.ctx.fill();
            //Now draw the lines that will point to the values
            chartx.ctx.save();
            chartx.ctx.translate(cx, cy); //make the middle of the circle the (0,0) point
            chartx.ctx.strokeStyle = "#0CF";
            chartx.ctx.lineWidth = 1;
            chartx.ctx.beginPath();
            //angle to be used for the lines
            var midAngle = (currentAngle + endAngle) / 2; //middle of two angles
            chartx.ctx.moveTo(0, 0); //this value is to start at the middle of the circle
            //to start further out...
            var dx = Math.cos(midAngle) * (0.8 * radius);
            var dy = Math.sin(midAngle) * (0.8 * radius);
            chartx.ctx.moveTo(dx, dy);
            //ending points for the lines
            var dx = Math.cos(midAngle) * (radius + 30); //30px beyond radius
            var dy = Math.sin(midAngle) * (radius + 30);
            chartx.ctx.lineTo(dx, dy);
            chartx.ctx.stroke();
            chartx.ctx.fillStyle = "#000000";
            chartx.ctx.fillText(chartx.data[i].label, dx + 5, dy + 5);
            //put the canvas back to the original position
            chartx.ctx.restore();
            //update the currentAngle
            currentAngle = endAngle;
        }
    }
    , drawChartCircle: function () {
        //clear the canvas
        chartx.ctx.clearRect(0, 0, chartx.canvas.width, chartx.canvas.height);
        var numPoints = chartx.data.length; //number of circles to draw.
        var padding = 13; //space away from left edge of canvas to start drawing.
        var magnifier = 10;
        var horizontalAxis = chartx.canvas.height / 2; //how far apart to make each x value.
        var currentPoint = 0; //this will become the center of each cirlce.
        var x = 0;
        var y = horizontalAxis; //center y point for circle
        var colour = "#00FF00";
        for (var i = 0; i < chartx.data.length; i++) {
            var pct = Math.round((chartx.data[i].value / chartx.myTotal) * 100);
            console.log(chartx.data[i].value ,chartx.myTotal);
            console.log("--");
            var a = (0xD0 + Math.round(Math.random() * 0x2F));
            var b = (0xD0 + Math.round(Math.random() * 0x2F));
            colour = chartx.data[i].color;
            var radius = Math.sqrt(pct / Math.PI) * magnifier;
            x = currentPoint + padding + radius;
            chartx.ctx.beginPath();
            chartx.ctx.fillStyle = colour;
            chartx.ctx.strokeStyle = "#333"; //colour of the lines 
            chartx.ctx.lineWidth = 3;
            chartx.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            chartx.ctx.closePath();
            chartx.ctx.fill(); //fill comes before stroke
            chartx.ctx.stroke();
            var lbl = chartx.data[i].label;
            chartx.ctx.font = "normal 12pt Arial";
            chartx.ctx.textAlign = "center";
            chartx.ctx.fillStyle = "#000000"; //colour inside the circle
            chartx.ctx.beginPath();
            var dy;
            if(i%2){
            dy = y + 40;
            }
            else{
            dy = y - 40
            }
            chartx.ctx.fillText(lbl, x, dy + 6);
            //------------
            chartx.ctx.save();
            chartx.ctx.strokeStyle = "#0CF";
            chartx.ctx.lineWidth = 1;
            chartx.ctx.beginPath();
            var midAngle = 90; 
            chartx.ctx.moveTo(x, y);
            if(i%2){
            dy = y + 35;
            }
            else{
            dy = y - 35
            }
            chartx.ctx.lineTo(x, dy);
            chartx.ctx.stroke();
            
            //------------
            chartx.ctx.closePath();
            currentPoint = x + radius;
            //move the x value to the end of the circle for the next point  
        }
    }
    , addBtnEvent: function () {
        document.getElementById("pie").addEventListener("click", chartx.drawChartPie);
        document.getElementById("circle").addEventListener("click", chartx.drawChartCircle);
    }
}
chartx.init();