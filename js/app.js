/*
 *audio visualizer built with d3.js
 * 0.1.0
 */
//createMediaElementSource
//http://codepen.io/Wayou/pen/ayHmz?editors=001
window.onload = function() {
    D3AudioVisualizer.init();
};
var D3AudioVisualizer = (function(window, document, undefined) {
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

    var audioCtx, sourceNode, audioElement, analyser,
        WIDTH = window.screen.width,
        HEIGHT = window.screen.height,
        COLORS = ['#69D2E7', '#1B676B', '#BEF202', '#EBE54D', '#00CDAC', '#1693A5', '#F9D423', '#FF4E50', '#E7204E', '#0CCABA', '#FF006F'];
        //COLORS = ['#FF006F'];


    function init() {
        audioElement = document.getElementById('audio');
        try {
            audioCtx = new AudioContext();
        } catch (e) {
            console.log(e);
        }
        //http://stackoverflow.com/questions/18215349/web-audio-api-mediaelementsource-node-and-soundcloud-not-working-with-effects
        sourceNode = audioCtx.createMediaElementSource(audioElement);
        analyser = audioCtx.createAnalyser();
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);
        sourceNode.mediaElement.play();

        draw(analyser);
    }

    function draw(analyser) {
        var container = document.getElementById('container');
        var chart = d3.select('#container').append('svg').attr('width', WIDTH).attr('height', HEIGHT);
        var circles = chart.append('g').classed('circles', true);

        var animation = function() {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var data = Array.prototype.slice.call(array, 0).filter(function(v, i, a) {
                return !(i % 50);
            });
            refresh(data, circles);
            requestAnimationFrame(animation);
        };
        requestAnimationFrame(animation);
    }

    function refresh(data, circles) {
        var binding = circles.selectAll('circle').data(data, function(d) {
            return d;
        }),
            existing = binding,
            entering = binding.enter(),
            exiting = binding.exit(),
            y = Math.random() * HEIGHT,
            x = Math.random() * WIDTH;

        // Update any existing elements
        existing.transition().attr('r', function(d) {
            return d;
        });
        // render new elements
        entering.append("circle")
            .classed("circle", true)
            .style("fill", COLORS[Math.floor(Math.random()*(COLORS.length))])
            .attr("r", function(d){
                return 1+d/100;
            })
            .attr("cy", function(d){
                return HEIGHT-300-d;
            })
            .attr("cx", function(d){
                return WIDTH/2;
            });

        // grey out exiting elements
        exiting.remove();
    }
    return {
        init: init
    };
})(window, document);