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
  const header = `Agricultural Vendors in ${location}\n\n| ID | Name | Type | Latitude | Longitude | Address | Phone | Website | GST/ID |\n|----|------|------|----------|-----------|---------|-------|---------|--------|`;
  const rows = vendors.map((v, i) => {
    return `| ${i + 1} | ${v.name} | ${v.type} | ${v.lat?.toFixed(5) || ''} | ${v.lon?.toFixed(5) || ''} | ${v.address} | ${v.phone} | ${v.website} | ${v.gst_id || ''} |`;
  });
  return `${header}\n${rows.join('\n')}\n\n✅ ${vendors.length} agricultural vendors found in ${location}.`;
}

// Main function to scrape agricultural vendors from Google Maps and JustDial only
async function scrapeAgriVendors(location, search_radius_meters = 2000, max_results = 200) {
  // Google Maps scraping function
  async function scrapeGoogleMaps(location) {
    console.log('🔍 Starting Google Maps scraping for location:', location);
    const browser = await puppeteer.launch({ headless: false }); // Changed to false for debugging
    const page = await browser.newPage();
    const vendors = [];

    try {
      const searchQuery = `agricultural vendors in ${location}`;
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
      console.log('🌐 Navigating to:', searchUrl);

      await page.goto(searchUrl, { waitUntil: 'networkidle2' });

      // Wait for any of the possible result selectors
      console.log('⏳ Waiting for result selectors...');
      await page.waitForFunction(
        () => {
          return document.querySelector('[role="article"]') ||
                 document.querySelector('.section-result') ||
                 document.querySelector('.hfpxzc') ||
                 document.querySelector('.Nv2PK');
        },
        { timeout: 15000 }
      );

      console.log('✅ Found result selectors, extracting results...');
      const results = await page.$$('[role="article"], .section-result, .hfpxzc, .Nv2PK');
      console.log(`📊 Found ${results.length} result elements`);

      for (let i = 0; i < Math.min(results.length, 10); i++) {
        console.log(`\n🔍 Processing result ${i + 1}/${Math.min(results.length, 10)}`);
        const result = results[i];

        // Try multiple selectors for name
        let name = 'Unknown';
        try {
          name = await result.$eval('h3, .section-result-title, .fontHeadlineSmall, .qBF1Pd, [role="heading"]', el => el.textContent.trim()) ||
                 await result.$eval('.fontHeadlineSmall, .qBF1Pd', el => el.textContent.trim()) ||
                 'Unknown';
          console.log(`✅ Name found: "${name}"`);
        } catch (e) {
          console.log(`❌ Name extraction failed:`, e.message);
          name = 'Unknown';
        }

        // Extract full details and parse them
        let fullDetails = '';
        try {
          fullDetails = await result.$eval('.section-result-details, .fontBodyMedium, .hfpxzc', el => el.textContent.trim()) ||
                       await result.$eval('.fontBodyMedium', el => el.textContent.trim()) ||
                       '';
          console.log(`📝 Full details extracted: "${fullDetails}"`);
        } catch (e) {
          console.log(`❌ Full details extraction failed:`, e.message);
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
            console.log(`📞 Phone extracted: "${phone}"`);
            // Remove phone from address and clean up
            address = fullDetails.replace(phoneRegex, '').replace(/\s+/g, ' ').trim();
            // Remove common separators and clean up
            address = address.replace(/·/g, '').replace(/\s*\.\s*/g, ', ').trim();
            console.log(`🏠 Address after phone removal: "${address}"`);
          } else {
            address = fullDetails.replace(/\s+/g, ' ').trim();
            console.log(`🏠 Address (no phone found): "${address}"`);
          }
        }

        // Try multiple selectors for website
        let website = '';
        try {
          website = await result.$eval('a[href^="http"], [data-item-id*="website"]', el => el.href) ||
                   await result.$eval('[aria-label*="website"]', el => el.textContent.trim()) ||
                   '';
          console.log(`🌐 Website found: "${website}"`);
        } catch (e) {
          console.log(`❌ Website extraction failed:`, e.message);
          website = '';
        }

        const vendor = {
          id: `gm_${i}`,
          name,
          type: 'Agricultural Vendor',
          lat: null,
          lon: null,
          address,
          phone,
          website,
          gst_id: '',
          source_url: searchUrl
        };

        console.log(`✅ Vendor ${i + 1} data:`, vendor);
        vendors.push(vendor);
      }

      console.log(`🎯 Google Maps scraping completed. Found ${vendors.length} vendors.`);
    } catch (error) {
      console.error('❌ Error scraping Google Maps:', error.message);
    } finally {
      await browser.close();
    }

    return vendors;
  }

  // JustDial scraping function
  async function scrapeJustDial(location) {
    console.log('🔍 Starting JustDial scraping for location:', location);
    const browser = await puppeteer.launch({ headless: false }); // Changed to false for debugging
    const vendors = [];

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      const searchQuery = `agricultural vendors ${location}`;
      const url = `https://www.justdial.com/${location}/Agricultural-Equipment-Dealers`;
      console.log('🌐 Navigating to:', url);

      await page.goto(url, { waitUntil: 'networkidle2' });

      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('⏳ Looking for result boxes...');
      const results = await page.$$('.resultbox');
      console.log(`📊 Found ${results.length} result boxes`);

      for (let i = 0; i < Math.min(results.length, 10); i++) {
        console.log(`\n🔍 Processing JustDial result ${i + 1}/${Math.min(results.length, 10)}`);
        const result = results[i];

        // Try multiple selectors for name
        let name = 'Unknown';
        try {
          name = await result.$eval('.resultbox_title_anchor, .store-name, .business-name', el => el.textContent.trim()) ||
                 await result.$eval('.resultbox_title_anchor', el => el.textContent.trim()) ||
                 'Unknown';
          console.log(`✅ JustDial Name found: "${name}"`);
        } catch (e) {
          console.log(`❌ JustDial Name extraction failed:`, e.message);
          name = 'Unknown';
        }

        // Try multiple selectors for address
        let address = 'N/A';
        try {
          address = await result.$eval('.resultbox_address, .address, .location', el => el.textContent.trim()) ||
                   await result.$eval('.resultbox_address', el => el.textContent.trim()) ||
                   'N/A';
          console.log(`🏠 JustDial Address found: "${address}"`);
        } catch (e) {
          console.log(`❌ JustDial Address extraction failed:`, e.message);
          address = 'N/A';
        }

        // Try multiple selectors for phone
        let phone = '';
        try {
          phone = await result.$eval('.callnow, .phone, .contact-number, [data-phone]', el => el.textContent.trim()) ||
                 await result.$eval('.callnow', el => el.textContent.trim()) ||
                 '';
          console.log(`📞 JustDial Phone found: "${phone}"`);
        } catch (e) {
          console.log(`❌ JustDial Phone extraction failed:`, e.message);
          phone = '';
        }

        // Try multiple selectors for website
        let website = '';
        try {
          website = await result.$eval('.resultbox_website a, .website-link, [href^="http"]', el => el.href) ||
                   await result.$eval('.resultbox_website a', el => el.href) ||
                   '';
          console.log(`🌐 JustDial Website found: "${website}"`);
        } catch (e) {
          console.log(`❌ JustDial Website extraction failed:`, e.message);
          website = '';
        }

        const vendor = {
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
        };

        console.log(`✅ JustDial Vendor ${i + 1} data:`, vendor);
        vendors.push(vendor);
      }

      console.log(`🎯 JustDial scraping completed. Found ${vendors.length} vendors.`);
    } catch (error) {
      console.error('❌ Error scraping JustDial:', error.message);
    } finally {
      await browser.close();
    }

    return vendors;
  }

  try {
    // Scrape from Google Maps and JustDial only
    console.log('🚀 Starting comprehensive agricultural vendor scraping...');
    console.log('📍 Location:', location);

    console.log('\n=== GOOGLE MAPS SCRAPING ===');
    const googleVendors = await scrapeGoogleMaps(location);
    console.log(`📊 Google Maps vendors found: ${googleVendors.length}`);

    console.log('\n=== JUSTDIAL SCRAPING ===');
    const justDialVendors = await scrapeJustDial(location);
    console.log(`📊 JustDial vendors found: ${justDialVendors.length}`);

    // Aggregate vendors from only these two sources
    let vendors = googleVendors.concat(justDialVendors);
    console.log(`📊 Total vendors before deduplication: ${vendors.length}`);

    // Deduplicate and limit results
    vendors = deduplicateVendors(vendors).slice(0, max_results);
    console.log(`📊 Final vendors after deduplication: ${vendors.length}`);

    // Format and print table
    const table = formatVendorsTable(location, vendors);
    console.log('\n📋 FINAL RESULTS:');
    console.log(table);

    // Save to file
    const fs = await import('fs');
    const filename = `agri_vendors_${location.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    fs.writeFileSync(filename, table);
    console.log(`\n💾 Results saved to ${filename}`);

    return table;

  } catch (error) {
    console.error('❌ Error in main scraping function:', error.message);
    return `Error scraping agricultural vendors: ${error.message}`;
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
