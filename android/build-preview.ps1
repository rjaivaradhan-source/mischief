param(
    [Parameter(Mandatory=$true)][string]$JdkPath,
    [Parameter(Mandatory=$true)][string]$SdkPath,
    [Parameter(Mandatory=$true)][string]$GradlePath,
    [string]$EcjJar,
    [string]$DebugKeystore
)
$ErrorActionPreference = 'Stop'
$env:JAVA_HOME = (Resolve-Path -LiteralPath $JdkPath).Path
$env:ANDROID_HOME = (Resolve-Path -LiteralPath $SdkPath).Path
$gradleExecutable = (Resolve-Path -LiteralPath $GradlePath).Path
$javaExecutable = Join-Path $env:JAVA_HOME 'bin/java.exe'
if ($DebugKeystore) { $env:MISCHIEF_DEBUG_KEYSTORE = (Resolve-Path -LiteralPath $DebugKeystore).Path }
if ($EcjJar) { $EcjJar = (Resolve-Path -LiteralPath $EcjJar).Path }
Push-Location $PSScriptRoot
try {
    if ($EcjJar) {
        & $gradleExecutable --no-daemon :app:processDebugResources :app:syncMixer
        if ($LASTEXITCODE -ne 0) { throw 'Android resource preparation failed.' }
        $classes = Join-Path $PSScriptRoot 'app/build/intermediates/javac/debug/compileDebugJavaWithJavac/classes'
        $buildRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'app/build')) + [IO.Path]::DirectorySeparatorChar
        $classes = [IO.Path]::GetFullPath($classes)
        if (-not $classes.StartsWith($buildRoot, [StringComparison]::OrdinalIgnoreCase)) { throw 'Classes directory is outside app/build.' }
        if (Test-Path -LiteralPath $classes) { Remove-Item -LiteralPath $classes -Recurse -Force }
        New-Item -ItemType Directory -Path $classes -Force | Out-Null
        $bootClasspath = (Join-Path $env:ANDROID_HOME 'platforms/android-35/android.jar') + ';' + (Join-Path $env:ANDROID_HOME 'build-tools/35.0.0/core-lambda-stubs.jar')
        & $javaExecutable -jar $EcjJar -8 -proc:none -encoding UTF-8 -bootclasspath $bootClasspath -classpath app/build/intermediates/compile_and_runtime_not_namespaced_r_class_jar/debug/processDebugResources/R.jar -d $classes app/src/main/java/com/mischief/emojikit
        if ($LASTEXITCODE -ne 0) { throw 'Java compilation failed; APK was not packaged.' }
        & $gradleExecutable --no-daemon assembleDebug lintDebug -x compileDebugJavaWithJavac
    } else {
        & $gradleExecutable --no-daemon assembleDebug lintDebug
    }
    if ($LASTEXITCODE -ne 0) { throw 'Android packaging or lint failed.' }
    $apk = Join-Path $PSScriptRoot 'app/build/outputs/apk/debug/app-debug.apk'
    & (Join-Path $env:ANDROID_HOME 'build-tools/35.0.0/apksigner.bat') verify --verbose $apk
    if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed.' }
    $releaseDir = Join-Path (Split-Path $PSScriptRoot -Parent) 'releases'
    New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null
    $releaseApk = Join-Path $releaseDir 'Mischief-Android-preview.apk'
    Copy-Item -LiteralPath $apk -Destination $releaseApk -Force
    $hash = (Get-FileHash -LiteralPath $releaseApk -Algorithm SHA256).Hash.ToLowerInvariant()
    Set-Content -LiteralPath (Join-Path $releaseDir 'SHA256SUMS.txt') -Value "$hash  Mischief-Android-preview.apk" -Encoding ascii
    Write-Output "Verified preview: $releaseApk"
} finally { Pop-Location }
