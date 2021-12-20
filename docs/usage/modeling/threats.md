---
layout: page
title: Threat Generation
path: /modeling/threats
nav_order: 2
group: Modeling
---

## [OWASP](https://www.owasp.org) Threat Dragon

Threat generation for [Threat Dragon](http://owasp.org/www-project-threat-dragon)

## Adding and editing single threats
To add threats to elements in your diagram, select an element
and click on 'Edit Threats' to the left side of the diagram editor.
This will collapse the model element stencil and show the threats for the selected element.
To add a new threat select '**+** Add a new threat'

Enter the details for your threat in the threat dialog.
Values for 'Title' and 'Threat Type' are mandatory.
When you are done hit **Save** and your new threat should appear.
To edit it again click on the threat title.

## STRIDE, LINDDUN and CIA
The threat model can have different types of threats added to it according to your preferred methodology.
Currently the supported methodologies are STRIDE, LINDDUN and CIA;
these can be selected using the radio buttons on the diagram.

Note that it is OK to select one methodology, enter some threats into the model,
and then change the model methodology. No threats are removed when you do this,
and your previous threats will still be retained in the model.

For example if a threat is added using CIA and the model is then changed to LINDDUN,
then the CIA threat is still in the model and can be edited as before.
In addition if LINDDUN threats are added and then the model is changed back to CIA
then both LINDDUN and CIA threats are in the model and both types can be edited.
Of course, same goes for STRIDE and so on.

## Suggesting threats

Threat Dragon provides rules to generate suggested threats for
elements on the diagram, except for trust boundaries.
The suggested threats can be individually accepted or ignored, and other threats added manually.

### Threats by element
According to the type of diagram (STRIDE, LINDDUN and CIA), Threat Dragon can suggest categories
of threats per element. When editing a STRIDE diagram, selecting '**+** STRIDE per element"
will suggest threats that are more suitable for the selected element.

The rationale for this is that some threat categories are associated with some diagram elements more than others.
For example an Actor element is more likely to have Spoofing and Repudiation threats
associated with it, and less likely to be vulnerable to
Tampering, Information disclosure, Denial of service or Elevation of privileges.

### Threats by context
Threat Dragon can also suggest threats according to the properties for a diagram element.
These properties are particular for each type of element; for example an Actor element
has property 'Provides authentication' and a Data Flow element has properties
'Is encrypted' and 'Is over a public network'.

When editing a threat model diagram, selecting '**+** Threats within context"
will suggest threats using the properties for the selected element.
Many of these suggestions based on the OWASP
[Automated Threats to Web Applications](https://owasp.org/www-project-automated-threats-to-web-applications/).
