param(
  [switch]$StartDev,
  [int]$Port = 3001,
  [switch]$Detached
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$webPath = Join-Path $root "apps\web"
$nextPath = Join-Path $webPath ".next"
$npmCmd = "C:\Program Files\nodejs\npm.cmd"

Write-Host "== 75Flex web recovery =="

function Get-ListeningPidsForPorts {
  param([int[]]$Ports)

  $ids = @()
  $netstat = netstat -ano

  foreach ($port in $Ports) {
    $matches = $netstat | Select-String ":$port"
    foreach ($line in $matches) {
      $parts = ($line.ToString() -replace "\s+", " ").Trim().Split(" ")
      if ($parts.Length -ge 5) {
        $pidCandidate = $parts[-1]
        if ($pidCandidate -match "^\d+$" -and $pidCandidate -ne "0") {
          $ids += [int]$pidCandidate
        }
      }
    }
  }

  return $ids | Sort-Object -Unique
}

function Stop-Pids {
  param([int[]]$Ids)

  foreach ($targetId in ($Ids | Sort-Object -Unique)) {
    try {
      Stop-Process -Id $targetId -Force -ErrorAction Stop
      Write-Host "Stopped PID $targetId."
    } catch {
      Write-Host "Could not stop PID $targetId (already gone or no access)."
    }
  }
}

function Stop-StaleNextNodeProcesses {
  $stale = @()
  try {
    $stale = Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
      Where-Object {
        $cmd = $_.CommandLine
        $isNext = $cmd -match "next(\.js)?\s+(dev|start)"
        $isWorkspace = $cmd -match "75flex|75Flex|@app/web|apps\\web"
        $isNext -and $isWorkspace
      }
  } catch {
    Write-Host "Could not inspect stale node processes (insufficient privileges)."
    return
  }

  foreach ($proc in $stale) {
    try {
      Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
      Write-Host "Stopped stale Next process PID $($proc.ProcessId)."
    } catch {
      Write-Host "Could not stop stale Next process PID $($proc.ProcessId)."
    }
  }
}

# Stop anything currently listening on common web ports + configured port.
$portsToClear = @($Port, 3000, 3001) | Sort-Object -Unique
Stop-Pids -Ids (Get-ListeningPidsForPorts -Ports $portsToClear)
Stop-StaleNextNodeProcesses
Start-Sleep -Seconds 1

# Remove stale Next cache with retries
if (Test-Path $nextPath) {
  try {
    icacls $nextPath /grant "dh:(OI)(CI)F" /T /C | Out-Null
  } catch {
    Write-Host "Could not update ACLs for .next (continuing)."
  }

  $removed = $false
  for ($i = 1; $i -le 8; $i++) {
    try {
      Remove-Item -LiteralPath $nextPath -Recurse -Force -ErrorAction Stop
      $removed = $true
      Write-Host "Removed .next cache."
      break
    } catch {
      Write-Host "Attempt $i failed removing .next. Retrying..."
      Start-Sleep -Seconds 1
    }
  }

  if (-not $removed -and (Test-Path $nextPath)) {
    Write-Host "Warning: could not fully remove .next cache. Continuing with rebuild..."
  }
}

Write-Host "Running fresh build..."
& $npmCmd run build:web
if ($LASTEXITCODE -ne 0) {
  throw "build:web failed."
}

if ($StartDev) {
  Write-Host "Starting dev server on port $Port..."
  if ($Detached) {
    Start-Process -FilePath "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" `
      -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", "`$env:Path += ';C:\Program Files\nodejs'; `$env:PORT='$Port'; & '$npmCmd' run dev:web" `
      -WorkingDirectory $root
    Write-Host "Dev server launched in new PowerShell window (port $Port)."
  } else {
    $env:PORT = "$Port"
    & $npmCmd run dev:web
  }
} else {
  Write-Host "Recovery complete."
}
