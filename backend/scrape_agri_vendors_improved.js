import puppeteer from 'puppeteer';

// Deduplicate vendors by name + address
function deduplicateVendors(vendors) {
  const seen = new Set();
  const deduped = [];
  for (const v of vendors) {
    const key = (v.name + v.address).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(v);
    }
  }
  return deduped;
}

// Format vendors as plain text table
function formatVendorsTable(location, vendors) {
  const header = `Agricultural Vendors in ${location}\n\n| ID | Name | Type | Latitude | Longitude | Address | Phone | Website | GST/ID | Source URL |\n|----|------|------|----------|-----------|---------|-------|---------|--------|-----------|`;
  const rows = vendors.map((v, i) => {
    return `| ${i + 1} | ${v.name} | ${v.type} | ${v.lat?.toFixed(5) || ''} | ${v.lon?.toFixed(5) || ''} | ${v.address} | ${v.phone} | ${v.website} | ${v.gst_id || ''} | ${v.source_url || ''} |`;
  });
  return `${header}\n${rows.join('\n')}\n\n✅ ${vendors.length} agricultural vendors found in ${location}.`;
}

// Main function to scrape agricultural vendors from Google Maps and JustDial only
async function scrapeAgriVendors(location, search_radius_meters = 2000, max_results = 200) {
  // Google Maps scraping function
  async function scrapeGoogleMaps(location) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const vendors = [];

    try {
      const searchQuery = `agricultural vendors in ${location}`;
      await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`, { waitUntil: 'networkidle2' });

      // Wait for any of the possible result selectors
      await page.waitForFunction(
        () => {
          return document.querySelector('[role="article"]') ||
                 document.querySelector('.section-result') ||
                 document.querySelector('.hfpxzc') ||
                 document.querySelector('.Nv2PK');
        },
        { timeout: 15000 }
      );

      const results = await page.$$('[role="article"], .section-result, .hfpxzc, .Nv2PK');
      for (let i = 0; i < Math.min(results.length, 10); i++) {
        const result = results[i];

        // Try multiple selectors for name
        let name = 'Unknown';
        try {
          name = await result.$eval('h3, .section-result-title, .fontHeadlineSmall, .qBF1Pd, [role="heading"]', el => el.textContent.trim()) ||
                 await result.$eval('.fontHeadlineSmall, .qBF1Pd', el => el.textContent.trim()) ||
                 'Unknown';
        } catch (e) {
          name = 'Unknown';
        }

        // Extract full details and parse them
        let fullDetails = '';
        try {
          fullDetails = await result.$eval('.section-result-details, .fontBodyMedium, .hfpxzc', el => el.textContent.trim()) ||
                       await result.$eval('.fontBodyMedium', el => el.textContent.trim()) ||
                       '';
        } catch (e) {
          fullDetails = '';
        }

        // Parse address and phone from details
        let address = 'N/A';
        let phone = '';

        if (fullDetails) {
          // Extract phone number (patterns like 099482 74748, +91-9876543210, etc.)
          const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10}|\d{4}[-.\s]\d{6}|\d{3}[-.\s]\d{7}|\d{5}[-.\s]\d{5}|\d{4}[-.\s]\d{3}[-.\s]\d{3}|\d{3}[-.\s]\d{3}[-.\s]\d{4}|\d{2}[-.\s]\d{8}|\d{1}[-.\s]\d{9}|\d{10,12}/g;
          const phoneMatches = fullDetails.match(phoneRegex);
          if (phoneMatches) {
            phone = phoneMatches.join(', ');
            // Remove phone from address and clean up
            address = fullDetails.replace(phoneRegex, '').replace(/\s+/g, ' ').trim();
            // Remove common separators and clean up
            address = address.replace(/·/g, '').replace(/\s*\.\s*/g, ', ').trim();
          } else {
            address = fullDetails.replace(/\s+/g, ' ').trim();
          }
        }

        // Try multiple selectors for website
        let website = '';
        try {
          website = await result.$eval('a[href^="http"], [data-item-id*="website"]', el => el.href) ||
                   await result.$eval('[aria-label*="website"]', el => el.textContent.trim()) ||
                   '';
        } catch (e) {
          website = '';
        }

        vendors.push({
          id: `gm_${i}`,
          name,
          type: 'Agricultural Vendor',
          lat: null,
          lon: null,
          address,
          phone,
          website,
          gst_id: '',
          source_url: `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`
        });
      }
    } catch (error) {
      console.error('Error scraping Google Maps:', error.message);
    } finally {
      await browser.close();
    }

    return vendors;
  }

  // JustDial scraping function
  async function scrapeJustDial(location) {
    const browser = await puppeteer.launch({ headless: true });
    const vendors = [];

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      const searchQuery = `agricultural vendors ${location}`;
      const url = `https://www.justdial.com/${location}/Agricultural-Equipment-Dealers`;
      await page.goto(url, { waitUntil: 'networkidle2' });

      await new Promise(resolve => setTimeout(resolve, 3000));

      const results = await page.$$('.resultbox');
      for (let i = 0; i < Math.min(results.length, 10); i++) {
        const result = results[i];

        // Try multiple selectors for name
        let name = 'Unknown';
        try {
          name = await result.$eval('.resultbox_title_anchor, .store-name, .business-name', el => el.textContent.trim()) ||
                 await result.$eval('.resultbox_title_anchor', el => el.textContent.trim()) ||
                 'Unknown';
        } catch (e) {
          name = 'Unknown';
        }

        // Try multiple selectors for address
        let address = 'N/A';
        try {
          address = await result.$eval('.resultbox_address, .address, .location', el => el.textContent.trim()) ||
                   await result.$eval('.resultbox_address', el => el.textContent.trim()) ||
                   'N/A';
        } catch (e) {
          address = 'N/A';
        }

        // Try multiple selectors for phone
        let phone = '';
        try {
          phone = await result.$eval('.callnow, .phone, .contact-number, [data-phone]', el => el.textContent.trim()) ||
                 await result.$eval('.callnow', el => el.textContent.trim()) ||
                 '';
        } catch (e) {
          phone = '';
        }

        // Try multiple selectors for website
        let website = '';
        try {
          website = await result.$eval('.resultbox_website a, .website-link, [href^="http"]', el => el.href) ||
                   await result.$eval('.resultbox_website a', el => el.href) ||
                   '';
        } catch (e) {
          website = '';
        }

        vendors.push({
          id: `jd_${i}`,
          name,
          type: 'Agricultural Vendor',
          lat: null,
          lon: null,
          address,
          phone,
          website,
          gst_id: '',
          source_url: url
        });
      }
    } catch (error) {
      console.error('Error scraping JustDial:', error.message);
    } finally {
      await browser.close();
    }

    return vendors;
  }

  try {
    // Scrape from Google Maps and JustDial only
    console.log('Starting Google Maps scraping...');
    const googleVendors = await scrapeGoogleMaps(location);
    console.log(`Google Maps vendors found: ${googleVendors.length}`);

    console.log('Starting JustDial scraping...');
    const justDialVendors = await scrapeJustDial(location);
    console.log(`JustDial vendors found: ${justDialVendors.length}`);

    // Aggregate vendors from only these two sources
    let vendors = googleVendors.concat(justDialVendors);

    // Deduplicate and limit results
    vendors = deduplicateVendors(vendors).slice(0, max_results);
    console.log(`After deduplication and limit: ${vendors.length}`);

    // Format and print table
    const table = formatVendorsTable(location, vendors);
    console.log(table);

    // Save to file
    const fs = await import('fs');
    const filename = `agri_vendors_${location.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    fs.writeFileSync(filename, table);
    console.log(`\nResults saved to ${filename}`);

    return table;

  } catch (error) {
    console.error('Error scraping agricultural vendors:', error.message);
    return null;
  }
}

// If run as script, accept command line args
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const location = args[0] || 'Amalapuram, India';
  const radius = parseInt(args[1], 10) || 2000;
  const maxResults = parseInt(args[2], 10) || 200;
  scrapeAgriVendors(location, radius, maxResults);
}

export { scrapeAgriVendors };
