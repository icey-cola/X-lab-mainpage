# Deploy to GitHub Pages Script

$ErrorActionPreference = "Stop"
$originalDir = Get-Location
Set-Location $originalDir
$DEPLOY_DIR = "deploy_temp"
$REPO_URL = "https://github.com/tjuxlab/tjuxlab.github.io"

Write-Host "Starting deployment process..."

# 1. Clean and recreate deploy directory
if (Test-Path $DEPLOY_DIR) {
    Remove-Item -Path $DEPLOY_DIR -Recurse -Force
}
New-Item -ItemType Directory -Path $DEPLOY_DIR | Out-Null

# 2. Copy public files
Write-Host "Copying public files..."
Copy-Item -Path "public\*" -Destination $DEPLOY_DIR -Recurse -Force

# 3. Copy data files
Write-Host "Copying data files..."
if (!(Test-Path "$DEPLOY_DIR\data")) {
    New-Item -ItemType Directory -Path "$DEPLOY_DIR\data" | Out-Null
}
Copy-Item -Path "data\*.json" -Destination "$DEPLOY_DIR\data" -Force

# 4. Transform files for static hosting
Write-Host "Transforming files for static hosting..."

# Function to replace string in file
function Replace-InFile {
    param (
        [string]$FilePath,
        [string]$Old,
        [string]$New
    )
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        if ($content -match [regex]::Escape($Old)) {
            $content = $content -replace [regex]::Escape($Old), $New
            Set-Content -Path $FilePath -Value $content -Encoding UTF8
            Write-Host "  Updated $FilePath"
        }
    }
}

# app.js replacements
Replace-InFile "$DEPLOY_DIR\app.js" "/api/slides" "data/hero_slides.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/key-tech" "data/key_tech.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/partners" "data/partners.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/publications" "data/publications.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/members" "data/members.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/image-wall" "data/image_wall.json"

# team.html replacements
Replace-InFile "$DEPLOY_DIR\team.html" "/api/members" "data/members.json"

# publications.html replacements
Replace-InFile "$DEPLOY_DIR\publications.html" "/api/publications" "data/publications.json"

# research-detail.html replacements
# This one is tricky because of the logic change. We'll do a regex replace for the block.
$researchFile = "$DEPLOY_DIR\research-detail.html"
if (Test-Path $researchFile) {
    $content = Get-Content $researchFile -Raw -Encoding UTF8
    
    # Replace the fetch logic
    $oldLogic = "const info = await fetchJSON(`/api/research/${id}`);`r`n        currentResearch = info;"
    $newLogic = "const allResearch = await fetchJSON('data/research.json');`r`n        const info = allResearch.find(r => r.id === id);`r`n        if (!info) throw new Error('Research not found');`r`n        currentResearch = info;"
    
    # Note: The backticks above are for PowerShell string escaping. 
    # Let's try a simpler replace for the URL first, then inject the logic.
    # Actually, let's just replace the URL and hope the logic holds? No, /api/research/id returns one object, data/research.json returns array.
    
    # We will use a more robust replacement for research-detail
    $content = $content.Replace('const info = await fetchJSON(`/api/research/${id}`);', 
        'const allResearch = await fetchJSON(''data/research.json''); const info = allResearch.find(r => r.id === id); if (!info) throw new Error(''Research not found'');')
    
    $content = $content.Replace('/api/publications', 'data/publications.json')
    
    Set-Content -Path $researchFile -Value $content -Encoding UTF8
    Write-Host "  Updated $researchFile"
}

# 5. Git Push
Write-Host "Pushing to GitHub..."
Set-Location $DEPLOY_DIR
git init
git branch -M main
git remote add origin $REPO_URL
git add .
git commit -m "Deploy to GitHub Pages $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push -f origin main

Write-Host "Deployment complete!"

# 6. Return to the previous directory

Write-Host "Returned to original directory: $originalDir"
