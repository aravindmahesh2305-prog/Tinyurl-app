# Installing Git on Windows

## Option 1: Download Git for Windows (Recommended)

1. **Download Git**
   - Go to: https://git-scm.com/download/win
   - The download will start automatically
   - Or click the download button for the latest version

2. **Run the Installer**
   - Double-click the downloaded `.exe` file
   - Follow the installation wizard:
     - **Select Components**: Keep defaults (Git Bash, Git GUI, etc.)
     - **Default Editor**: Choose your preferred editor (VS Code, Notepad++, etc.)
     - **PATH Environment**: Choose "Git from the command line and also from 3rd-party software"
     - **Line Ending Conversions**: Choose "Checkout Windows-style, commit Unix-style line endings"
     - **Terminal Emulator**: Choose "Use Windows' default console window"
     - Click "Install"

3. **Verify Installation**
   - Open PowerShell or Command Prompt
   - Run: `git --version`
   - You should see: `git version 2.x.x`

## Option 2: Install via Winget (Windows Package Manager)

If you have Windows 10/11 with winget:

```powershell
winget install --id Git.Git -e --source winget
```

## Option 3: Install via Chocolatey

If you have Chocolatey installed:

```powershell
choco install git
```

## After Installation

1. **Configure Git** (First time setup):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **Verify it works**:
   ```bash
   git --version
   ```

## Next Steps

After installing Git, you can:

1. Initialize your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TinyLink application"
   ```

2. Create a GitHub repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/tinylink.git
   git branch -M main
   git push -u origin main
   ```

---

**Download Link**: https://git-scm.com/download/win

