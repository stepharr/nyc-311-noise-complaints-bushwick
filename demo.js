// Demo version with sample data

// Sample data representing typical noise complaints in Bushwick
const SAMPLE_DATA = [
    {
        complaint_type: "Noise - Residential",
        descriptor: "Loud Music/Party",
        created_date: "2025-11-15T22:30:00.000",
        incident_address: "123 BUSHWICK AVE",
        city: "BROOKLYN",
        incident_zip: "11206"
    },
    {
        complaint_type: "Noise - Street/Sidewalk",
        descriptor: "Loud Talking",
        created_date: "2025-11-14T01:15:00.000",
        incident_address: "456 KNICKERBOCKER AVE",
        city: "BROOKLYN",
        incident_zip: "11237"
    },
    {
        complaint_type: "Noise - Vehicle",
        descriptor: "Car/Truck Music",
        created_date: "2025-11-13T03:45:00.000",
        incident_address: "789 MYRTLE AVE",
        city: "BROOKLYN",
        incident_zip: "11221"
    },
    {
        complaint_type: "Noise - Commercial",
        descriptor: "Loud Music/Party",
        created_date: "2025-11-12T23:00:00.000",
        incident_address: "321 BROADWAY",
        city: "BROOKLYN",
        incident_zip: "11206"
    },
    {
        complaint_type: "Noise - Residential",
        descriptor: "Banging/Pounding",
        created_date: "2025-11-11T02:30:00.000",
        incident_address: "654 WILSON AVE",
        city: "BROOKLYN",
        incident_zip: "11237"
    },
    {
        complaint_type: "Noise - Street/Sidewalk",
        descriptor: "Loud Music/Party",
        created_date: "2025-11-10T21:00:00.000",
        incident_address: "987 FLUSHING AVE",
        city: "BROOKLYN",
        incident_zip: "11206"
    },
    {
        complaint_type: "Noise - Residential",
        descriptor: "Loud Television",
        created_date: "2025-11-09T00:45:00.000",
        incident_address: "147 TROUTMAN ST",
        city: "BROOKLYN",
        incident_zip: "11237"
    },
    {
        complaint_type: "Noise - Vehicle",
        descriptor: "Engine Idling",
        created_date: "2025-11-08T06:30:00.000",
        incident_address: "258 STOCKHOLM ST",
        city: "BROOKLYN",
        incident_zip: "11221"
    },
    {
        complaint_type: "Noise - Commercial",
        descriptor: "Loud Music/Party",
        created_date: "2025-11-07T22:15:00.000",
        incident_address: "369 GRAND ST",
        city: "BROOKLYN",
        incident_zip: "11206"
    },
    {
        complaint_type: "Noise - Residential",
        descriptor: "Loud Music/Party",
        created_date: "2025-11-06T23:45:00.000",
        incident_address: "741 DEKALB AVE",
        city: "BROOKLYN",
        incident_zip: "11221"
    },
    {
        complaint_type: "Noise - Construction",
        descriptor: "Construction Before/After Hours",
        created_date: "2025-11-05T07:00:00.000",
        incident_address: "852 WYCKOFF AVE",
        city: "BROOKLYN",
        incident_zip: "11237"
    },
    {
        complaint_type: "Noise - Residential",
        descriptor: "Loud Talking",
        created_date: "2025-11-04T01:30:00.000",
        incident_address: "963 MENAHAN ST",
        city: "BROOKLYN",
        incident_zip: "11206"
    },
    {
        complaint_type: "Noise - Street/Sidewalk",
        descriptor: "Loud Music/Party",
        created_date: "2025-11-03T20:00:00.000",
        incident_address: "159 STARR ST",
        city: "BROOKLYN",
        incident_zip: "11237"
    },
    {
        complaint_type: "Noise - Commercial",
        descriptor: "Loud Music/Party",
        created_date: "2025-11-02T22:30:00.000",
        incident_address: "357 SCHOLES ST",
        city: "BROOKLYN",
        incident_zip: "11206"
    },
    {
        complaint_type: "Noise - Residential",
        descriptor: "Loud Music/Party",
        created_date: "2025-11-01T23:15:00.000",
        incident_address: "486 MCKIBBIN ST",
        city: "BROOKLYN",
        incident_zip: "11206"
    }
];

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
    
    // Simulate API delay
    setTimeout(() => {
        try {
            const complaints = filterComplaintsByDateRange(SAMPLE_DATA, startDate, endDate);
            displayResults(complaints, startDate, endDate);
        } catch (error) {
            console.error('Error processing complaints:', error);
            showError('Failed to process data. Error: ' + error.message);
        } finally {
            hideLoading();
        }
    }, 500);
}

function filterComplaintsByDateRange(complaints, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate + 'T23:59:59');
    
    return complaints.filter(complaint => {
        const complaintDate = new Date(complaint.created_date);
        return complaintDate >= start && complaintDate <= end;
    });
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
