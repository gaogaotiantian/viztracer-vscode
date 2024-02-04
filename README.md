# VizTracer VS Code Extension

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/gaogaotiantian.viztracer-vscode?logo=visual-studio)](https://marketplace.visualstudio.com/items?itemName=gaogaotiantian.viztracer-vscode)


This is a VS Code Extension for [VizTracer](https://github.com/gaogaotiantian/viztracer)

<p align="center">
    <img src="https://github.com/gaogaotiantian/viztracer-vscode/raw/master/assets/demo.gif" />
</p>

## Requirements

* Official python extension for VS Code.
* `viztracer >= 0.16.1` needs to be installed in your python environment

## Usage

### Trace Scripts

Right click on your python script and choose `Trace with VizTracer` or just do it
on command line with `viztracer`.

To set the arguments to `viztracer` or your script, use `viztracer.viztracerArguments`
and `viztracer.scriptArguments` settings.

By default viztracer will run in your current active terminal if there is one.
You can set `viztracer.terminalToTrace` to `New Terminal` to always create a new
terminal to trace the scripts.

### View Reports

Right-click on your `json` report in the file explorer, choose `View with vizviewer`.

You can configure which column(tab group) will be used to hold the viewer tab with `viztracer.openTabOn`.
The default is `Always New`, which always creates a new column for the viewer tab.

### Source code explorer

An "Open in VSCode" button will be displayed above the original source code. Click to open the source code in VS Code.

Or you can double click the function slice to open the source code.

Source code will always be opened in Column One, so you can do side-by-side view.

## License

Copyright 2023-2024 Tian Gao.

Distributed under the terms of the [Apache 2.0 license](https://github.com/gaogaotiantian/viztracer-vscode/blob/master/LICENSE)
