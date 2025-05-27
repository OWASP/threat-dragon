---
layout: page
title: Threats
nav_order: 2
path: /usage/threats
group: Modeling
---

## Threat generation

![Add threat]({{ '/assets/images/add-threat.png' | relative_url }}){: height="100" }

## Adding threats

To add threats to elements in your diagram, select an element
and click on 'New Threat' to the lower right of the diagram editor.
Note that this button will be disabled if an out-of-scope element is selected.

![New threat]({{ '/assets/images/new-threat.png' | relative_url }}){: width="400" }

Enter the details for your threat in the threat dialog,
such as any remediation applied or the reasoning it has been marked N/A.
Values for 'Title' and 'Threat Type' are always required.

Note that some threat categorization types restrict the threats that can be selected for a given diagram element;
see [Threats by element type](#threats-by-element-type) for a description of this feature.

When you are done hit **Apply** and the new threat will be appear lower right.
Otherwise hit **Remove** to exit editing without applying the threat.

### Editing or deleting threats

To edit an existing threat, select the diagram element and then click on the threat in the lower right collection.

![Edit threat]({{ '/assets/images/edit-threat.png' | relative_url }}){: width="400" }

The information for the threat can be edited as before.
**Apply** will save any changes, **Cancel** will discard changes and **Delete** will remove the threat entirely.

### Threat properties

All threats have the following properties:

* Title is free form test, usually a short descriptive title
* Type is a category selection determined by the diagram type (STRIDE / LINDDUN / PLOT4ai / CIA / CIA-DIE / Generic)
* Status is one of N/A / Open / Mitigated
* Score contains a free text field, often used to score the threat from 0.0 to 10.0 but can be any text or CVSS score
* Severity is one of TBD / Low / Medium / High / Critical, similar to CVSS
* Description of the threat and possible impact
* Mitigations for the threat, probably a remediation from TAME (Transfer / Accept / Mitigate / Evade)

Here N/A stands for Not Applicable and TBD for To Be Defined (or Determined).
Threat severity is used instead of 'Priority' - this [has been discussed][issue#197]
and 'Severity' is now used because this fits in with the [Mitre definitions][severity] of severity.

## Threat categories

The threat model can have [different types of threats]({{ '/usage/threat-categories.html' | relative_url }})
added to it according to the diagram type.
Currently the supported types are STRIDE, LINDDUN, CIA, CIA-DIE and PLOT4ai;
these are configured as part of the diagram attributes when editing the model.
A 'Generic' type is provided so that you can select any type of threat from any of the categories.

## Threats by element type

Referring to the [threats by element tables]({{ '/usage/threat-categories.html#threats-by-element' | relative_url }}),
it is useful to cycle through all the categories of threat for a given component.
These categories can then be considered in turn and accepted if found useful.

![New threat by element]({{ '/assets/images/threat-by-element.png' | relative_url }}){: width="400" }

To help drive this discussion Threat Dragon provides a 'New Threat by Type'
where a sequence of threats is presented in turn.

The individual threat can be accepted using **Apply**, and the threats can be cycled through
using the **Previous** and **Next** buttons.
Use the **Cancel** button to exit the suggestion sequence.

## Threats by context

The components on the diagram have type-specific properties,
for example the Actor component has a property 'Provides Authentication' via a check-box.
These properties are used to determine context specific threat suggestions using 'New Threat by Context'.

![New threat by context]({{ '/assets/images/threat-by-context.png' | relative_url }}){: width="400" }

At present the suggestions are based on the OWASP Automated Threats to Web Applications, commonly known as [OATS][oats].
The threat suggestion can be accepted using **Apply**
and cycle through the threats using the **Previous** and **Next** buttons.
Use **Cancel** to exit the suggestion sequence.

The properties that are used for contextual threat suggestions are:

* Data flow
  * Protocol
  * Encrypted
  * Public Network
* Actor
  * Provides Authentication
* Process
  * Privilege Level
  * Card payment
  * Goods or Services
  * Web Application
* Data store
  * Is a Log
  * Stores Credentials
  * Encrypted
  * Signed
  * Stores Inventory

If there is no suggestion available, usually when no properties have been selected, then a generic threat is shown instead.

----

Threat Dragon: _making threat modeling less threatening_

[issue#197]: https://github.com/OWASP/threat-dragon/issues/197
[oats]: https://owasp.org/www-project-automated-threats-to-web-applications/
[severity]: https://nvd.nist.gov/vuln-metrics/cvss
