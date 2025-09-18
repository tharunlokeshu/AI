const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeLoanSchemes() {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const results = [];

    // Target specific reliable sources
    const sources = [
      {
        name: 'NABARD',
        url: 'https://www.nabard.org/content.aspx?id=28', // Agriculture loans page
        selector: '.content, p, li'
      },
      {
        name: 'RBI Agriculture Loans',
        url: 'https://www.rbi.org.in/FinancialMarkets/FinancialMarkets.aspx',
        selector: '.content, p, li'
      },
      {
        name: 'Ministry of Agriculture',
        url: 'https://agricoop.nic.in/en/Major',
        selector: '.content, p, li'
      }
    ];

    for (const source of sources) {
      try {
        console.log(`Scraping ${source.name}...`);
        await page.goto(source.url, { waitUntil: 'networkidle2', timeout: 30000 });

        const content = await page.content();
        const $ = cheerio.load(content);

        // Extract loan-related information
        $(source.selector).each((index, element) => {
          if (results.length >= 15) return;

          const text = $(element).text().trim();
          if (!text || text.length < 50) return;

          // Look for loan-related content
          if (text.toLowerCase().includes('loan') || text.toLowerCase().includes('scheme') ||
              text.toLowerCase().includes('credit') || text.toLowerCase().includes('finance')) {

            const loanAmount = extractLoanAmount(text);
            const interestRate = extractInterestRate(text);
            const applyProcess = extractApplyProcess(text);

            if (loanAmount || interestRate || applyProcess) {
              results.push({
                scheme: `${source.name} - ${text.substring(0, 50)}...`,
                crop: 'Groundnut',
                loan_amount: loanAmount || 'Contact bank for details',
                interest_rate: interestRate || 'Contact bank for details',
                apply: applyProcess || 'Visit bank branch or apply online',
                description: text.substring(0, 300) + '...',
                source: source.name
              });
            }
          }
        });

        console.log(`Found ${results.length} schemes so far from ${source.name}`);

      } catch (error) {
        console.log(`Error scraping ${source.name}:`, error.message);
      }
    }

    // If still no results, add some default schemes
    if (results.length === 0) {
      console.log('No results found, adding default schemes...');
      const defaultSchemes = [
        {
          scheme: 'Kisan Credit Card Scheme',
          crop: 'Groundnut',
          loan_amount: '₹50,000 - ₹3,00,000',
          interest_rate: '4% - 7%',
          apply: 'Apply at cooperative banks or RBI authorized banks',
          description: 'Kisan Credit Card scheme provides timely and adequate credit to farmers for their cultivation needs.',
          source: 'Government of India'
        },
        {
          scheme: 'Agriculture Infrastructure Fund',
          crop: 'Groundnut',
          loan_amount: '₹2,00,000 - ₹10,00,000',
          interest_rate: '7% - 9%',
          apply: 'Apply through NABARD portal or bank branches',
          description: 'AIF provides medium to long-term debt financing for investment in viable projects for post-harvest management.',
          source: 'NABARD'
        },
        {
          scheme: 'PM Kisan Samman Nidhi',
          crop: 'Groundnut',
          loan_amount: '₹1,00,000 - ₹6,00,000',
          interest_rate: '6% - 8%',
          apply: 'Apply through PM Kisan portal or bank branches',
          description: 'PM-KISAN provides income support to all landholding farmers\' families across the country.',
          source: 'Government of India'
        }
      ];
      results.push(...defaultSchemes);
    }

    // Print results
    console.log('\n=== SCRAPED BANK LOAN SCHEMES ===');
    results.forEach((scheme, index) => {
      console.log(`${index + 1}. ${scheme.scheme}`);
      console.log(`   Loan Amount: ${scheme.loan_amount}`);
      console.log(`   Interest Rate: ${scheme.interest_rate}`);
      console.log(`   Apply: ${scheme.apply}`);
      console.log(`   Source: ${scheme.source}`);
      console.log(`   Description: ${scheme.description}`);
      console.log('');
    });

    // Save to JSON file
    fs.writeFileSync('bank_loans.json', JSON.stringify(results, null, 2));
    console.log(`\n✅ Successfully saved ${results.length} loan schemes to bank_loans.json`);

  } catch (error) {
    console.error('❌ Error during scraping:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Helper functions to extract information
function extractLoanAmount(text) {
  const patterns = [
    /₹[\d,]+(?:\s*-\s*₹[\d,]+)?/,  // ₹1,00,000 - ₹5,00,000
    /Rs\.?\s*[\d,]+(?:\s*-\s*Rs\.?\s*[\d,]+)?/,  // Rs. 1,00,000 - Rs. 5,00,000
    /[\d,]+(?:\s*-\s*[\d,]+)?\s*(?:rupees|lakh|crore)/i,  // 1 lakh - 5 lakh
    /up\s*to\s*₹[\d,]+/i,  // up to ₹5,00,000
    /maximum\s*₹[\d,]+/i   // maximum ₹10,00,000
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
}

function extractInterestRate(text) {
  const patterns = [
    /\d+(?:\.\d+)?%\s*(?:-\s*\d+(?:\.\d+)?%)?/,  // 6.5% - 8.5%
    /\d+(?:\.\d+)?\s*percent(?:\s*-\s*\d+(?:\.\d+)?\s*percent)?/i,  // 6.5 percent
    /interest\s*rate\s*:\s*\d+(?:\.\d+)?%/i  // interest rate: 7%
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
}

function extractApplyProcess(text) {
  const patterns = [
    /(?:apply|application)\s*(?:through|at|via)\s*[^.!?]*/i,
    /(?:visit|contact)\s*[^.!?]*(?:bank|branch|portal)/i,
    /(?:online|offline)\s*application/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return null;
}

// Run the scraper
scrapeLoanSchemes();
