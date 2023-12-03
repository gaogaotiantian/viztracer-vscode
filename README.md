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

Currently, you still need to trace your code with `viztracer` command line tool.
This extension improves the user experience for viewing the trace report.

Right-click on your `json` report in the file explorer, choose "View with vizviewer".

If Column Two exists, the report will be shown in Column Two. Otherwise it will be shown in Column One.

## Source code explorer

An "Open in VSCode" button will be displayed above the original source code. Click to open the source code in VS Code.

Or you can double click the function slice to open the source code.

Source code will always be opened in Column One, so you can do side-by-side view.

## License

Copyright 2023 Tian Gao.

Distributed under the terms of the [Apache 2.0 license](https://github.com/gaogaotiantian/viztracer-vscode/blob/master/LICENSE)
