## the script converts MS TMT models to Threat Dragon models
## goal: parse TMT XML model into a dict that can be dumped into THreat Dragon's json format
## Work in progress
## https://github.com/jgadsden/owasp-threat-dragon-models/tree/master/ThreatDragonModels

import xml.etree.ElementTree as ET
import os
import json
import tkinter as tk
from tkinter import filedialog

# namespace for prop elements
ele_namespace = {'b': 'http://schemas.datacontract.org/2004/07/ThreatModeling.KnowledgeBase'}
any_namespace = {'a': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays'}

# get points for Flows and Boundary (BoundaryLines in MS TMT)
def get_flow_points(_cell,ele):
    for src_x in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}SourceX'):
        _src_x = int(src_x.text)
    for src_y in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}SourceY'):
        _src_y = int(src_y.text)
    for tar_x in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}TargetX'):
        _tar_x = int(tar_x.text)
    for tar_y in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}TargetY'):
        _tar_y = int(tar_y.text)
    # single verticy in MS TMT lines
    for vert_x in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}HandleX'):
        _vert_x = int(vert_x.text)
    for vert_y in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}HandleY'):
        _vert_y = int(vert_y.text)
    _cell['source']['x'] = _src_x
    _cell['source']['y'] = _src_y
    _cell['target']['x'] = _tar_x
    _cell['target']['y'] = _tar_y
    _cell['vertices'].append(dict.fromkeys(['x','y']))
    _cell['vertices'][0]['x'] = _vert_x
    _cell['vertices'][0]['y'] = _vert_y
    return

# Threat Dragon does not support boundary boxes; only lines. Hack to make boxes import
# creates a box from 5 points: source and target are same point and vertices make up the 3
# other points of the rectangle 
# always 3 for boxes
def calc_boundary_box(cell, ele):
    cell['vertices'].append(dict.fromkeys(['x','y']))
    cell['vertices'].append(dict.fromkeys(['x','y']))
    cell['vertices'].append(dict.fromkeys(['x','y']))
    for y in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Height'):
        _height = int(y.text)
    for w in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Width'):
        _width = int(w.text)
    for x in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Left'):
        _left = int(x.text)
    for top in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Top'):
         _top = int(top.text)
    # source and target are same
    cell['source']['x'] = _left
    cell['source']['y'] = _top
    cell['target']['x'] = _left
    cell['target']['y'] = _top
    # vertices make up the 3 other points of the rectangle
    cell['vertices'][0]['x'] = _left + _width
    cell['vertices'][0]['y'] = _top
    cell['vertices'][1]['x'] = _left + _width
    cell['vertices'][1]['y'] = _top + _height
    cell['vertices'][2]['x'] = _left
    cell['vertices'][2]['y'] = _top + _height
    return cell

def get_ele_size(cell, ele):
    if cell['type'] == 'tm.Actor' or cell['type'] == 'tm.Process' or cell['type'] == 'tm.Store':
        for y in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Height'):
            cell['pos']['y'] = int(y.text)
        for x in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Left'):
            cell['pos']['x'] = int(x.text)
        for top in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Top'):
            cell['size']['height'] = int(top.text)
        for width in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Width'):
            cell['size']['width'] = int(width.text)
    return cell

# find type, source, target, and vertices
def find_ele_type(tmt_type):
    tmt_type = tmt_type['{http://www.w3.org/2001/XMLSchema-instance}type']
    if tmt_type == "Connector" or tmt_type == "LineBoundary" or tmt_type == "BorderBoundary":
        # flows have source and target, so choose different dict format
        cell = dict.fromkeys(['type', 'size', 'smooth','source','target','vertices','id', 'z','hasOpenThreats','threats','attrs'])
        cell['source'] = dict.fromkeys(['x', 'y'])
        cell['target'] = dict.fromkeys(['x', 'y'])
        cell['vertices'] = list()
        if tmt_type == "Connector":
            ele_type = "tm.Flow"
        elif tmt_type == "LineBoundary" or tmt_type == "BorderBoundary":
            ele_type = "tm.Boundary"
            if tmt_type == "BorderBoundary":
                cell = calc_boundary_box(cell, tmt_type)
            cell['attrs'] = dict()
        else:
            return None
        #  get cords from MS TMT "lines" since boxes and lines are different in MS TMT
        if tmt_type == "LineBoundary" or tmt_type == "Connector":
            get_flow_points(cell,tmt_type)
        cell['smooth'] = True
        cell['size'] = dict.fromkeys(['width','height'])
        # defaults size for boundary or flows
        cell['size']['width'] = int(10)
        cell['size']['height'] = int(10)

    # must be a process, datastore, or EI
    else:
        cell = dict.fromkeys(['type','size','pos','angle','id', 'z','hasOpenThreats','threats','attrs'])
        cell['size'] = dict.fromkeys(['width','height'])
        cell['pos'] = dict.fromkeys(['x','y'])
        cell['angle'] = int(0)
        cell['attrs'] = dict.fromkeys(['.element-shape','text','.element-text'])
        cell['attrs']['.element-shape'] = "element-shape hasNoOpenThreats isInScope"
        cell['attrs']['.element-text'] = "element-text hasNoOpenThreats isInScope"
        if tmt_type == "StencilRectangle":
            ele_type = "tm.Actor"
        elif tmt_type == "StencilEllipse":
            ele_type = "tm.Process"
        elif tmt_type == "StencilParallelLines":
            ele_type = "tm.Store"
        else:
            return None
        cell = get_ele_size(cell, tmt_type)
    # default for now
    cell['hasOpenThreats'] = False

    # TODO: get_ele_threats
    # cell['threats'] = get_ele_threats(cell)

    if cell['hasOpenThreats'] == False:
        del cell['threats']

    cell['type'] = ele_type
    return cell

def get_element(ele, _z):
        # GUID also at this level
    for ele4 in ele.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}Value'):
        # find element type and get cell dict format
        cell = find_ele_type(ele4.attrib)

        cell['z'] = _z
        # create a custom element properties dict
        ele_prop = dict.fromkeys(['PropName', 'PropGUID', 'PropValues', 'SelectedIndex'])
        ele_props = []
        # temp list of property values
        
        _values = []
        # get GUID
        for guid in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Guid'):
            cell['id'] = guid.text
        # element properties are at this level
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
                        cell['attrs']['text'] = value.text
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
        # TODO: how do we transfer element properties to TD model? Do we need to? otherwise they will be left
        #element['properties'] = ele_props
        # print(element['properties'])
    return cell

# given all the elements, calulate and save the max dimentions for x and y
# used to determine screen size
def cal_max_size(ele):
    x = 0
    y = 0
    temp_w = 0
    temp_h = 0
    for ele4 in ele.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}Value'):
        for ele_y in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Height'):
            y = int(ele_y.text)
        for ele_x in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Left'):
            x = int(ele_x.text)
        for top in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Top'):
            temp_h = int(top.text)
        for width in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Width'):
            temp_w = int(width.text)
    x = temp_w + x
    y = temp_h + y
    return x,y


# find size of the diagram from the maximum calulated dims
def get_diagram_size(_root):
    max_x = 0
    max_y = 0
    for ele2 in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Borders'):
        for borders in ele2.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}KeyValueOfguidanyType'):
            x,y = cal_max_size(borders)
            if x > max_x:
                max_x = x
            if y > max_y:
                max_y = y
    for ele2 in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Lines'):
        for lines in ele2.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}KeyValueOfguidanyType'):
            x,y = cal_max_size(lines)
            if x > max_x:
                max_x = x
            if y > max_y:
                max_y = y
    dims = dict.fromkeys(['height','width'])
    dims['height'] = max_y + 5
    dims['width'] = max_x + 5
    return dims

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
def get_contribs(_root):
    for sum in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}MetaInformation'):
        for _contribs in sum.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Contributors'):
            contribs = _contribs.text.split(',')
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

    # get file name
    base_name = os.path.splitext(file_path)[0]
    file_path = base_name + '.json'

    model = dict.fromkeys(['summary','detail'])
    summary = get_sum(root)
    model['summary'] = summary
    model['detail'] = dict.fromkeys(['contributors','diagrams','reviewer'])
    model['detail']['contributors'] = get_contribs(root)
    model['detail']['reviewer'] = get_reviewers(root)

    # find all note elements
    notes = get_notes(root)

    diagrams = list()
    model['detail']['diagrams'] = diagrams
    # add diagrams
    with open(file_path, 'w') as outfile:
        # get elements, borders, and notes
        for child in root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}DrawingSurfaceList'):
            diagram_num = 0
            # indexing/numbering for TD elements
            z = 1
            model['detail']['diagrams'].append(dict.fromkeys(['title','thumbnail','id', 'diagramJson', 'size','diagramType']))
            # default to STRIDE for MS TMT, although you can use different methodology/category in an MS template, it's not
            # common (TODO: although in future we should hanlde any non-STRIDE threats). "STRIDE per element" is MS TMT defualt methodology
            # note that with the way MS TMT uses "STRIDE per element", all MS threats origionate in FLOWS only (generated threats are sorted by "interactor")  
            # even if they deal with the target element
            model['detail']['diagrams'][diagram_num]['diagramType'] = "STRIDE"
            model['detail']['diagrams'][diagram_num]['thumbnail'] = "./public/content/images/thumbnail.stride.jpg"
            # cells contain all stencils and flows
            model['detail']['diagrams'][diagram_num]['diagramJson'] = dict.fromkeys(['cells'])
            model['detail']['diagrams'][diagram_num]['diagramJson']['cells'] = list()
            for ele in child.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}DrawingSurfaceModel'):
                model['detail']['diagrams'][diagram_num]['size'] = get_diagram_size(ele)
                for header in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Header'):
                    diagram = header.text
                    model['detail']['diagrams'][diagram_num]['title'] = diagram
                for ele2 in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Borders'):
                    # this level enumerates a model's elements
                    for borders in ele2.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}KeyValueOfguidanyType'):
                        stencil = get_element(borders, z)
                        model['detail']['diagrams'][diagram_num]['diagramJson']['cells'].append(stencil)
                        z=z+1
                # TODO: add lines back in when cords are fixes        
                # for ele2 in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Lines'):
                #     # this level enumerates a model's elements
                #     for lines in ele2.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}KeyValueOfguidanyType'):
                #     # Flows. Unlike stencils, flows have a source and target guids
                #         line = get_element(lines, z)
                #         model['detail']['diagrams'][diagram_num]['diagramJson']['cells'].append(line)
                #         z=z+1
                # diagram id
                model['detail']['diagrams'][diagram_num]['id'] = diagram_num
                diagram_num = diagram_num + 1
        # Serializing json
        json.dump(model, outfile, indent=4, sort_keys=False)


if __name__ == '__main__':
   main()

