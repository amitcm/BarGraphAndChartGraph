var CanvasChart = function () {
    var margin = { top: 20, left: 50, right: 0, bottom: 20 };
    var chartHeight, chartWidth, yMax, xMax, data, ctx;
    var maxYValue = 0;
    var index;
    var renderType = { lines: 'lines' };

    var render = function (canvasCTX, dataObj, BGDrawn) {
        data = dataObj;
        maxYValue = 100;
        chartHeight = canvasCTX.canvas.getAttribute('height');
        chartWidth = canvasCTX.canvas.getAttribute('width');
        xMax = chartWidth - (margin.left + margin.right);
        yMax = chartHeight - (margin.top + margin.bottom);
        ctx = canvasCTX;
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
        ctx.fillText(data.yLabel, (yMax / 2 + 15) * -1, margin.left / 5);
        ctx.restore();
    };

    var renderLinesAndLabels = function () {
        //Vertical guide lines
        var yInc = yMax / 3;
        var yPos = margin.top;
        var xInc = Math.round(xMax / (data.dataPointsX.length));
        var xPos = margin.left;
        ctx.font = (data.dataPointFont != null) ? data.dataPointFont : '12px sans-serif';

        //Vertical line
        drawLine(margin.left, margin.top, margin.left, yMax + margin.top, '#6495ED', 8);

        //Horizontal Line
        drawLine(margin.left, yMax + margin.top, xMax, yMax + margin.top, '#6495ED', 0.5);

        //x axis labels
        for (var i = 0; i < data.dataPointsX.length; i++) {
            txt = data.dataPointsX[i];
            txtSize = ctx.measureText(txt);
            ctx.fillText(txt, xPos - txtSize.width / 2, yMax + (margin.top + margin.bottom));
            xPos += xInc;
        }

        // y axis labels and //horizontal faded Lines on graph
        for (var i = 3; i >= 0; i--) {
            //horizontal faded Lines on graph
            drawLine(margin.left - 12, yPos, xMax, yPos, '#4169E1', 0.25);


            //y axis labels
            var txt = i; // Math.round(maxYValue / 3 * i);
            var txtSize = ctx.measureText(txt);
            ctx.fillText(txt, margin.left - ((txtSize.width >= 14) ? txtSize.width : 10) - 7, yPos + 4);
            yPos += yInc;
        }
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

    var renderGraphData = function (canvasCTX, dataObj, idx) {
        data = dataObj;
        index = idx;
        //render data based upon type of renderType(s) that client supplies
        if (data.renderTypes == undefined || data.renderTypes == null)
            data.renderTypes = [renderType.lines];
        renderData(data.renderTypes[0]);
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
                drawLine(ptX_, ptY_, prevX, prevY, colors[index], 2.5);
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

    return {
        renderType: renderType,
        render: render,
        renderGraphData: renderGraphData
    };
} ();