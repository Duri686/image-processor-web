@echo off
chcp 65001 >nul
echo Cleaning unused dependencies...
echo.

REM Backup package.json
echo Backing up package.json...
copy package.json package.json.backup

REM Remove unused dependencies
echo Removing unused dependencies...
yarn remove @radix-ui/react-accordion
yarn remove @radix-ui/react-alert-dialog
yarn remove @radix-ui/react-aspect-ratio
yarn remove @radix-ui/react-avatar
yarn remove @radix-ui/react-checkbox
yarn remove @radix-ui/react-collapsible
yarn remove @radix-ui/react-context-menu
yarn remove @radix-ui/react-dialog
yarn remove @radix-ui/react-dropdown-menu
yarn remove @radix-ui/react-hover-card
yarn remove @radix-ui/react-menubar
yarn remove @radix-ui/react-navigation-menu
yarn remove @radix-ui/react-popover
yarn remove @radix-ui/react-progress
yarn remove @radix-ui/react-radio-group
yarn remove @radix-ui/react-scroll-area
yarn remove @radix-ui/react-select
yarn remove @radix-ui/react-separator
yarn remove @radix-ui/react-sheet
yarn remove @radix-ui/react-switch
yarn remove @radix-ui/react-table
yarn remove @radix-ui/react-tabs
yarn remove @radix-ui/react-toast
yarn remove @radix-ui/react-toggle
yarn remove @radix-ui/react-toggle-group
yarn remove @radix-ui/react-tooltip
yarn remove cmdk
yarn remove date-fns
yarn remove embla-carousel-react
yarn remove input-otp
yarn remove react-day-picker
yarn remove react-hook-form
yarn remove react-resizable-panels
yarn remove recharts
yarn remove vaul
yarn remove zod

echo.
echo 依赖包清理完成！
echo 正在重新安装剩余依赖...
yarn install

echo.
echo 清理完成！项目已优化。
pause
