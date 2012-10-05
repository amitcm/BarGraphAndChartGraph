function BarGraph(context) {

    // Private variables and functions
    var objBarGraph = this;
    var startArr;
    var endArr;
    var looping = false;

    // Loop method adjusts the height of bar and redraws if necessary
    // Written as function expression
    var loop = function () {
        var delta;
        var animationComplete = true;

        // Boolean to prevent update function from looping if already looping
        looping = true;

        // For each bar
        for (var i = 0; i < endArr.length; i += 1) {
            // Change the current bar height toward its target height
            delta = (endArr[i] - startArr[i]) / objBarGraph.animationSteps;
            objBarGraph.curArr[i] += delta;
            // If any change is made then flip a switch
            if (delta) {
                animationComplete = false;
            }
        }

        // If no change was made to any bars then we are done
        if (animationComplete) {
            looping = false;
        } else {
            // Draw and call loop again
            draw(objBarGraph.curArr);
            //setTimeout(loop, objBarGraph.animationInterval / objBarGraph.animationSteps);	
        }
    };

    // Draw method updates the canvas with the current display
    var draw = function (arr) {
        var numOfBars = arr.length;
        var barWidth, barHeight, border = 0, ratio, maxBarHeight, gradient, largestValue, graphAreaX = 0, graphAreaY = 0;
        var graphAreaWidth = objBarGraph.width;
        var graphAreaHeight = objBarGraph.height;
        var i;

        // Update the dimensions of the canvas only if they have changed
        if (context.canvas.width !== objBarGraph.width || context.canvas.height !== objBarGraph.height) {
            context.canvas.width = objBarGraph.width;
            context.canvas.height = objBarGraph.height;
        }

        // Draw the background color
        context.fillStyle = objBarGraph.backgroundColor;
        context.fillRect(0, 0, objBarGraph.width, objBarGraph.height);
        context.fillStyle = "#6495ED";
        context.fillRect(0, 0, 2, objBarGraph.height - 40);

        // If x axis labels exist then make room	
        if (objBarGraph.xAxisLabelArr.length) {
            graphAreaHeight -= 40;
        }

        // If y axis labels exist then make room	
        if (objBarGraph.yAxisLabelArr.length) {
            graphAreaWidth -= 40;
        }

        // Calculate dimensions of the bar
        barWidth = graphAreaWidth / numOfBars - objBarGraph.margin * 2;
        //barWidth /= 1.5;
        maxBarHeight = graphAreaHeight - 25;

        // Determine the largest value in the bar array
        var largestValue = 0;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] > largestValue) {
                largestValue = arr[i];
            }
        }

        // For each bar
        for (i = 0; i < arr.length; i += 1) {
            // Set the ratio of current bar compared to the maximum
            if (objBarGraph.maxValue) {
                ratio = arr[i] / objBarGraph.maxValue;
            } else {
                ratio = arr[i] / largestValue;
            }

            barHeight = ratio * maxBarHeight;

            // Turn on shadow
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowBlur = 2;
            context.shadowColor = "#999";

            // Draw bar background
            context.fillStyle = "#333";
            context.fillRect(objBarGraph.margin + i * objBarGraph.width / numOfBars, graphAreaHeight - barHeight, barWidth, barHeight);

            // Turn off shadow
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;

            // Draw bar color if it is large enough to be visible
            if (barHeight > 0/*border * 2*/) {
                // Create gradient
                gradient = context.createLinearGradient(0, 0, 0, graphAreaHeight);
                gradient.addColorStop(1 - ratio, objBarGraph.colors[i % objBarGraph.colors.length]);

                context.fillStyle = gradient;
                // Fill rectangle with gradient
                context.fillRect(objBarGraph.margin + i * objBarGraph.width / numOfBars + border,
						        graphAreaHeight - barHeight + border,
						        barWidth - border * 2,
						        barHeight - border * 2);
            }

            // Draw bar label if it exists
            if (objBarGraph.xAxisLabelArr[i]) {
                // Use try / catch to stop IE 8 from going to error town				
                context.fillStyle = "#333";
                context.font = "bold 12px sans-serif";
                context.textAlign = "center";
                try {
                    context.fillText(objBarGraph.xAxisLabelArr[i],
							i * objBarGraph.width / numOfBars + (objBarGraph.width / numOfBars) / 2,
							objBarGraph.height - 10);
                } catch (ex) { }
            }
        }
    };

    // Public properties and methods
    this.width = 600;
    this.height = 250;
    this.maxValue;
    this.margin = 20;
    this.colors = ["purple", "red", "green", "yellow"];
    this.curArr = [];
    this.backgroundColor = "#fff";
    this.xAxisLabelArr = [];
    this.yAxisLabelArr = [];
    this.animationInterval = 100;
    this.animationSteps = 10;

    // Update method sets the end bar array and starts the animation
    this.update = function (newArr) {
        // If length of target and current array is different 
        if (objBarGraph.curArr.length !== newArr.length) {
            objBarGraph.curArr = newArr;
            draw(newArr);
        } else {
            // Set the starting array to the current array
            startArr = objBarGraph.curArr;
            // Set the target array to the new array
            endArr = newArr;
            // Animate from the start array to the end array
            if (!looping) {
                loop();
            }
        }
    };
}