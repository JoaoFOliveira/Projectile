/**
 * Projectile 
 *
 * @author João Fontes Oliveira <@Joao_Oliveira>
 * @January 2015
 *
 */
'use strict';

(function() {

    // Initialize canvas info
    var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width = canvas.width = document.body.clientWidth,
    height = canvas.height = document.body.clientHeight,
    radius = 10,

    // Initialize projectile info
    coordinates = [0,0],
    velocity = [0,0],
    acceleration = [0,0],
    gravity = 9.8,
    mass = 10,
    forces = [[0, gravity*mass, false]],
    bounce_factor = 0.8,
    color = '#000',

    // Initialize timings info
    refresh_rate = 0.01,
    start = 0,
    timer = null;

    // Draw projectile on canvas
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        ctx.beginPath();
        ctx.arc(coordinates[0], coordinates[1], radius, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    // Apply physics
    function physics(delta) {
      var new_location = [0,0];
      var new_forces = [];
      for (var i=0; i<forces.length; i++) {
        var f = forces[i];
        
        if (f[2] !== false) { f[2] -= delta; }  // Thrust forces applying
        if (f[2] < 0) { continue; }             // Gravity applying

        new_location[0] += f[0];
        new_location[1] += f[1];
        
        new_forces.push(f);
      }

      forces = new_forces;
      return new_location;
    }

    // Calculate movement
    function calculate(delta, new_location) {
        coordinates = [coordinates[0] + velocity[0]*delta + 0.5*acceleration[0]*delta*delta, coordinates[1] + velocity[1]*delta + 0.5*acceleration[1]*delta*delta];
        acceleration = [new_location[0]/(mass*delta), new_location[1]/(mass*delta)];
        velocity = [velocity[0] + 0.5* (acceleration[0] + acceleration[0])*delta, velocity[1] + 0.5* (acceleration[1] + acceleration[1])*delta];
    }

    // Handle border collisions
    function handle_collision() {
        // Hits left border, bounce
        if (coordinates[0] <= radius) {
            coordinates[0] = radius;
            velocity[0] *= -bounce_factor;
            velocity[1] *= bounce_factor;
        }

        // Hits right border, bounce
        if (coordinates[0] >= width-radius) {
            coordinates[0] = width-radius;
            velocity[0] *= -bounce_factor;
            velocity[1] *= bounce_factor;
        }

        // Hits top border, bounce
        if (coordinates[1] <= radius) {
            coordinates[1] = radius;
            velocity[0] *= bounce_factor;
            velocity[1] *= -bounce_factor;
        }

        // Hits bottom border, bounce
        if (coordinates[1] > height-radius) {
            coordinates[1] = height-radius;  
            velocity[0] *= bounce_factor;
            velocity[1]*=-bounce_factor;
        }  
    }

    // Move projectile
    function move() {
        var newStart = new Date().getTime();
        var delta = (newStart-start)/1000;
        
        if (delta < refresh_rate) { delta = refresh_rate; }
        start = newStart;

        var new_location = physics(delta);
        calculate(delta, new_location);
        handle_collision();

        draw();
    }

    // Track beggining of movement
    function begin() {
        start = new Date().getTime();
        timer = setInterval(move, refresh_rate*1000);
    }

    // Reset info
    function reset() {
        clearInterval(timer);
        timer = null;
        acceleration = velocity = [0, 0];
    }

    // Generate new projectile with random properties
    function randomizeNew() {
        var posNegX = Math.round(Math.random()) * 2 - 1;
        var posNegY = Math.round(Math.random()) * 2 - 1;
        var vector_x = ((Math.random() * 1000) + 1) * posNegX;
        var vector_y = ((Math.random() * 1000) + 1) * posNegY;
        radius = Math.floor(Math.random() * 41) + 10;                   // radius between 10<->50
        mass = radius/5;                                                // the bigger the heavier, 2<->10
        color = '#'+((1<<24)*Math.random()|0).toString(16);

        forces.push([vector_x, vector_y, 0.05]);                        // thrust applied for .05s
    }

    // Handle clicks
    canvas.onclick=function(e) {
        reset();

        var x = e.layerX !== undefined? e.layerX : e.offsetX;
        var y = e.layerY !== undefined? e.layerY : e.offsetY;
        coordinates = [x,y];

        randomizeNew();
        draw();
        begin();
    };

    // Handle window resize
    window.onresize = function() {
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
    };

})();