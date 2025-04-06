const canvas = document.getElementById('cloudCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const yPositions = [20, 70, 120]
const cloudImagePaths = ['../static/images/cloud1.png', '../static/images/cloud2.png'];
const cloudImages = [];
const clouds = [];
const activeY = new Set();


let upgrade_animiation = false;


// Load images
async function loadImages(paths, callback) {
   let loaded = 0;
   for (let path of paths) {
       const img = new Image();
       img.src = path;
       img.onload = () => {
           cloudImages.push(img);
           loaded++;
           if (loaded === paths.length) callback();
       };
       img.onerror = () => console.error(`Failed to load ${path}`);
   }
}


// Initial clouds spread across screen
function createInitialClouds() {
   const usedY = [...yPositions];
   for (let y of usedY) {
       const img = cloudImages[Math.floor(Math.random() * cloudImages.length)];
       const x = Math.random() * canvas.width; // anywhere on screen
       clouds.push({
           x: x,
           y: y,
           speed: 0.5 + Math.random() * 0.5,
           image: img
       });
       activeY.add(y); // mark Y lane as used
   }
}


// Spawn a new cloud from the left
function spawnCloud() {
   const availableY = yPositions.filter(y => !activeY.has(y));
   if (availableY.length === 0) return;


   const y = availableY[Math.floor(Math.random() * availableY.length)];
   const img = cloudImages[Math.floor(Math.random() * cloudImages.length)];


   clouds.push({
       x: -150,
       y: y,
       speed: 0.5 + Math.random() * 0.5,
       image: img
   });


   activeY.add(y);
}


// Drawing
function drawClouds() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);


   for (let i = clouds.length - 1; i >= 0; i--) {
       const cloud = clouds[i];
       ctx.drawImage(cloud.image, cloud.x, cloud.y, 300, 300);
       cloud.x += cloud.speed;


       // If offscreen to the right
       if (cloud.x > canvas.width + 300) {
           activeY.delete(cloud.y); // free up that lane
           clouds.splice(i, 1); // remove cloud
       }
   }
}


// Animation loop
function animate() {
   drawClouds();
   requestAnimationFrame(animate);
}


function hideImage() {
   document.getElementById('egg').style.display = 'none';
}


// Start it all
loadImages(cloudImagePaths, () => {
   createInitialClouds();      
   animate();
   setInterval(spawnCloud, 3000);
});


// Resize support
window.addEventListener('resize', () => {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
});


// Image click-through logic
let currentIndex = 0;
const imageCount = 6;
const images = [];


// Collect image elements by ID (img1 to img6)
for (let i = 1; i <= imageCount; i++) {
   images.push(document.getElementById(`img${i}`));
}


function showImage(index, clickable) {
   images.forEach((img, i) => {
       img.style.display = i === index ? 'block' : 'none';
       img.onclick = null;
   });


   if (clickable) {
       images[index].onclick = async() => {
           console.log("clickable");
           showImage(currentIndex + 1, false);
       }
   }
}


async function fetchDragon() {
   try {
       const response1 = await fetch('/api/dragon_level');
       const data1 = await response1.json();
       current_level = data1.level;
       console.log(current_level);


       const response2 = await fetch('/api/upgrade_dragon');
       const data2 = await response2.json();
       upgrade_status = data2.status;
       console.log(upgrade_status);


       if (upgrade_status) {
           currentIndex = current_level - 1;
           showImage(currentIndex, true);
       }


       else {
           currentIndex = current_level;
           showImage(currentIndex, false);
       }
   }
   catch(err) {
       console.error('Error fetching dragon:', err);
   }
}


// // Set up click events for each image
// images.forEach((img, i) => {
//     img.addEventListener('click', () => {
//         attemptUpgrade(i);
//     });
// });


// Show the first image on page load
window.addEventListener("load", () => {
   console.log("Page loading");
   fetchDragon();
});
