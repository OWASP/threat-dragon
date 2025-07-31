---
layout: page
title: Threat categories
nav_order: 3
path: /usage/threat-categories
group: Modeling
---

## STRIDE, LINDDUN, CIA, CIA-DIE, PLOT4ai and Generic

The threat model can have different types of threats added to it according to the diagram type.
Currently the supported types are STRIDE, LINDDUN, CIA, CIA-DIE and PLOT4ai;
these are selected as part of the diagram attributes when editing the model.
A 'Generic' type is provided so that you can select any type of threat from any of the categories.

Note that it is OK to select one diagram type, enter some threats into the model,
and then change the model/diagram type. No threats are removed when you do this,
and your previous threats will still be retained in the model.

For example if a threat is added using CIA and the model type is then changed to LINDDUN,
then the original CIA threat is still in the model and can be edited as before.
In addition if LINDDUN threats are added and then the model is changed back to CIA
then both LINDDUN and CIA threats are in the model and both types can be edited.
Of course, same goes for STRIDE and so on.

### Diagram types

Diagram types are used to guide the identification of threats by suggesting categories of threats.
There are various types of diagrams provided by Threat Dragon,
and is perfectly OK to have diagrams of different types within the same model.

#### STRIDE

STRIDE is one of the earliest threat categorizations:

* Spoofing
* Tampering
* Repudiation
* Information disclosure
* Denial of service
* Elevation of privilege

#### LINDDUN

The LINDDUN diagrams provide threat categories with a focus on privacy :

* Linkability
* Identifiability
* Non-repudiation
* Detectability
* Disclosure of information
* Unawareness
* Non-compliance

#### PLOT4ai

PLOT4ai provides for Artificial Intelligence threat modeling:

* Technique & Processes
* Accessibility
* Identifiability & Linkability
* Security
* Safety
* Unawareness
* Ethics & Human Rights
* Non-compliance

#### CIA

The CIA triad is a basic and enduring threat categorization:

* Confidentiality
* Integrity
* Availability

#### CIA-DIE

The CIA-DIE diagram type adds more categories to the CIA triad which can be used for cloud based threat modeling:

* Distributed
* Immutable
* Ephemeral

#### Generic

The generic diagram type allows selection from any of the threat categories for the diagram types above.

### Threats by element

Some threat categories are associated with some diagram elements more than others.
For example an Actor element is more likely to have Spoofing and Repudiation threats
associated with it, and less likely to be vulnerable to
Tampering, Information disclosure, Denial of service or Elevation of privileges.

According to the type of diagram (STRIDE, LINDDUN and PLOT4ai),
Threat Dragon will restrict the threat type according to the element chosen.
If you find this too restrictive then change the diagram type to 'Generic'
and this will allow you to select any threat type for any type of element;
the diagram type can be changed back to STRIDE, LINDDUN or PLOT4ai later on.

CIA or CIA-DIE diagrams do not restrict the threat type by element.

#### STRIDE threats by element

```text
          S | T | R | I | D | E
ACTOR   | X |   | X |   |   |
STORE   |   | X | X | X | X |
PROCESS | X | X | X | X | X | X
FLOW    |   | X |   | X | X |
```

#### LINDDUN threats by element

```text
          L | I | N | D | D | U | N
ACTOR   | X | X |   |   |   | X |
STORE   | X | X | X | X | X |   | X
FLOW    | X | X | X | X | X |   | X
PROCESS | X | X | X | X | X |   | X
```

#### PLOT4ai threats by element

```text
          T | A | I | S | S | U | E | N
ACTOR   |   | X | X | X | X | X | X |
STORE   | X | X | X | X |   |   |   | X
FLOW    | X |   | X | X |   |   |   | X
PROCESS | X | X | X | X |   |   |   | X
```

----

Threat Dragon: _making threat modeling less threatening_
