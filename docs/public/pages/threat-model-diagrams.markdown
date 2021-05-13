---
layout: page
title: Threat model diagrams
permalink: /threat-model-diagrams/
nav_order: 4
---

## [OWASP](https://www.owasp.org) Threat Dragon

Creating the [Threat Dragon](http://owasp.org/www-project-threat-dragon) diagrams

Once you have [created or opened](/getting-started) an existing threat model file 
the next step is to edit the threat model diagrams.
Click on the diagram you wish to edit and you will be taken to the diagram editor.

### Diagram title

To edit the diagram title, click on the diagram title itself.
Edit the title and then save (or cancel) your changes.

## Processes, data stores and actors

Add model elements to your diagram by clicking or tapping the relevant shape
in the stencil on the left side of the diagram editor.
Once added they can be selected by clicking them to see their properties
and threats and dragged around the diagram.
To delete an element, first select it and then click on the red icon in the
element's top left corner like so:

![the element delete tool](/public/images/processelement.png)

## Data flows and trust boundaries

Data flows and trust boundaries can be added to the diagram by clicking their shape
in the stencil on the left side of the diagram editor.
Once added, their ends can be dragged around the diagram.
To connect the end of a data flow to a process, data store or actor,
you can drag one of its ends onto the element.

An easier way to draw data flows between elements is to select your first element,
then click the grey link tool, next to the red remove tool near the top right of the selected element.
This turns the link tool green. Then, when you click another element, a new data flow will be created,
linking the first element to the second.

![the element link tool](/public/images/actorelement.png)

Extra vertices can be added by clicking at some point on the line.
These new vertices can also be dragged to position the data flow or trust boundary.
Vertices can be removed by clicking the remove tool that appears when you mouse near to the vertex.

![vertex remove tool](/public/images/vertexremove.png)

A data flow can be selected by clicking the Link options tool that appears when you mouse near to the link.
Once selected you can edit its properties or add threats to it. Trust boundaries cannot be selected.

![flow select tool](/public/images/flowselect.png)

Data flows and trust boundaries can be deleted by clicking the red remove tool
that appears when you mouse near to them.

![flow remove tool](/public/images/flowremove.png)

## Out of scope elements

Processes, data stores, actors and data flows can be marked as out of scope.
You can use this for elements that are needed to help a diagram make sense,
but for which you are not interested in creating threats.
To help reviewers (and as a reminder for future-you) you can specify a reason
why elements have been marked out of scope.
Threat generation is disabled for these elements.
Out of scope elements are indicated in diagrams with dashed lines:

![out of scope elements with dashed lines](/public/images/outofscope.png)

## Elements with open threats

Processes, data stores, actors and data flows that have open (unmitigated) threats are highlighted in red so that you know where to focus your attention:

![elements with open threats are red](/public/images/openthreats.png)

## Editing toolbar
The toolbar on the diagram editing page supports some general diagramming features:

* Toggle gridlines on/off. When gridlines are on, elements snap to them for neater models
* Cancel the edit and return to the threat model details view
* Clear all the elements from the model
* Reload the diagram from the last save, discarding any changes
* Generate threats for the selected element using the threat generation rule engine
* Duplicate the selected element as a new element
* Save the threat model to your local browser storage

## Element properties
To edit the properties of a model element, first select it.
The element properties are shown on the right side of the diagram editor.
In a future version of Threat Dragon, these properties will be used by the
threat generation engine to suggest threats and mitigations for your model.
