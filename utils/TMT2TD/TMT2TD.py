## the script converts MS TMT models to Threat Dragon models
## goal: parse TMT XML model into a dict that can be dumped into TD's json format
## Work in progress

import xml.etree.ElementTree as ET
import os
import json
import tkinter as tk
from tkinter import filedialog

# namespace for prop elements
ele_namespace = {'b': 'http://schemas.datacontract.org/2004/07/ThreatModeling.KnowledgeBase'}
any_namespace = {'a': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays'}

def get_element(ele2):
     # set up dictionaries
    # single element dict
    element = dict.fromkeys(['GenericTypeId','GUID','Name','SourceGuid','TargetGuid', 'properties'])
    elements = []
    # create a custom element properties dict
    ele_prop = dict.fromkeys(['PropName', 'PropGUID', 'PropValues', 'SelectedIndex'])
    ele_props = []
    # temp list of property values
    _values = []

         # this level enumerates a model's elements
    for ele3 in ele2.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}KeyValueOfguidanyType'):
        # GUID also at this level
        for ele4 in ele3.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}Value'):
            # get GUID
            for guid in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Guid'):
                element['GUID'] = guid.text
            for gen_type in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}GenericTypeId'):
                element['GenericTypeId'] = gen_type.text
            for source in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}SourceGuid'):
                element['SourceGuid'] = source.text
            for target in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}TargetGuid'):
                element['TargetGuid'] = target.text
            for props in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Properties'):
                for types in props.findall('.//a:anyType', any_namespace):
                # get all child elements of anyType element, all properties located here
                    for dis_name in types.findall('.//b:DisplayName', ele_namespace):   
                        ele_prop['PropName'] = dis_name.text
                    for prop_guid in types.findall('.//b:Name', ele_namespace):   
                        if prop_guid.text:
                            ele_prop['PropGUID'] = prop_guid.text
                        else:
                            ele_prop['PropGUID'] = ''
                    selection = types.find('.//b:SelectedIndex', ele_namespace)   
                    if selection is None:
                        ele_prop['SelectedIndex'] = ''
                        # get all prop values
                        value = types.find('.//b:Value', ele_namespace)
                        # set values
                        if value.text is None:
                            _values.append('')
                        else:
                            _values.append(value.text)
                        # set custom element name 
                        if ele_prop['PropName'] == 'Name':
                            element['Name'] = value.text
                            ele_prop['PropValues'] = _values.copy()
                    else:
                        # get prop selection
                        ele_prop['SelectedIndex'] = selection.text
                        # get value list for selection
                        for values in types.findall('.//b:Value/*', ele_namespace):
                            _values.append(values.text)
                        ele_prop['PropValues'] = _values.copy()
                     # add prop to prop list
                    _values.clear()
                    ele_props.append(ele_prop.copy())
                    ele_prop.clear()
            # save prop list to element dict
            element['properties'] = ele_props
            # print(element['properties'])

            elements.append([element['GenericTypeId'], element['GUID'], element['Name'], element['SourceGuid'], element['TargetGuid'], element['properties']])
            ele_props.clear()
    return elements

def get_notes(_root):
        msgs = []
        for notes in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Notes'):
            for note in notes.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Note'):
                for id in note.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Id'):
                    _id = id.text
                for message in note.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Message'):
                    _message = message.text
                msgs.append([_id,_message])
        return msgs

# get the summary info for the model
# missing: Assumptions, ExternalDependencies, 
def get_sum(_root):
    _sum = dict.fromkeys(['title','owner','description'])
    for sum in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}MetaInformation'):
        for _title in sum.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}ThreatModelName'):
            title = _title.text
        for _owner in sum.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Owner'):
            owner = _owner.text
        for _desc in sum.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}HighLevelSystemDescription'):
            desc = _desc.text
    _sum['title'] = title
    _sum['owner'] = owner
    _sum['description'] = desc
    return _sum

# get the contributors as a list
# contributors': [{'name': 'contrib'}]
def get_contribs(_root):
    for sum in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}MetaInformation'):
        for _contribs in sum.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Contributors'):
            contribs = _contribs.text.split(',')
    print(contribs)
    contrib_list = []
    c_dict = dict.fromkeys(['name'])
    for p in contribs:
        c_dict['name'] = p
        contrib_list.append(c_dict)
    return contrib_list

# get the contributors as a list
# should work like contributors but doesn't
def get_reviewers(_root):
    for sum in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}MetaInformation'):
        for _reviewrs in sum.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Reviewer'):
            reviewers = _reviewrs.text
    return reviewers

def main():
    root = tk.Tk()
    root.withdraw()

    try:
        file_path = filedialog.askopenfilename(parent=root, filetypes=[("MS threat model files", "*.tm7")])
    except FileNotFoundError:
        print('Must choose file path, quitting... ')
        quit()
    if not file_path:
        print('Must choose file path, quitting... ')
        quit()

    root.destroy()
    tree = ET.parse(file_path)
    root = tree.getroot()

    # remame extension
    base = os.path.splitext(file_path)[0]
    file_path = base + '.json'

    model = dict.fromkeys(['summary','details'])
    summary = get_sum(root)
    model['summary'] = summary
    model['details'] = dict.fromkeys(['contributors','diagrams','reviewer'])
    model['details']['contributors'] = get_contribs(root)
    model['details']['reviewer'] = get_reviewers(root)

    # find all note elements
    notes = get_notes(root)

    # add diagrams
    with open(file_path, 'w') as outfile:
        # get elements, borders, and notes
        for child in root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}DrawingSurfaceList'):
            for ele in child.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}DrawingSurfaceModel'):
                for borders in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Borders'):
                    #writer.writerow(['GenericTypeId','GUID','Name', '', '', 'Element Properties'])
                    stencils = get_element(borders)
                for line in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Lines'):
                    # Flows. Unlike stencils, flows have a source and target guids
                    # writer.writerow(['GenericTypeId','GUID','Name','SourceGuid','TargetGuid', 'Element Properties'])
                    lines = get_element(line)
        # Serializing json
        json.dump(model, outfile, indent=4, sort_keys=False)


if __name__ == '__main__':
   main()

