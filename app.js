// NYC 311 API endpoint for Service Requests
const API_BASE_URL = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json';

// Bushwick neighborhood boundaries (approximate)
// Bushwick is generally bounded by Flushing Ave (north), Broadway (south), 
// Wyckoff Ave (east), and roughly the BQE/Bushwick Ave (west)
const BUSHWICK_ZIP_CODES = ['11206', '11221', '11237'];

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    endDateInput.value = today.toISOString().split('T')[0];
    startDateInput.value = thirtyDaysAgo.toISOString().split('T')[0];
    
    form.addEventListener('submit', handleFormSubmit);
});

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
        showError('Start date must be before end date');
        return;
    }
    
    // Clear previous results
    hideError();
    hideResults();
    showLoading();
    
    try {
        const complaints = await fetchNoiseComplaints(startDate, endDate);
        displayResults(complaints, startDate, endDate);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        showError('Failed to fetch data. Please try again. Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function fetchNoiseComplaints(startDate, endDate) {
    // Format dates for API (ISO 8601 format)
    const startDateTime = new Date(startDate).toISOString();
    const endDateTime = new Date(endDate + 'T23:59:59').toISOString();
    
    // Build query for noise complaints in Bushwick
    // Filter by:
    // 1. Complaint type contains "Noise"
    // 2. Zip codes in Bushwick area
    // 3. Date range
    const whereClause = `complaint_type LIKE '%Noise%' AND incident_zip IN (${BUSHWICK_ZIP_CODES.map(zip => `'${zip}'`).join(',')}) AND created_date >= '${startDateTime}' AND created_date <= '${endDateTime}'`;
    
    const params = new URLSearchParams({
        '$where': whereClause,
        '$limit': 10000, // Increase limit to get more results
        '$order': 'created_date DESC'
    });
    
    const url = `${API_BASE_URL}?${params.toString()}`;
    
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Received complaints:', data.length);
    
    return data;
}

function displayResults(complaints, startDate, endDate) {
    const resultsDiv = document.getElementById('results');
    const totalCountEl = document.getElementById('totalCount');
    const dateRangeEl = document.getElementById('dateRange');
    const complaintsListEl = document.getElementById('complaintsList');
    
    // Display total count
    totalCountEl.textContent = complaints.length;
    
    // Format and display date range
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    dateRangeEl.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    
    // Display up to 10 recent complaints
    complaintsListEl.innerHTML = '';
    const displayComplaints = complaints.slice(0, 10);
    
    if (displayComplaints.length === 0) {
        complaintsListEl.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No complaints found for this date range.</p>';
    } else {
        displayComplaints.forEach(complaint => {
            const item = document.createElement('div');
            item.className = 'complaint-item';
            
            const complaintType = complaint.complaint_type || 'N/A';
            const descriptor = complaint.descriptor || 'No description';
            const createdDate = complaint.created_date ? new Date(complaint.created_date).toLocaleString() : 'N/A';
            const location = [
                complaint.incident_address,
                complaint.city,
                complaint.incident_zip
            ].filter(Boolean).join(', ') || 'Location not specified';
            
            item.innerHTML = `
                <div class="complaint-type">${complaintType}</div>
                <div class="complaint-descriptor">${descriptor}</div>
                <div class="complaint-date">Reported: ${createdDate}</div>
                <div class="complaint-location">📍 ${location}</div>
            `;
            
            complaintsListEl.appendChild(item);
        });
        
        if (complaints.length > 10) {
            const moreInfo = document.createElement('p');
            moreInfo.style.cssText = 'color: #666; text-align: center; padding: 20px; font-style: italic;';
            moreInfo.textContent = `Showing 10 of ${complaints.length} complaints`;
            complaintsListEl.appendChild(moreInfo);
        }
    }
    
    showResults();
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('searchButton').disabled = true;
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('searchButton').disabled = false;
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

function showResults() {
    document.getElementById('results').style.display = 'block';
}

function hideResults() {
    document.getElementById('results').style.display = 'none';
}
