@echo off
chcp 65001 >nul
echo Cleaning unused files...
echo.

REM Delete unused component files
echo Deleting unused component files...
if exist "components\compression-controls.tsx" del /f "components\compression-controls.tsx"
if exist "components\download-manager.tsx" del /f "components\download-manager.tsx"
if exist "components\export-tabs.tsx" del /f "components\export-tabs.tsx"
if exist "components\favicon-generator.tsx" del /f "components\favicon-generator.tsx"
if exist "components\format-converter.tsx" del /f "components\format-converter.tsx"
if exist "components\generation-tabs.tsx" del /f "components\generation-tabs.tsx"
if exist "components\image-manager.tsx" del /f "components\image-manager.tsx"
if exist "components\image-preview.tsx" del /f "components\image-preview.tsx"
if exist "components\og-image-generator.tsx" del /f "components\og-image-generator.tsx"
if exist "components\og-image-generator-refactored.tsx" del /f "components\og-image-generator-refactored.tsx"
if exist "components\operation-toolbar.tsx" del /f "components\operation-toolbar.tsx"
if exist "components\processing-tabs.tsx" del /f "components\processing-tabs.tsx"
if exist "components\webp-converter.tsx" del /f "components\webp-converter.tsx"

REM Delete og-image directory
echo Deleting OG image components...
if exist "components\og-image" rmdir /s /q "components\og-image"

REM Delete unused lib files
echo Deleting unused lib files...
if exist "lib\use-contrast-analysis.ts" del /f "lib\use-contrast-analysis.ts"
if exist "lib\use-export-data.ts" del /f "lib\use-export-data.ts"
if exist "lib\use-image-processing.ts" del /f "lib\use-image-processing.ts"
if exist "lib\use-mobile-gestures.ts" del /f "lib\use-mobile-gestures.ts"
if exist "lib\use-og-image-generator.ts" del /f "lib\use-og-image-generator.ts"
if exist "lib\use-og-image-state.ts" del /f "lib\use-og-image-state.ts"

REM Delete backup files
echo Deleting backup files...
if exist "app\page-backup.tsx" del /f "app\page-backup.tsx"

echo.
echo File cleanup completed!
echo.
echo Next: Clean package.json dependencies manually
echo Run: yarn remove [package-name] or edit package.json then yarn install
pause
