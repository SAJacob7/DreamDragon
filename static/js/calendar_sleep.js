// DOM Elements
const calendar = document.getElementById('calendar');
const monthYearDisplay = document.getElementById('monthYearDisplay');
const modal = document.getElementById('inputModal');
const selectedDateSpan = document.getElementById('selectedDate');

// Calendar state
let selectedDate = null;
let selectedDay = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let sleepData = {};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

let sleepDataCache = {}; // Caches data for all months loaded

async function loadSleepData() {
  const month = currentMonth + 1; // JavaScript months are 0-indexed
  const cacheKey = `${currentYear}-${month}`;
  
  // Use cached data if available
  if (sleepDataCache[cacheKey]) {
    sleepData = sleepDataCache[cacheKey];
    renderCalendar();
    return;
  }

  // Otherwise, fetch data and cache it
  try {
    const response = await fetch(`/api/sleep/${currentYear}/${month}`);
    const result = await response.json();
    
    if (result.status === "success") {
      sleepData = result.data;
      sleepDataCache[cacheKey] = sleepData; // Cache the data
      renderCalendar();
    }
  } catch (error) {
    console.error("Error loading sleep data:", error);
  }
}


// Render the calendar
function renderCalendar() {
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  monthYearDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
  const calendarBody = document.getElementById('calendarBody');
  
  calendarBody.innerHTML = ''; // Clear previous content
  let row = document.createElement('tr');

  // Add blank cells for days before the first of the month
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement('td'));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('td');
    cell.textContent = day;

    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (sleepData[dateKey]) {
      cell.classList.add('logged');
      const sleepAmount = document.createElement('div');
      sleepAmount.className = 'sleepAmount';
      sleepAmount.textContent = `${sleepData[dateKey]} hrs`;
      cell.appendChild(sleepAmount);
      cell.onclick = () => editDay(cell, day, currentMonth, currentYear, sleepData[dateKey]);
    } else {
      cell.onclick = () => selectDay(cell, day, currentMonth, currentYear);
    }

    row.appendChild(cell);

    // Start a new row after Saturday
    if ((day + firstDay) % 7 === 0 || day === daysInMonth) {
      calendarBody.appendChild(row);
      row = document.createElement('tr');
    }
  }
}


// Change month and reload data
async function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  await loadSleepData();
}

// Select a day
function selectDay(dayElement, day, month, year) {
  if (selectedDay) selectedDay.classList.remove('selected');
  dayElement.classList.add('selected');
  selectedDay = dayElement;
  selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  selectedDateSpan.textContent = selectedDate;
  document.getElementById('sleepHours').value = '';
  modal.style.display = 'block';
}

// Edit a logged day
function editDay(dayElement, day, month, year, existingSleepHours) {
  selectDay(dayElement, day, month, year);
  document.getElementById('sleepHours').value = existingSleepHours;
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
  selectedDate = null;
}

// Save sleep data to server
async function saveSleepData() {
    const sleepHours = document.getElementById('sleepHours').value;
    if (!sleepHours || isNaN(sleepHours)) {
      alert('Please enter a valid number of hours.');
      return;
    }
  
    try {
      const response = await fetch('/api/sleep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          hours: parseFloat(sleepHours)
        })
      });
  
      const result = await response.json();
      
      if (result.status === "success") {
        sleepData[selectedDate] = parseFloat(sleepHours); // Update local sleepData
        const [year, month] = selectedDate.split('-').slice(0, 2);
        const cacheKey = `${year}-${parseInt(month)}`;
        sleepDataCache[cacheKey] = { ...sleepData }; // Update cached data
        renderCalendar();
        closeModal();
      } else {
        alert('Error saving data: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to connect to server: ' + error.message);
    }
  }
  

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', loadSleepData);

(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="kUtn8HvBHBin4UHAbwN4I";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();