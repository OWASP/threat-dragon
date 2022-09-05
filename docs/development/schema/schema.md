---
layout: page
title: Schema
nav_order: 1
path: /schema/schemas
group: Schema
---

# Threat Model Schema

## Summary
Threat model project meta-data

| Field  | Type  | Description  | Example  |
| ------ | ----- | ------------ | -------- |
| description  | string  | **OPTIONAL** Description of the threat model used for report outputs | "description": "A sample model" |
| id  | integer  | **OPTIONAL** A unique identifier for this main threat model object | "id": 0  |
| owner  | string  | **OPTIONAL** The original creator or overall owner of the model | "owner": "Mike Goodwin"  |
| tdVersion  | string  | **OPTIONAL** Threat Dragon version used in the model | "tdVersion": "2.0.0"  |
| title  | string  | **REQUIRED** Threat model title | "title": "Demo Threat Model"  |
{:.table .table-striped}

## Detail
Threat model definition

| Field  | Type  | Description  | Example  |
| ------ | ----- | ------------ | -------- |
| contributors  | array  | **OPTIONAL** An array of contributors to the threat model project | "contributors": [ { "name": "Tom Brown" }, { "name": "Albert Moneypenny" } ] |
| diagrams  | array  | **OPTIONAL** An array of single or multiple threat dataflow diagrams | "diagrams": []  |
| reviewer  | string  | **OPTIONAL** The reviewer of the overall threat model | "reviewer": "Jane Smith"  |
{:.table .table-striped}

## Diagrams
An array of single or multiple threat dataflow diagrams

| Field  | Type  | Description  | Example  |
| ------ | ----- | ------------ | -------- |
| diagramJson | object | **OPTIONAL** The dataflow diagram components | "diagramJson": { "cells": [] } |
| diagramType | string | **OPTIONAL** The methodology used by the dataflow diagram | "diagramType": "STRIDE" |
| id | integer | **OPTIONAL** The sequence number of the diagram | "id": 0 |
| thumbnail | string | **OPTIONAL** The path to the thumbnail image | "thumbnail": "./public/content/images/thumbnail.stride.jpg" |
| title | string | **OPTIONAL** The title of the dataflow diagram | "title": "Main Request Data Flow" |
{:.table .table-striped}
