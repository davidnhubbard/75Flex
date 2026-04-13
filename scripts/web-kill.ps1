param(
  [int[]]$Ports = @(3000, 3001)
)

$ErrorActionPreference = "Continue"

Write-Host "== 75Flex web kill =="

$pids = @()
foreach ($port in $Ports) {
  $lines = netstat -ano | Select-String ":$port"
  foreach ($line in $lines) {
    $parts = ($line.ToString() -replace "\s+", " ").Trim().Split(" ")
    if ($parts.Length -ge 5) {
      $pidCandidate = $parts[-1]
      if ($pidCandidate -match "^\d+$" -and $pidCandidate -ne "0") {
        $pids += [int]$pidCandidate
      }
    }
  }
}

$pids = $pids | Sort-Object -Unique
foreach ($id in $pids) {
  try {
    Stop-Process -Id $id -Force -ErrorAction Stop
    Write-Host "Stopped PID $id (port listener)."
  } catch {
    Write-Host "Could not stop PID $id."
  }
}

Start-Sleep -Seconds 1
Write-Host "Remaining listeners:"
$remaining = netstat -ano | Select-String ":3000|:3001"
if ($remaining) {
  $remaining | ForEach-Object { Write-Host $_.ToString() }
} else {
  Write-Host "None on 3000/3001."
}

exit 0
