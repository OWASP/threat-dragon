# Investigation: Menu bar "Save" and "Save As" do not persist the threat model diagram

**Related issue:** [OWASP/threat-dragon#1360](https://github.com/OWASP/threat-dragon/issues/1360)

## Summary
In the desktop build of Threat Dragon (v2.5.0), using **File → Save** or **File → Save As** from the menu bar does not persist changes to the threat model diagram. The in-app Save button works correctly.

## How to reproduce
1. Open the Threat Dragon desktop app.
2. Create or open a threat model.
3. Make an edit (e.g., move an element).
4. Choose **File → Save** or **File → Save As**.
5. Close and reopen the model. The change is not saved.

## Root cause (investigation)
The Electron menu’s “Save” and “Save As” click handlers are not connected to the same save logic that the in-app Save button uses.  
The in-app Save button triggers an IPC event to the renderer, which properly persists the file.  
The menu items currently do not send that event.

## Proposed fix
Inside the Electron main process menu definition, update the Save and Save As menu items:

```js
{
  label: 'Save',
  accelerator: 'CmdOrCtrl+S',
  click: () => {
    mainWindow.webContents.send('save-model');
  }
},
{
  label: 'Save As',
  accelerator: 'CmdOrCtrl+Shift+S',
  click: () => {
    mainWindow.webContents.send('save-model-as');
  }
}


