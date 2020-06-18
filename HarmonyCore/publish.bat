@echo off
setlocal

set SolutionDir=%~dp0
pushd "%SolutionDir%"

set rpsmfil=%SolutionDir%Repository\bin\Debug\rpsmain.ism
set rpstfil=%SolutionDir%Repository\bin\Debug\rpstext.ism

set DeployDir=%SolutionDir%PUBLISH
if not exist %DeployDir%\. mkdir %DeployDir%

pushd Services.Host
dotnet publish -c Debug -r win7-x64 -o %DeployDir%
popd

rem Copy in the TraditionalBridge files
copy TraditionalBridge\bin\Debug\x64\TraditionalBridgeHost.dbr  %DeployDir%
copy TraditionalBridge\bin\Debug\x64\launch.bat                 %DeployDir%

popd
endlocal
