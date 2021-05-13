---
layout: page
title: Threat generation
permalink: /threat-generation/
nav_order: 5
---

## [OWASP](https://www.owasp.org) Threat Dragon

Threat generation rules for [Threat Dragon](http://owasp.org/www-project-threat-dragon)

Threat Dragon provides rules to generate suggested threats for
elements on the diagram, except for trust boundaries.
The suggested threats can be individually accepted or ignored, and other threats added manually.

## Adding and editing threats
To add threats to elements in your diagram, select an element
and click on 'Edit Threats' to the left side of the diagram editor.
This will collapse the model element stencil and show the threats for the selected element.
To add a new threat select '+ Add a new threat ...'

Enter the details for your threat in the threat dialog.
Values for 'Title' and 'Threat Type' are mandatory.
When you are done hit **Save** and your new threat should appear.
To edit it again click on the threat title.

## STRIDE, LINDDUN and CIA
The threat model can have different types of threats added to it according to your preferred methodology.
Currently the supported methodologies are STRIDE, LINDDUN and CIA;
these can be selected using the radio buttons on the diagram.

**NOTE** it is OK to select one methodology, enter some threats into the model,
and then change the model methodology. No threats are removed when you do this,
and your previous threats will still be retained in the model.

For example if a threat is added using CIA and the model is then changed to LINDDUN,
then the CIA threat is still in the model and can be edited as before.
In addition if LINDDUN threats are added and then the model is changed back to CIA
then both LINDDUN and CIA threats are in the model and both types can be edited.
Of course, same goes for STRIDE and so on.
