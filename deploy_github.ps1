# Deploy to GitHub Pages Script

$ErrorActionPreference = "Stop"
$originalDir = Get-Location
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

# ⭐⭐⭐ 4. Copy API folder (新增逻辑)
Write-Host "Copying API folder..."
if (Test-Path "api") {
    Copy-Item -Path "api" -Destination "$DEPLOY_DIR\api" -Recurse -Force
    Write-Host "  API folder copied."
} else {
    Write-Host "  No API folder found, skipping."
}

# 5. Transform files for static hosting
Write-Host "Transforming files for static hosting..."

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

Replace-InFile "$DEPLOY_DIR\app.js" "/api/slides" "data/hero_slides.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/key-tech" "data/key_tech.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/partners" "data/partners.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/publications" "data/publications.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/members" "data/members.json"
Replace-InFile "$DEPLOY_DIR\app.js" "/api/image-wall" "data/image_wall.json"
Replace-InFile "$DEPLOY_DIR\team.html" "/api/members" "data/members.json"
Replace-InFile "$DEPLOY_DIR\publications.html" "/api/publications" "data/publications.json"

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

# ⭐⭐⭐ Return to original directory（修复你之前的 bug）
Set-Location $originalDir
Write-Host "Returned to original directory: $originalDir"
