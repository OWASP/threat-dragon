---
layout: page
title: Diagrams
path: /modeling/diagrams
nav_order: 1
group: Modeling
---

## [OWASP](https://www.owasp.org) Threat Dragon

Creating the [Threat Dragon](http://owasp.org/www-project-threat-dragon) diagrams

Once you have [created or opened]({{ '/usage/modeling/gettingstarted.html' | relative_url }})
a threat model file the next step is to edit the threat model diagrams.
Click on the diagram you wish to edit and you will be taken to the diagram editor.

## Processes, data stores and actors

Add model elements to your diagram by dragging a component from the stencil on the left side of the diagram editor.
Once added they can be selected by clicking them to see their properties and threats and dragged around the diagram.
To delete an element, first select it and then click on the red icon in the element's top left corner like so:

![the element delete tool]({{ '/assets/images/delete.png' | relative_url }})

## Data flows and trust boundaries

Data flows and trust boundaries can be added to the diagram by clicking their shape
in the stencil on the left side of the diagram editor.

Once added, the data flow end points can be dragged around the diagram.
To connect the end of a data flow to a diagram element drag one of its ends onto the element.

Extra vertices can be added by clicking at some point on the line.
These new vertices can also be dragged to position the data flow or trust boundary.

A data flow can be selected by clicking the Link options tool that appears when you select the link.
Once selected you can edit its properties or add threats to it.

Data flows and trust boundaries can be deleted by clicking the red icon that appears selected.

![flow remove tool]({{ '/assets/images/deleteflow.png' | relative_url }})

## Element properties
To edit the properties of a model element, first select it.
The element properties will then be shown on the lower left side of the diagram editor.

## Out of scope elements

Processes, data stores, actors and data flows can be marked as out of scope.
You can use this for elements that are needed to help a diagram make sense,
but for which you are not interested in creating threats.
To help reviewers (and as a reminder for future-you) you can specify
a reason why elements have been marked out of scope.

Threat generation is disabled for these elements.
Out of scope elements are indicated in diagrams with dashed lines:

![out of scope elements with dashed lines]({{ '/assets/images/scope.png' | relative_url }})

## Elements with open threats

Processes, data stores, actors and data flows that have open (unmitigated) threats
are highlighted in red so that you know where to focus your attention:

![elements with open threats are red]({{ '/assets/images/openthreats.png' | relative_url }})

## Editing toolbar
The toolbar on the diagram editing page supports some general diagramming features:

![Toolbar image]({{ '/assets/images/toolbar.png' | relative_url }})

* Delete the selected element(s)
* Configure the keyboard shortcuts from the defaults
* Undo and Redo edits
* Zoom In and Zoom Out
* Toggle gridlines on/off, allowing for neater models
* Close the diagram and return to the threat model details view
* Save the threat model
