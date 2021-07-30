### Conversion from Microsoft Threat Modeling Tool

This TMT2TD python script converts a Microsoft Threat Modeling Tool file `.tm7` file to a Threat Dragon `.json` file.

Run the script using python and select the TM7 file, the script will then output a
file with the same name but using a `.json` extension.

Included here is an example TM7 file and the transpiled Threat Dragon file.

```
threat-dragon$ python --version
Python 3.9.5
threat-dragon$ python tmt2td.py
```
