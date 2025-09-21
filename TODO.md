# Fix Investment and Profit Data in PDF Generation

## Issue
Investment and profit data is not appearing in the crop analysis PDF report. The issue is in the `/api/crop-analysis` endpoint where AI-generated investment/profit data is not being properly parsed and included in the PDF.

## Plan

### 1. Fix AI Response Parsing (`backend/server.js`)
- [ ] Improve the `callGeminiAPI` function to handle JSON parsing failures more robustly
- [ ] Add better error handling and fallback logic for investment/profit data
- [ ] Ensure consistent JSON structure from AI responses

### 2. Enhance Investment/Profit Data Generation
- [ ] Create a more robust prompt structure for the AI to ensure consistent JSON responses
- [ ] Add validation to check if the AI response contains the expected data structure
- [ ] Implement proper fallback values when AI data is unavailable

### 3. Improve Error Handling
- [ ] Add better error handling for AI API calls
- [ ] Ensure graceful degradation when AI services are unavailable
- [ ] Add logging for debugging purposes

### 4. Testing
- [ ] Test the crop analysis PDF generation with sample data
- [ ] Verify investment and profit data appears correctly in PDF
- [ ] Test error scenarios and fallback behavior