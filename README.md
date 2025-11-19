# NYC 311 Noise Complaints - Bushwick

A simple web application to search and display noise complaints from NYC's 311 service in the Bushwick neighborhood.

## Features

- Search noise complaints by date range
- Filter results specifically for Bushwick neighborhood (zip codes: 11206, 11221, 11237)
- Display total complaint count
- View recent complaint details including type, description, location, and date

## Usage

Simply open `index.html` in a web browser. The application will:

1. Display a form with start and end date inputs (defaults to last 30 days)
2. Click "Search Complaints" to fetch data
3. View results showing:
   - Total number of complaints in the selected date range
   - Up to 10 most recent complaints with details

## Data Source

Data is pulled from the [NYC Open Data 311 Service Requests API](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9).

## Local Development

No build process or dependencies required. Just open `index.html` in your browser.

For local testing with a simple server:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `app.js` - JavaScript logic for API calls and UI updates