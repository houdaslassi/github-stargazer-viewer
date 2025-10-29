# 🚀 Chrome Web Store Submission Guide

## Step 1: Prepare Your Extension Package

### 1.1 Create the Distribution Folder
```bash
# Make sure all files are in dist folder
mkdir -p dist/icons
cp manifest.json content.js vue.js dist/
```

### 1.2 Create Icons (REQUIRED)
You need 3 icon sizes:
- `icons/icon16.png` - 16x16 pixels
- `icons/icon48.png` - 48x48 pixels  
- `icons/icon128.png` - 128x128 pixels

**Quick way to create icons:**
1. Use a design tool (Figma, Canva, Photoshop)
2. Or use an online icon generator: https://favicon.io/favicon-generator/
3. Create a simple design with a star icon ⭐
4. Export at all 3 sizes

### 1.3 Update manifest.json with Icons
Make sure your `manifest.json` includes:
```json
{
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  }
}
```

### 1.4 Create ZIP File
```bash
cd dist
zip -r ../github-stargazer-viewer-v1.0.0.zip .
cd ..
```
**⚠️ Important:** Zip ONLY the files inside `dist/`, not the `dist` folder itself!

---

## Step 2: Create Google Developer Account

### 2.1 Sign Up
1. Go to: https://chrome.google.com/webstore/devconsole/
2. Sign in with your Google account
3. Accept the Developer Terms

### 2.2 Pay Registration Fee
- **Cost:** $5 USD (one-time payment)
- This allows you to publish unlimited extensions
- Payment via Google Pay or credit card

---

## Step 3: Upload Your Extension

### 3.1 Create New Item
1. After registration, click **"New Item"** button
2. Upload your ZIP file (`github-stargazer-viewer-v1.0.0.zip`)
3. Fill out the form:

### Required Information:

#### **Store Listing:**

**Name:** `GitHub Stargazer Viewer` (or your preferred name)
- Max 45 characters

**Summary:** (short description)
```
View who starred GitHub repositories. Simple browser extension to see all stargazers.
```
- Max 132 characters

**Description:** (detailed)
```
GitHub Stargazer Viewer helps you see who starred any GitHub repository. 

Features:
⭐ View all stargazers of any public repository
📄 Pagination support - Load all stargazers
🎨 Clean, modern UI integrated into GitHub
⚡ Fast and lightweight

Perfect for repository owners who want to see their community or for anyone curious about who's interested in a project.

Privacy: This extension only uses GitHub's public API. No data is stored or transmitted to any third-party servers.
```
- Max 16,000 characters

#### **Privacy:**
**Single Purpose:** ✅ Yes (only shows stargazers)

**Permissions:** 
- `storage` - To optionally store user preferences (if you add features later)
- `https://api.github.com/*` - To fetch GitHub API data

**Privacy Practices:**
- ✅ Does not collect user data
- ✅ Does not track users
- ✅ Only uses GitHub's public API
- ✅ No analytics

#### **Category:**
Select: **"Productivity"** or **"Developer Tools"**

#### **Screenshots** (REQUIRED):
You need at least 1 screenshot:
- Size: 1280x800 or 640x400 pixels
- Show the extension in action
- How to create:
  1. Open GitHub repo page
  2. Click the extension button
  3. Take screenshot of the modal
  4. Can use any screenshot tool (macOS: Cmd+Shift+4)

**Tips:**
- Show the modal with stargazers list
- Make it look professional
- Add 2-3 screenshots if possible

#### **Small and Large Promotional Tiles** (Optional but recommended):
- Small: 440x280 pixels
- Large: 920x680 pixels
- Shows your extension's key feature

---

## Step 4: Submit for Review

### 4.1 Review Your Listing
- Double-check all information
- Make sure ZIP file is correct
- Verify icons and screenshots look good

### 4.2 Submit
1. Click **"Submit for Review"**
2. Wait for review (usually 1-3 days)
3. Google will check:
   - Extension works
   - Follows Chrome Web Store policies
   - Privacy practices

### 4.3 Possible Issues:
- **Rejected:** Google will email you reasons
- **Needs Changes:** You'll get feedback
- **Approved:** 🎉 Your extension goes live!

---

## Step 5: After Approval

### 5.1 Update Your Extension
- You can update by uploading a new ZIP
- Version number must increase (1.0.0 → 1.0.1)

### 5.2 Monitor Performance
- Check reviews
- Respond to user feedback
- Fix bugs and update

---

## Quick Checklist Before Submitting:

- [ ] Extension works correctly
- [ ] All icons created (16, 48, 128)
- [ ] ZIP file created (only files, not folder)
- [ ] Screenshots ready (at least 1)
- [ ] Description written
- [ ] Privacy information filled
- [ ] Tested on multiple repos
- [ ] No console errors
- [ ] manifest.json has icons configured

---

## Need Help?

- **Chrome Web Store Policies:** https://developer.chrome.com/docs/webstore/program-policies/
- **Developer Dashboard:** https://chrome.google.com/webstore/devconsole/
- **Documentation:** https://developer.chrome.com/docs/webstore/

---

## Estimated Timeline:

1. Create icons: 30 minutes
2. Take screenshots: 15 minutes  
3. Fill out form: 30 minutes
4. Submit: 5 minutes
5. **Review wait:** 1-3 days ⏳

**Total active work:** ~1.5 hours
**Total time:** 1-3 days

Good luck! 🚀

