---
layout: page
title: CLI
nav_order: 4
path: /cli
group: CLI
---

## [OWASP](https://www.owasp.org) Threat Dragon

With the desktop version of [Threat Dragon](http://owasp.org/www-project-threat-dragon) installed,
and if the executable is in the environment path, then Threat Dragon can be run from the command line.

For example after install on MacOS and Linux:

`OWASP-Threat-Dragon`

or after install on Windows:

`OWASP-Threat-Dragon.exe`

AppImage does not need installation, so after downloading version 1.3.1 (for example) just run:

`./OWASP-Threat-Dragon-1.3.1.AppImage`

There is also a command line interface which can be used (again if the executable is in the environment path)
to directly access some of Threat Dragon's functionality.
For example run this command to get help :

`OWASP-Threat-Dragon --help`

Or to export a given threat model file to pdf :

`OWASP-Threat-Dragon --pdf ./threat-model.json --verbose`

If on Windows:

`OWASP-Threat-Dragon.exe --pdf .\threat-model.json --verbose`

or using AppImage (using version 1.3.1 for example):

`./OWASP-Threat-Dragon-1.3.1.AppImage --pdf ./threat-model.json --verbose`

*Note* that the path to the JSON file needs to be resolvable, so use the full path
or the './' if the file is in the working directory.

Here is the help contents for version 1.3.1 :

```
OWASP-Threat-Dragon --help
Usage: OWASP-Threat-Dragon <command> [options]

Commands:
  OWASP-Threat-Dragon edit <json>   Edit JSON threat model          [aliases: e]
  OWASP-Threat-Dragon open <json>   Open JSON threat model          [aliases: o]
  OWASP-Threat-Dragon pdf <json>    Export JSON threat model as PDF [aliases: p]
  OWASP-Threat-Dragon print <json>  Print JSON threat model         [aliases: p]
  OWASP-Threat-Dragon run           Run threat dragon application[aliases: r, x]

Options:
  --version      Show version number                                   [boolean]
  --verbose, -v  Increasing levels of verbosity                          [count]
  --help         Show help                                             [boolean]
```

Verbosity can be increased from the default of 'error':<br>
`-v` warnings and info<br>
`-vv` verbose and debug<br>
`-vvv` silly<br>
