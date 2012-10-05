var CanvasChart_ = function () {
    var margin = { top: 20, left: 50, right: 0, bottom: 20 };
    var chartHeight, chartWidth, yMax, xMax, data, ctx;
    var maxYValue = 0;
    var ratio = 0;
    var renderType = { lines: 'lines', points: 'points' };

    var render = function (canvasCTX, dataObj, BGDrawn) {
        data = dataObj;
        maxYValue = 100;
        chartHeight = canvasCTX.canvas.getAttribute('height');
        chartWidth = canvasCTX.canvas.getAttribute('width');
        xMax = chartWidth - (margin.left + margin.right);
        yMax = chartHeight - (margin.top + margin.bottom);
        ctx = canvasCTX;
        ctx.canvas.addEventListener('click', clickReporter, false);

        renderChart(BGDrawn);
    };

    var renderChart = function (BGDrawn) {
        if (BGDrawn == 0) {
            renderBackground();
            renderText();
            renderLinesAndLabels();
        }
    };

    var renderBackground = function () {
        var lingrad = ctx.createLinearGradient(margin.left, margin.top, xMax - margin.right, yMax);

        ctx.fillStyle = lingrad;
        ctx.fillRect(margin.left, margin.top, xMax - margin.left, yMax);
        ctx.fillStyle = 'blue';
    };

    // Graphs Texts
    var renderText = function () {
        ctx.textAlign = "center";
        ctx.font = "12px sans-serif";

        //Y-axis text
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        // Change 2nd argument to place Y axis text at right place
        //ctx.fillText(data.yLabel, (yMax / 2 + 15) * -1, margin.left / 5);
        ctx.restore();
    };

    var renderLinesAndLabels = function () {
        //Vertical guide lines
        var yInc = yMax / 5;
        var yPos = margin.top;
        var xInc = getXInc();
        var xPos = margin.left;
        ctx.font = (data.dataPointFont != null) ? data.dataPointFont : '12px sans-serif';

        //x axis labels
        for (var i = 0; i < data.dataPointsX.length; i++) {
            txt = data.dataPointsX[i];
            txtSize = ctx.measureText(txt);
            ctx.fillText(txt, xPos, yMax + (margin.top + margin.bottom));
            xPos += xInc;
        }

        //y axis labels and //horizontal faded Lines on graph
        for (var i = 5; i >= 0; i--) {
            //horizontal faded Lines on graph
            drawLine(margin.left, yPos, xMax, yPos, '#E8E8E8');

            //y axis labels
            var txt = Math.round(maxYValue / 5 * i);
            var txtSize = ctx.measureText(txt);
            ctx.fillText(txt, margin.left - ((txtSize.width >= 14) ? txtSize.width : 10) - 7, yPos + 4);
            yPos += yInc;
        }

        //Vertical line
        drawLine(margin.left - 8, margin.top, margin.left - 8, yMax + margin.top, '#6495ED', 8);

        //Horizontal Line
        drawLine(margin.left - 8, yMax + margin.top, xMax, yMax + margin.top, '#6495ED', 0.5);
    };

    var getXInc = function () {
        return Math.round(xMax / data.dataPointsX.length) - 1;
    };

    var drawLine = function (startX, startY, endX, endY, strokeStyle, lineWidth) {
        if (strokeStyle != null) ctx.strokeStyle = strokeStyle;
        if (lineWidth != null) ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.closePath();
    };

    var renderGraphData = function (canvasCTX, dataObj) {
        data = dataObj;
        //console.log("Canvas width/height:" + ctx.canvas.width + "/" + ctx.canvas.height);
        //render data based upon type of renderType(s) that client supplies
        if (data.renderTypes == undefined || data.renderTypes == null)
            data.renderTypes = [renderType.lines];
        for (var i = 0; i < data.renderTypes.length; i++) {
            renderData(data.renderTypes[i]);
        }
    };

    var renderData = function (type) {
        var xInc = getXInc();
        var prevX = 0;
        var prevY = 0;
        var ptY_ = 0;
        var ptX_ = 0;

        for (var i = 0; i < data.dataPointsY.length; i++) {
            ptY_ = yMax - ((yMax / maxYValue) * data.dataPointsY[i]);
            if (ptY_ < 0)
                ptX_ = 0;
            var ptX_ = (i * xInc) + margin.left;
            ptY_ += margin.top;
            ptX_ = Math.round(ptX_);
            ptY_ = Math.round(ptY_);

            if (i > 0 && type == renderType.lines) {
                drawLine(ptX_, ptY_, prevX, prevY, 'blue', 1);
            }

            if (type == renderType.points) {
                ctx.fillRect(ptX_ - 5, ptY_ - 5, 10, 10);
            }
            prevX = ptX_;
            prevY = ptY_;
        }
    };

    function showStrokeText(rect, canvasID) {
        var context = canvasID.getContext("2d");
        context.strokeStyle = "#003300";
        context.font = '12px san-serif';
        context.textBaseline = 'bottom';
        context.strokeText('X, Y are: ', rect.x + 10, rect.y);
    }

    function clickReporter(e) {
        var rect;
        e.target.title = "";
        while (e.target.firstChild) {
            e.target.removeChild(e.target.firstChild);
        }

        if (document.getElementById('cg_canvas_barthel') == e.currentTarget) {
            rect = collides(barthel_dataPointsX, barthel_dataPointsY, e.offsetX, e.offsetY, 'cg_canvas_barthel');
        }
        if (document.getElementById("cg_canvas_activities") == e.currentTarget) {
            rect = collides(dataPointsX, dataPointsY, e.offsetX, e.offsetY, "cg_canvas_activities");
        }
        if (rect) {
            //console.log('Yes! ' + rect.x + '/' + rect.y);
            showTooltip(rect, e);
        } else {
            console.log('No!' + e.offsetX + '/' + e.offsetY);
        }
    }

    function RemoveTooltip(e) {
        e.target.title = e.target._spanRef.innerHTML;
        e.target.removeChild(e.target._spanRef);
    }

    function showTooltip(rect, e) {
        // create and add a span element to act as a tooltip
        var spanElm = document.createElement("span");
        spanElm.className = "tooltip";
        spanElm.innerHTML = e.target.title;
        // set target element's title 
        //console.log("Loc: X:" + rect.x + "Y:" + rect.y);
        e.target.title = "Loc: X:" + rect.x + " :: Y:" + rect.y;
        e.target.appendChild(spanElm);
        e.target._spanRef = spanElm;
    }

    function collides(coordinateX, coordinateY, x, y, canvasID) {
        var xInc = getXInc();
        var isCollision;
        var pty_collide = 0;
        var ptx_collide = 0;
        var chartHeight_ = 0;
        var chartWidth_ = 0;
        var xMax_ = 0;
        var yMax_ = 0;

        chartHeight_ = document.getElementById(canvasID).getAttribute('height');
        chartWidth_ = document.getElementById(canvasID).getAttribute('width');
        xMax_ = chartWidth_ - (margin.left + margin.right);
        yMax_ = chartHeight_ - (margin.top + margin.bottom);

        for (var i = 0, len = coordinateX.length; i < len; i++) {
            pty_collide = yMax_ - ((yMax_ / maxYValue) * coordinateY[i]);
            if (pty_collide < 0) pty_collide = 0;
            ptx_collide = ((i % 15) * xInc) + margin.left;
            pty_collide += margin.top;
            ptx_collide = Math.round(ptx_collide);
            pty_collide = Math.round(pty_collide);

            var left = ptx_collide - 5, right = ptx_collide + 5;
            var top = pty_collide - 5, bottom = pty_collide + 5;
            if (right >= x && left <= x && bottom >= y && top <= y) {
                isCollision = {
                    x: coordinateX[i],
                    y: coordinateY[i]
                };
                break;
            }
        }
        return isCollision;
    }

    return {
        renderType: renderType,
        render: render,
        renderGraphData: renderGraphData
    };
} ();