---
layout: page
title: Threat Generation
path: /modeling/threats
nav_order: 2
group: Modeling
---

<style type="text/css">
.image-left {
  display: block;
  margin-left: auto;
  margin-right: 15px;
  float: left;
}
</style>

## [OWASP](https://www.owasp.org) Threat Dragon

Threat generation for [Threat Dragon](http://owasp.org/www-project-threat-dragon)

## Adding and editing threats

![New threat]({{ '/assets/images/newthreat.png' | relative_url }}){: .image-left }

To add threats to elements in your diagram, select an element
and click on 'New Threat' to the lower right of the diagram editor.
Note that this button will be disabled if an out-of-scope element is selected.

Enter the details for your threat in the threat dialog.
Values for 'Title' and 'Threat Type' are always required.
When you are done hit **Apply** and the new threat will be appear lower right.

Click on the threat in the lower right collection to edit again or edit an existing threat.

### Threats by element
Some threat categories are associated with some diagram elements more than others.
For example an Actor element is more likely to have Spoofing and Repudiation threats
associated with it, and less likely to be vulnerable to
Tampering, Information disclosure, Denial of service or Elevation of privileges.

According to the type of diagram (STRIDE, LINDDUN and CIA),
Threat Dragon will restrict the threat type according to threats per element.

## STRIDE, LINDDUN, CIA and Generic
The threat model can have different types of threats added to it according to the diagram methodology.
Currently the supported methodologies are STRIDE, LINDDUN and CIA;
these are selected as part of the diagram attributes when editing the model.
A 'Generic' methodology is provided so that you can select any type of threat. 

Note that it is OK to select one methodology, enter some threats into the model,
and then change the model methodology. No threats are removed when you do this,
and your previous threats will still be retained in the model.

For example if a threat is added using CIA and the model type is then changed to LINDDUN,
then the CIA threat is still in the model and can be edited as before.
In addition if LINDDUN threats are added and then the model is changed back to CIA
then both LINDDUN and CIA threats are in the model and both types can be edited.
Of course, same goes for STRIDE and so on.

