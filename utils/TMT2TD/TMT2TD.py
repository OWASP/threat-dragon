## the script converts MS TMT models to Threat Dragon models
## goal: parse TMT XML model into a dict that can be dumped into THreat Dragon's json format
## https://github.com/jgadsden/owasp-threat-dragon-models/tree/master/ThreatDragonModels

import xml.etree.ElementTree as ET
import os
import json
import tkinter as tk
from tkinter import filedialog

# namespace for prop elements
ele_namespace = {'b': 'http://schemas.datacontract.org/2004/07/ThreatModeling.KnowledgeBase'}
any_namespace = {'a': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays'}

# get guid src/target and vertices
def get_flow_points(_cell, ele):
    for src_guid in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}SourceGuid'):
        _src_guid = src_guid.text
    for tar_guid in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}TargetGuid'):
        _tar_guid = tar_guid.text
    for vert_x in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}HandleX'):
        _vert_x = int(vert_x.text)
    for vert_y in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}HandleY'):
        _vert_y = int(vert_y.text)
    _cell['source'] = dict.fromkeys(['id'])
    _cell['target'] = dict.fromkeys(['id'])
    _cell['source']['id'] = _src_guid
    _cell['target']['id'] = _tar_guid
    _cell['vertices'].append(dict.fromkeys(['x','y']))
    _cell['vertices'][0]['x'] = _vert_x
    _cell['vertices'][0]['y'] = _vert_y
    return

# get points for Boundary (BoundaryLines only in MS TMT)
def get_boundary_points(_cell,ele):
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
    _cell['source'] = dict.fromkeys(['x', 'y'])
    _cell['target'] = dict.fromkeys(['x', 'y'])
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
def calc_boundary_box(cell, ele):
    cell['vertices'].append(dict.fromkeys(['x','y']))
    cell['vertices'].append(dict.fromkeys(['x','y']))
    cell['vertices'].append(dict.fromkeys(['x','y']))
    cell['source'] = dict.fromkeys(['x', 'y'])
    cell['target'] = dict.fromkeys(['x', 'y'])
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
    for y in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Height'):
        cell['size']['height'] = int(y.text)
    for width in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Width'):
        cell['size']['width'] = int(width.text)
    for x in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Left'):
        cell['position']['x'] = int(x.text)
    for top in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Top'):
        cell['position']['y'] = int(top.text)
    return cell

# this function finded values from prop name
def get_ele_prop(ele, prop_name):
    # element properties are at this level
    for props in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Properties'):
        for types in props.findall('.//a:anyType', any_namespace):
        # get all child elements of anyType element, all properties located here
            for dis_name in types.findall('.//b:DisplayName', ele_namespace):   
                temp_prop = dis_name.text
                # TODO: handle getting values from SelectedIndex if index avilable
                 #selection = types.find('.//b:SelectedIndex', ele_namespace)   
                if temp_prop == prop_name:
                    for val in types.findall('.//b:Value', ele_namespace): 
                        value = val.text
                    return value
    return None

def set_cell_attribs(cell, _name):
    scope = ""
    threats = ""
    if len(cell['threats']) == 0:
        del cell['threats']
        cell['hasOpenThreats'] = False
    if (cell['hasOpenThreats']):
        threats = str('hasNoOpenThreats')
    else:
        threats = str('hasNoOpenThreats')

    if (cell['outOfScope']):
        scope = str('isOutOfScope')
    else:
        scope = str('isInScope')
    if cell['type'] == "tm.Flow":
        cell['attrs'] = dict.fromkeys(['.marker-target','.connection'])
        #check and set both hasNoOpenThreats isInScope vars based on MS TMT
        cell['attrs']['.marker-target'] = dict.fromkeys(['class'])
        #build sentance
        cell['attrs']['.marker-target']['class'] = "marker-target " + threats + " isInScope"
        cell['attrs']['.connection'] = dict.fromkeys(['class'])
        cell['attrs']['.connection']['class'] = "connection " + threats+ " " + scope
    #everything that's not a flow
    else:
        cell['attrs'] = dict.fromkeys(['.element-shape','text','.element-text'])
        cell['attrs']['.element-shape'] = dict.fromkeys(['class'])
        cell['attrs']['.element-shape']['class'] = "element-shape " + threats+ " " + scope
        cell['attrs']['.element-text'] = dict.fromkeys(['class'])
        cell['attrs']['.element-text']['class']= "element-text " + threats + " isInScope"
        cell['attrs']['text'] = dict.fromkeys(['text'])
        cell['attrs']['text']['text'] = _name
    return cell

# find type, source, target, and vertices
def find_ele_type(tmt_type, ele, _name):
    tmt_type = tmt_type['{http://www.w3.org/2001/XMLSchema-instance}type']
    if tmt_type == "Connector" or tmt_type == "LineBoundary" or tmt_type == "BorderBoundary":
        # flows have source and target, so choose different dict format
        cell = dict.fromkeys(['type', 'size', 'smooth','source','target','vertices','id', 'z','hasOpenThreats','threats','attrs'])
        cell['vertices'] = list()
        if tmt_type == "Connector":
            cell['labels'] = list()
            cell['labels'].append(dict.fromkeys(['position','attrs']))
            cell['labels'][0]['position'] = 0.5
            cell['labels'][0]['attrs'] = dict.fromkeys(['text'])
            cell['labels'][0]['attrs']['text'] = dict.fromkeys(['text', 'font-weight','font-size'])
            cell['labels'][0]['attrs']['text']['text'] = _name
            cell['labels'][0]['attrs']['text']['font-weight'] = str(400)
            cell['labels'][0]['attrs']['text']['font-size'] = 'small'
            ele_type = "tm.Flow"
        elif tmt_type == "LineBoundary" or tmt_type == "BorderBoundary":
            ele_type = "tm.Boundary"
            if tmt_type == "BorderBoundary":
                cell = calc_boundary_box(cell, ele)
            cell['attrs'] = dict()
        else:
            return None
        #  get cords from MS TMT "lines" since boundaries and lines are different in MS TMT
        if tmt_type == "LineBoundary":
            get_boundary_points(cell, ele)
        elif tmt_type == "Connector":
            get_flow_points(cell, ele)
        cell['smooth'] = True
        cell['size'] = dict.fromkeys(['width','height'])
        # defaults size for boundary or flows
        cell['size']['width'] = int(10)
        cell['size']['height'] = int(10)

    # must be a process, datastore, or EI
    else:
        cell = dict.fromkeys(['type','size','position','angle','id', 'z','hasOpenThreats','threats','attrs'])
        cell['size'] = dict.fromkeys(['width','height'])
        cell['position'] = dict.fromkeys(['x','y'])
        cell['angle'] = int(0)
        if tmt_type == "StencilRectangle":
            ele_type = "tm.Actor"
        elif tmt_type == "StencilEllipse":
            ele_type = "tm.Process"
        elif tmt_type == "StencilParallelLines":
            ele_type = "tm.Store"
        else:
            return None
        cell = get_ele_size(cell, ele)
    cell['threats'] = list()
    cell['type'] = ele_type
    return cell

# get and element (or cell)
def get_element(ele, _z, _root, _m_guid):
        # GUID also at this level
    for ele4 in ele.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}Value'):
        # find element type and get cell dict format
        name = get_ele_prop(ele4,'Name')
        cell = find_ele_type(ele4.attrib, ele4, name)
        
        if(get_ele_prop(ele4, 'Out Of Scope') == 'true'):
            cell['outOfScope'] = True
            cell['reasonOutOfScope'] = get_ele_prop(ele4, 'Reason For Out Of Scope')
        else:
            cell['outOfScope'] = False
        # get GUID
        for guid in ele4.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Guid'):
            cell['id'] = guid.text
        # add threats in for flows only
        if _root and _m_guid:
            cell = get_threats(_root, cell, _m_guid)
        cell = set_cell_attribs(cell, name)
        cell['z'] = _z
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
    # some boundaries had trouble showing. Increase window by 10% to fit things
    # TODO: this offset only happens on +x,-y; will need to also shift all elements position 13% on -x,+y
    #       to make everything look really pretty
    dims['height'] = round(max_y * 1.13)
    dims['width'] = round(max_x * 1.13)
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
    if not title:
        title = "TMT import"
    if not desc:
        desc = "Imported from Microsoft Threat Modeling Tool .tm7 file"
    _sum['title'] = title
    _sum['owner'] = owner
    _sum['description'] = desc
    return _sum

# get the contributors as a list
def get_contribs(_root):
    for sum in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}MetaInformation'):
        for _contribs in sum.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Contributors'):
            if _contribs.text is None:
                return None
            contribs = _contribs.text.split(',')
    contrib_list = []
    c_dict = dict.fromkeys(['name'])
    for p in contribs:
        c_dict['name'] = p
        contrib_list.append(c_dict)
    return contrib_list

# get the reviewers as a list
def get_reviewers(_root):
    for sum in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}MetaInformation'):
        for _reviewrs in sum.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Reviewer'):
            reviewers = _reviewrs.text
    return reviewers

# get threats here. Threats are only in "interactors" (or flows) in MS TMT
# check diagram guid and cell guid before adding
def get_threats(_root, _cell, d_guid):
    for ele in _root.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}ThreatInstances'):
        for threat in ele.findall('.//a:*', any_namespace):
            flo_guid = ""
            for t_vals in threat.findall('.//a:Value', any_namespace):
                for f_guid in t_vals.findall('.//b:FlowGuid', ele_namespace):
                    flo_guid= f_guid.text
                for dia_guid in t_vals.findall('.//b:DrawingSurfaceGuid', ele_namespace):
                    # compare guids
                    if dia_guid.text == d_guid and flo_guid == _cell['id']:
                        # get threat info and add to cell here
                        threat_mits = ""
                        threat_dict = dict.fromkeys(['status','severity','modelType','type','title','description','mitigation'])
                        m_type = "STRIDE"
                        for state in t_vals.findall('.//b:State', ele_namespace):
                            # convert to TD's status
                            # TD does not support "not applicable" and "needs investigation" threat statuses, default to Open
                            t_status = "Open"
                            if state.text == "Mitigated":
                                t_status = "Mitigated"
                        for priority in t_vals.findall('.//b:Priority', ele_namespace):
                            t_severity = priority.text
                        for props in t_vals.findall('.//b:Properties', ele_namespace):
                            for prop2 in props.findall('.//a:*', any_namespace):
                                for _key in prop2.findall('.//a:Key', any_namespace):
                                    if _key.text == 'Title':
                                        for _val in prop2.findall('.//a:Value', any_namespace):
                                            threat_title = _val.text
                                    elif _key.text == 'UserThreatDescription':
                                        for _val in prop2.findall('.//a:Value', any_namespace):
                                            threat_desc = _val.text
                                    elif _key.text == 'UserThreatCategory':
                                        for _val in prop2.findall('.//a:Value', any_namespace):
                                            threat_cat = _val.text
                                    # "Mitigations" is not a default threat propery in MS TMT like it is in TD
                                    # Therefore we are searching for a custom prop that could be called different things
                                    elif "itigations" in _key.text:
                                        for _val in prop2.findall('.//a:Value', any_namespace):
                                            threat_mits = _val.text
                        # build thraet dict and add
                        threat_dict['status'] = t_status
                        threat_dict['severity'] = t_severity
                        threat_dict['modelType'] = m_type
                        threat_dict['type'] = threat_cat
                        threat_dict['title'] = threat_title
                        threat_dict['description'] = threat_desc
                        if threat_mits != None:
                            threat_dict['mitigation'] = threat_mits
                        _cell['threats'].append(threat_dict)
    return _cell

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
            model['detail']['diagrams'].append(dict.fromkeys(['title','thumbnail', 'guid','id', 'diagramJson', 'size','diagramType']))
            # default to STRIDE for MS TMT, although you can use different methodology/category in an MS template, it's not
            # common. "STRIDE per element" is MS TMT's defualt methodology note that with the way MS TMT uses "STRIDE per element",
            #  all MS threats origionate in FLOWS only (generated threats are sorted by "interactor") even if they deal with the target element
            #TODO: we should hanlde any non-STRIDE threats and check ThreatModel -> KnowledgeBase -> ThreatCategories before choosing stride
            model['detail']['diagrams'][diagram_num]['diagramType'] = "STRIDE"
            model['detail']['diagrams'][diagram_num]['thumbnail'] = "./public/content/images/thumbnail.stride.jpg"
            # cells contain all stencils and flows
            model['detail']['diagrams'][diagram_num]['diagramJson'] = dict.fromkeys(['cells'])
            model['detail']['diagrams'][diagram_num]['diagramJson']['cells'] = list()
            for ele in child.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}DrawingSurfaceModel'):
                #Setting diagram_num to zero here is necessary to prevent index out of bounds error on some models
                diagram_num = 0
                model['detail']['diagrams'][diagram_num]['size'] = get_diagram_size(ele)
                for d_guid in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model.Abstracts}Guid'):
                    m_guid = d_guid.text
                    model['detail']['diagrams'][diagram_num]['guid'] = m_guid
                for header in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Header'):
                    model['detail']['diagrams'][diagram_num]['title'] = header.text
                for ele2 in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Borders'):
                    # this level enumerates a model's elements
                    for borders in ele2.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}KeyValueOfguidanyType'):
                        stencil = get_element(borders, z, None, None)
                        model['detail']['diagrams'][diagram_num]['diagramJson']['cells'].append(stencil)
                        z=z+1       
                for ele2 in ele.findall('{http://schemas.datacontract.org/2004/07/ThreatModeling.Model}Lines'):
                    # this level enumerates a model's elements
                    for lines in ele2.findall('{http://schemas.microsoft.com/2003/10/Serialization/Arrays}KeyValueOfguidanyType'):
                    # Flows. Unlike stencils, flows have a source and target guids
                        line = get_element(lines, z, root, m_guid)
                        model['detail']['diagrams'][diagram_num]['diagramJson']['cells'].append(line)
                        z=z+1
                model['detail']['diagrams'][diagram_num]['id'] = diagram_num
                diagram_num = diagram_num + 1

        # Serializing json
        json.dump(model, outfile, indent=2, sort_keys=False)


if __name__ == '__main__':
   main()

